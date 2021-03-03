const express = require('express');
const {
    getGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    getPlansGroups,
    getPlan,
    createPlan,
    updatePlan,
    deletePlan
} = require('./groups.controler')

const { permit } = require('../../utils/middlewares/authenticacion')
    // const { verifyToken } = require('../utils/middlewares/authenticacion');

const app = express();

const bodyParser = require('body-parser');

app.get('/api/groups', getGroups);
app.get('/api/groups/:groupID', getGroup);
app.post('/api/groups', permit('admin'), createGroup);
app.put('/api/groups/:groupID', permit('admin'), updateGroup);
app.delete('/api/groups/:groupID', permit('admin'), deleteGroup);
app.get('/api/groups/plans/:groupID', getPlansGroups);
app.get('/api/groups/plans/:groupID/:planID', getPlan);
app.post('/api/groups/plans/:groupID', permit('admin'), createPlan);
app.put('/api/groups/plans/:groupID/:planID', permit('admin'), updatePlan);
app.delete('/api/groups/plans/:groupID/:planID', permit('admin'), deletePlan);

module.exports = app;