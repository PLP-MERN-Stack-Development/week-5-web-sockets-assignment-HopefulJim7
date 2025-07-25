const moment = require('moment');
const User = require('../models/User')

module.exports = (io, socket, users, typingUsers) => {
  // On join
  socket.on('user_join', async (username) => {
    const user = await User.findOneAndUpdate(
      { username },
      {
        username,
        socketId: socket.id,
        lastSeen: new Date(),
        active: true,
      },
      { upsert: true, new: true }
    );

    users[socket.id] = user;
    io.emit('user_list', Object.values(users));
    io.emit('user_joined', { username, id: socket.id });
    console.log(`${username} joined`);
  });

  // Heartbeat
  socket.on('heartbeat', async () => {
    const user = users[socket.id];
    if (user) {
      user.lastSeen = new Date();
      user.active = true;
      await User.findByIdAndUpdate(user._id, {
        lastSeen: user.lastSeen,
        active: true,
      });
    }
  });

  // Idle detection
  const idleInterval = setInterval(async () => {
    const now = moment();
    for (const [id, user] of Object.entries(users)) {
      if (moment(user.lastSeen).diff(now, 'seconds') < -30) {
        user.active = false;
        await User.findByIdAndUpdate(user._id, { active: false });
        io.to(id).emit('status_update', { active: false });
      }
    }
    io.emit('user_list', Object.values(users));
  }, 15000);

  // Typing logic
  socket.on('typing', (isTyping) => {
    const username = users[socket.id]?.username;
    if (username) {
      isTyping
        ? typingUsers[socket.id] = username
        : delete typingUsers[socket.id];
      io.emit('typing_users', Object.values(typingUsers));
    }
  });

  // Disconnect
  socket.on('disconnect', async () => {
    const leftUser = users[socket.id];
    if (leftUser) {
      await User.findByIdAndUpdate(leftUser._id, {
        active: false,
        lastSeen: new Date(),
      });
      io.emit('user_left', { username: leftUser.username, id: socket.id });
      console.log(`${leftUser.username} disconnected`);
    }

    delete users[socket.id];
    delete typingUsers[socket.id];
    io.emit('user_list', Object.values(users));
    io.emit('typing_users', Object.values(typingUsers));
    clearInterval(idleInterval);
  });
};
