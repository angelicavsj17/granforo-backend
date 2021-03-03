const express = require('express');

const {
    createUser,
    loginUser,
    refreshToken,
    updateUser,
    getUser
} = require('./users.controler');



const app = express();

const bodyParser = require('body-parser');
const { permit } = require('../../utils/middlewares/authenticacion');

app.post('/api/users', createUser);

app.put('/api/users/:userID', updateUser);

app.post('/api/login', loginUser);

app.get('/api/refresh/:refreshID/:userID', refreshToken);

app.get('/api/users', permit('admin', 'Espectador', 'organizador', 'Panelista'), getUser);

module.exports = app;