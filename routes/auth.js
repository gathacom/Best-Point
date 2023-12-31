const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');

router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.post('/register',wrapAsync(async (req, res) => {
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
}))

router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/login', passport.authenticate('local',{
    failureRedirect: '/login',
    failureFlash: {
        type: 'error_msg', 
        message: 'Invalid Username or Password'
    }
}),(req,res) => {
    req.flash('success_msg', 'Successfully logged in!'); 
    res.redirect('/places');   
})

router.post('/logout', (req, res) => {
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success_msg', 'Successfully logged out!');
        res.redirect('/places');
    }); 
})

module.exports = router