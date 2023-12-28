const User = require('../models/user');
module.exports.registerForm = (req, res) => {
    res.render('auth/register')
}

module.exports.register = async (req, res) => {
    try {
        const {firstName,lastName, email, username, password} = req.body;
        const user = new User({firstName,lastName, email, username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, (err) => {
            if(err){ 
                return next(err);
            }
            req.flash('success_msg', 'Successfully signed up and signed in!');
            res.redirect('/places');
        })
    } catch (error) {
        req.flash('error_msg', error.message);
        res.redirect('/register');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('auth/login')
}

module.exports.login = (req,res) => {
    req.flash('success_msg', 'Successfully logged in!'); 
    res.redirect('/places');   
}

module.exports.logout = (req, res) => {
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success_msg', 'Successfully logged out!');
        res.redirect('/places');
    }); 
}