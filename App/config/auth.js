module.exports = {
  ensureAuthenticated: (req, res, next) => {
    // console.log('req.session.user.uid : ' + req.session.user.uid)

    if (req.session.user && req.session.user.uid) {
      return next();
    } else {
      const alerts = [];
      alerts.push({ msg: "You need to login first." });
      res.render("login", {
        alerts,
      });
    }
  },
};
