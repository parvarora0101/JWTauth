// Catches errors from controllers (via next(error)) and mongoose validation errors
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate field value entered' });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server error',
  });
};

const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

module.exports = { errorHandler, notFound };
