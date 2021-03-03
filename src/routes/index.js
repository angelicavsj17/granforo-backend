const express = require('express');
const { auth } = require('../utils/google/auth');

const app = express();
app.use(require('../modules/groups/groups.routes'));
app.use(require('../modules/users/users.routes'));
app.use(require('../modules/events/events.routes'));
app.use(require('../modules/analytics/analytics.routes'));
app.set(auth())
app.use(require("../modules/pays"));
app.use(require("../modules/contact/contact.routes"));

module.exports = app;