const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      return res.status(401).send({ error: 'You are not authorized to access this resource' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: 'You are not authorized to access this resource' });
  }
};

module.exports = authenticate;