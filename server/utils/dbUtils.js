module.exports = {
  buildProjection: (fields = []) => {
    return fields.reduce((acc, field) => {
      acc[field] = 1;
      return acc;
    }, {});
  },
  isConnected: (mongoose) => {
    return mongoose.connection.readyState === 1;
  },
};