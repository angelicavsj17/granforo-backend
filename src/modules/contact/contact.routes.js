const express = require('express');
const hasErrors = require('../../utils/hasErrors');
const { postContact } = require('./contact.controller');
const contactValidator = require('./validator');
const route = express.Router();

route.post('/api/contact', contactValidator, hasErrors, postContact)

module.exports = route