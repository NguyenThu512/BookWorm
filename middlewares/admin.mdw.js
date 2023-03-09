module.exports = function admin(req, res, next) {

  if ((req.session.auth === true && req.session.authUser.permission==0) || req.session.auth === false) {
    return res.redirect('/');
  }
  next();
}