const express = require("express");

const { createPay, createPayTicket, getPayments, buyProduct } = require("./pays.controler");

const app = express();

app.post("/api/pays/:userId", createPay);

app.post("/api/pays/buyticket/:userId/:eventId", createPayTicket);

app.post('/api/pays/buyproduct/:userId/:productId/:color/:size', buyProduct)

app.get("/api/pays/:id", getPayments);

module.exports = app;
