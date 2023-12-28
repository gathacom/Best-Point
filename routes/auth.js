const express = require('express');
const passport = require('passport');
const router = express.Router();
const AuthController = require('../controllers/auth');
const wrapAsync = require('../utils/wrapAsync');

router.route('/register')
    .get(AuthController.registerForm)
    .post(wrapAsync(AuthController.register))

router.route('/login')
.get(AuthController.loginForm)
.post(passport.authenticate('local',{
    failureRedirect: '/login',
    failureFlash: {
        type: 'error_msg', 
        message: 'Invalid Username or Password'
    }
}),AuthController.login)

router.post('/logout', AuthController.logout)

module.exports = router