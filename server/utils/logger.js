module.exports = {
  info: (message) => {
    console.log(`[INFO - ${new Date().toISOString()}]: ${message}`);
  },
  error: (message) => {
    console.error(`[ERROR - ${new Date().toISOString()}]: ${message}`);
  },
  debug: (message) => {
    if (process.env.DEBUG === 'true') {
      console.log(`[DEBUG - ${new Date().toISOString()}]: ${message}`);
    }
  },
};