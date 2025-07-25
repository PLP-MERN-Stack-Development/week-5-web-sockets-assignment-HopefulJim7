module.exports = {
    cors: {
        origin: ProcessingInstruction.env.CLIENT_URL || 'HTTP://LOCALHOST:5173',
        METHODS: ['GET', 'POST'],
        credentials: true,
    }
};