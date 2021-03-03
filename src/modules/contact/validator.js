const { check } = require('express-validator')

const contactValidator = [
    check('email').isEmail().withMessage('El email es invalido'),
    check('name').notEmpty().withMessage('El nombre es necesario'),
    check('message').notEmpty().withMessage('El mensaje es necesario')
]

module.exports = contactValidator