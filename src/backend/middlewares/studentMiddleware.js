const jwt = require('jsonwebtoken');
const StudentModel = require('../models/StudentModel');

const authenticateStudent = async (req, res, next) => {
  const token = req.cookies.accessTokenStudent;
  if (!token) {
    return res.status(401).json({ message: 'Access token student is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Invalid token structure' });
    }

    const user = await StudentModel.findOne({
      where: {
        studentCode: decoded.id // Ensure the ID is correctly used here
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid access token' });
    }

    req.user = user; // Attach the user to the request object for further use
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid access token1',
      err
    });
  }
};

module.exports = authenticateStudent;
