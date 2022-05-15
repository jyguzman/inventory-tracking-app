const express = require('express');
const locationsApi = express();

locationsApi.get('/locations', (req, res) => {

})

locationsApi.post('/locations/create', (req, res) => {

})

locationsApi.put('/locations/assign/:itemId', (req, res) => {

})

module.exports = { locationsApi };