const express = require('express');
const passport = require('passport');
const router = express.Router();
const usercontroller = require('../controller/user');

router.get('/register', usercontroller.renderregister)
router.post('/register', usercontroller.register)

router.get('/login', usercontroller.renderlogin)
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usercontroller.login)

router.get('/logout', usercontroller.logout)
module.exports = router;