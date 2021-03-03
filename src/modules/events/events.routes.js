const express = require('express');
const {
    getEvents,
    getEvent,
    createEvent,
    queryEvents,
    updateEvent,
    deleteEvent,
    getCountries,
    getCountry,
    createCountry,
    updateCountry,
    deleteCountry,
    getTypes,
    getType,
    createType,
    updateType,
    deleteType,
    getMostSeenEvents,
    createStream,
    deleteStream,
    getMyEvents,
    getProducts,
    getAllMyCreatedEvents
} = require('./events.controler')

const { permit } = require('../../utils/middlewares/authenticacion')

const app = express();

const bodyParser = require('body-parser');
const { verify } = require('../../utils/google/auth');

// events
app.get('/api/events', permit('admin', 'Espectador', 'organizador', 'Panelista'), getEvents);
app.get('/api/ecommerce/:eventId', permit('admin', 'Espectador', 'organizador', 'Panelista'), getProducts)
app.get('/api/mycreatedevents', getAllMyCreatedEvents)
app.get('/api/myevents', permit('admin', 'Espectador', 'organizador', 'Panelista'), getMyEvents);
app.get('/api/events/:eventID', permit('admin', 'Espectador', 'organizador', 'Panelista'), getEvent);
app.post('/api/events', permit('admin', 'organizador', 'Panelista'), createEvent);
app.put('/api/events/:eventID', permit('admin', 'organizador'), updateEvent);
app.delete('/api/events/:eventID', permit('admin', 'organizador'), deleteEvent);
app.post('/api/events/:eventID/createStream', permit('admin', 'organizador'), createStream);
app.delete('/api/events/:eventID/deleteStream', permit('admin', 'organizador', 'Panelista'), deleteStream);

// Countries
app.get('/api/countries', permit('admin', 'Espectador', 'organizador', 'Panelista'), getCountries);
app.get('/api/countries/:countryID', permit('admin', 'Espectador', 'organizador', 'Panelista'), getCountry);
app.post('/api/countries', permit('admin', 'organizador'), createCountry);
app.put('/api/countries/:countryID', permit('admin', 'organizador'), updateCountry);
app.delete('/api/countries/:countryID', permit('admin', 'organizador'), deleteCountry);

// Type events
app.get('/api/type_events', permit('admin', 'Espectador', 'organizador', 'Panelista'), getTypes);
app.get('/api/type_events/:typeID', permit('admin', 'Espectador', 'organizador', 'Panelista'), getCountry);
app.post('/api/type_events', permit('admin', 'organizador'), createType);
app.put('/api/type_events/:typeID', permit('admin', 'organizador'), updateType);
app.delete('/api/type_events/:typeID', permit('admin', 'organizador'), deleteType);

// Query
app.post('/api/query/events', permit('admin', 'Espectador', 'organizador', 'Panelista'), queryEvents);
app.get('/api/mostseen/events', getMostSeenEvents)
module.exports = app;