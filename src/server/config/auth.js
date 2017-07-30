module.exports = function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}