module.exports = {
  isNonEmptyString: (value) => {
    return typeof value === 'string' && value.trim().length > 0;
  },
  isValidEmail: (email) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  },
  isValidObjectId: (id) => {
    return /^[a-fA-F0-9]{24}$/.test(id);
  },
};