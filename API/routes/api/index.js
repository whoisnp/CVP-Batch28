const express = require('express');
const route = express.Router();

route.use('/users', require('./users'));

exports = module.exports = route;