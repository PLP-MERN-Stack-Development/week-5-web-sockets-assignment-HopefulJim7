module.exports = {
  formatTimestamp: (date = new Date()) => {
    return date.toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });
  },
  sanitizePayload: (payload) => {
    const sanitized = { ...payload };
    delete sanitized.password; // example
    return sanitized;
  },
};