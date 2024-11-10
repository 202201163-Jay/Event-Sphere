const jwt = require('jsonwebtoken');
const College = require('../Models/College');
const User = require('../Models/User');

const authMiddleware = async (req, res, next) => {
  // 1. Get the token from the request header
  const token = req.header('x-auth-token');
  
  // 2. If no token, deny access
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // 3. Verify the token and decode the user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded token to the request object

    // 4. Fetch the user or college based on the type
    if (req.user.type === 'college') {
      const college = await College.findById(req.user.userId);
      req.user = college; // Attach college information to the request object
    } else {
      const student = await User.findById(req.user.userId);
      req.user = student; // Attach student information to the request object
    }

    // 5. Check if user is a college (if needed) and allow the request to proceed
    if (req.user.type !== 'college') {
      // Optional: You can restrict certain routes (like creating blogs) to only colleges
      return res.status(403).json({ message: 'Forbidden: Only colleges can create blogs' });
    }

    // 6. Allow the request to continue
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token is not valid' }); // Invalid token
  }
};

module.exports = authMiddleware;
