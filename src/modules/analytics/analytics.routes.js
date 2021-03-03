const express = require('express');
const { getDailyEvents, getMaxSpectators, getEventsSpectators, getEventAnalytics, getMyEventsAnalytics, getSuscribers } = require('./analytics.controller');

const app = express();
app.get('/api/analytics/dailyevents', getDailyEvents)
app.get('/api/analytics/suscribers', getSuscribers)
app.get('/api/analytics/spectators', getMaxSpectators)
app.get('/api/analytics/stadistics', getMyEventsAnalytics)
app.get('/api/analytics/events/spectators/:frequence/:year', getEventsSpectators)
app.get('/api/analytics/event/:id', getEventAnalytics)

module.exports = app;