/**
 * authorize(...roles) — restricts a route to users with one of the given roles.
 * Must be used AFTER the protect middleware.
 *
 * Usage:
 *   router.get('/admin-only', protect, authorize('admin'), handler);
 *   router.post('/book', protect, authorize('patient', 'admin'), handler);
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied — role '${req.user.role}' is not permitted`,
      });
    }

    next();
  };
};

module.exports = { authorize };
