const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('index')
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/reset-pswd', (req, res) => {
    res.render('reset-pswd-send-otp')
})


router.use('/users', require('./users'));
router.use('/appointments', require('./appointments'));

module.exports = router;