const Message = require('../models/Message');
const handlePresence = require('./presenceController');

module.exports = (io, socket, users, messages, typingUsers) => {
  console.log(`User connected: ${socket.id}`);

  // 🔄 Presence Events
  handlePresence(io, socket, users, typingUsers);

  // 💬 Chat messages (MongoDB + memory)
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
      io.emit('receive_message', liveMessage); // fallback
    }
  });

  // 🔐 Private messaging
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
        room: null,
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

  // 📦 Delivery Confirmation
  socket.on('message_delivered', async (msgId) => {
    try {
      await Message.findByIdAndUpdate(msgId, { isDelivered: true });
      io.emit('update_delivery_status', { id: msgId, isDelivered: true });
    } catch (err) {
      console.error('🛑 Failed to update delivery status:', err.message);
    }
  });

  // ✅ Read Receipt
  socket.on('message_read', async (msgId) => {
    try {
      await Message.findByIdAndUpdate(msgId, { isRead: true });
      io.emit('update_read_status', { id: msgId, isRead: true });
    } catch (err) {
      console.error('🛑 Failed to update read status:', err.message);
    }
  });
};