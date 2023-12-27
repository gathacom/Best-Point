module.exports = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.flash('error_msg', 'You must be logged in');
        res.redirect('/login')
    }
    next();
}