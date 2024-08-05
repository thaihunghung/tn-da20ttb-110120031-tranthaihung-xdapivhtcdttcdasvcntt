const jwt = require('jsonwebtoken');

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      const { accessToken } = req.cookies;

      if (!accessToken) {
        return res.status(401);
      }

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      const { permission } = decoded;

      if (permission < requiredPermission) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = checkPermission;
