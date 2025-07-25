module.exports = (io, socket) => {
  // Emit activity to others or log for analytics
  socket.on('user_activity', (payload) => {
    // Example: { type: 'NAVIGATE', page: '/dashboard', timestamp: Date.now() }
    console.log(`Activity from ${socket.id}:`, payload);

    // Broadcast to others (optional, depends on use case)
    socket.broadcast.emit('user_activity_broadcast', {
      id: socket.id,
      ...payload,
    });
  });

  // Optional: Hook into frontend analytics
  socket.on('custom_metric', (metric) => {
    // Example: { label: 'button_click', category: 'interaction', value: 1 }
    console.log(`Metric logged:`, metric);
  });
};