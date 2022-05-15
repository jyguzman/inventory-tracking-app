const express = require('express');
const inventoryAPI = express();

inventoryAPI.get('/items/all', (req, res) => {

});

inventoryAPI.get('/items/:itemId', (req, res) => {

})

inventoryAPI.post('/items/create', (req, res) => {

})

inventoryAPI.put('/items/update/:id', (req, res) => {

})

inventoryAPI.delete('/items/delete/:itemId', (req, res) => {

})

module.exports = { inventoryAPI }

