 const { verifyToken } = require('../utils/tokenUtils');

 module.exports = (req, res, next) => {
   const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"

   if (!token) {
     return res.status(401).json({ error: 'Access token missing' });
   }

   const decoded = verifyToken(token);
   if (!decoded) {
     return res.status(403).json({ error: 'Invalid or expired token' });
   }

   req.user = decoded; // Attach user info for later use
   next();
 };

