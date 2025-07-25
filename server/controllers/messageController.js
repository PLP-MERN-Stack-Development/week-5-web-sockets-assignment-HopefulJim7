const Message = require('../models/Message');

module.exports = (io, socket, users, messages, typingUsers) => {
  console.log(`User connected: ${socket.id}`);

  // User joins
  socket.on('user_join', (username) => {
    users[socket.id] = { username, id: socket.id };
    io.emit('user_list', Object.values(users));
    io.emit('user_joined', { username, id: socket.id });
    console.log(`${username} joined the chat`);
  });

  // Chat messages
  socket.on('send_message', async (messageData) => {
    const liveMessage = {
      ...messageData,
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      timestamp: new Date().toISOString(),
      isPrivate: false,
    };

    messages.push(liveMessage);
    if (messages.length > 100) messages.shift();

    try {
      const message = new Message({
        sender: users[socket.id]?.dbId || null,
        text: messageData.text,
        isPrivate: messageData.isPrivate || false,
        room: messageData.room || 'global',
        recipient: messageData.recipientId || null,
      });

      const saved = await message.save();
      io.emit('receive_message', {
        ...liveMessage,
        id: saved._id,
        timestamp: saved.timestamp,
      });
    } catch (err) {
      console.error('🛑 Error saving message:', err.message);
      io.emit('receive_message', liveMessage); // fallback emit
    }
  });

  // Typing indicator
  socket.on('typing', (isTyping) => {
    const username = users[socket.id]?.username;
    if (username) {
      isTyping
        ? typingUsers[socket.id] = username
        : delete typingUsers[socket.id];
      io.emit('typing_users', Object.values(typingUsers));
    }
  });

  // Private message
  socket.on('private_message', async ({ to, message, recipientId }) => {
    const messageData = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
    };

    try {
      const privateMsg = new Message({
        sender: users[socket.id]?.dbId || null,
        text: message,
        isPrivate: true,
        recipient: recipientId || null,
      });

      const saved = await privateMsg.save();
      messageData.id = saved._id;
      messageData.timestamp = saved.timestamp;
    } catch (err) {
      console.error('🛑 Error saving private message:', err.message);
    }

    socket.to(to).emit('private_message', messageData);
    socket.emit('private_message', messageData);
  });

  // Delivery confirmation
  socket.on('message_delivered', async (msgId) => {
    try {
      await Message.findByIdAndUpdate(msgId, { isDelivered: true });
      io.emit('update_delivery_status', { id: msgId, isDelivered: true });
    } catch (err) {
      console.error('🛑 Failed to update delivery status:', err.message);
    }
  });

  // Read receipt
  socket.on('message_read', async (msgId) => {
    try {
      await Message.findByIdAndUpdate(msgId, { isRead: true });
      io.emit('update_read_status', { id: msgId, isRead: true });
    } catch (err) {
      console.error('🛑 Failed to update read status:', err.message);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    const leftUser = users[socket.id];
    if (leftUser) {
      io.emit('user_left', { username: leftUser.username, id: socket.id });
      console.log(`${leftUser.username} left the chat`);
    }
    delete users[socket.id];
    delete typingUsers[socket.id];
    io.emit('user_list', Object.values(users));
    io.emit('typing_users', Object.values(typingUsers));
  });
};