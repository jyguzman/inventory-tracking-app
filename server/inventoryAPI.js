const express = require('express');
const ejs = require('ejs');
const sqlite3 = require('sqlite3');
const inventoryDB = new sqlite3.Database('inventory.db');
const { isValidCreatedItem, isValidNumberInput } = require('../utils/input_validation_functions');
const { urlencoded } = require('body-parser');
const db_utils = require('../utils/db_utils');

const inventoryAPI = express();
inventoryAPI.use(express.json());
inventoryAPI.use(urlencoded({ extended : true }));
inventoryAPI.set('view engine', 'ejs');

inventoryAPI.get('/', function(req, res) {
    res.render('Pages/LandingPage');
});

inventoryAPI.get('/items', async (req, res) => {
    const response = await db_utils.retrieveInventory(inventoryDB);
    if (response === 'error') {
        res.status(500).json({message: 'Error retrieving items.'});
        return;
    }
    res.status(200).json({message: "Successfully retrieved inventory.", data: response});
});

inventoryAPI.get('/items/:itemId', async (req, res) => {
    const id = parseFloat(req.params.itemId);
    if (!isValidNumberInput(id)) {
        res.status(400).json({message: `Error - item id must be non-nonegative integer.`});
        return;
    }
    const response = await db_utils.retrieveItemById(inventoryDB, id);
    if (response === 'error') {
        res.status(500).json({message: 'Error'});
        return;
    }
    if (!response) {
        res.status(404).json({message: `Error - item with id ${id} not found.`});
        return;
    }
    res.status(200).json({message: `Successfully retrieved item with id ${id}.`, data: response});
})

inventoryAPI.post('/items/create', async (req, res) => {
    const item = req.body;
    if(!isValidCreatedItem(item)) {
        res.status(400).json({
            message: `Error: please ensure all fields are filled,` +
            `'name' and 'city' are not numbers, and quantity is a` +
            `non-negative integer.`
        })
        return;
    }
    const response = await db_utils.createItem(inventoryDB, item);
    if (response === 'error') {
        res.status(500).json({message: 'Error inserting item into database.'});
        return;
    }
    res.status(200).json({message: "Item successfully added.", data: response});
})

inventoryAPI.put('/items/update/:itemId', async (req, res) => {
    const id = parseFloat(req.params.itemId);
    if (!isValidNumberInput(id)) {
        res.status(400).json({message: `Error - item id must be non-nonegative integer.`});
        return;
    }
    const item = await db_utils.retrieveItemById(inventoryDB, id);
    if (!item) {
        res.status(404).json({message: `Error - item with id ${id} not found.`});
        return;
    }
    const update = req.body;    
    const response = await db_utils.updateItem(inventoryDB, update, id);
    if (response === 'error') {
        res.status(500).json({message: `Error updating item with id ${id}` });
        return;
    }
    res.status(200).json({message: `Successfully updated item with id ${id}`, data: response});
})

inventoryAPI.delete('/items/delete/:itemId', async (req, res) => {
    const id = parseFloat(req.params.itemId);
    if (!isValidNumberInput(id)) {
        res.status(400).json({message: `Error - item id must be non-nonegative integer.`});
        return;
    }
    const item = await db_utils.retrieveItemById(inventoryDB, id);
    if (!item) {
        res.status(404).json({message: `Error - item with id ${id} not found.`});
        return;
    }
    const response = await db_utils.deleteItem(inventoryDB, id);
    if (response === 'error') {
        res.status(500).json({message: `Error deleting item with id ${id}` });
        return;
    }
    res.json({message: `Successfully deleted item.`, data: item})

})

inventoryAPI.get('/deletions', (req, res) => {
    inventoryDB.all(`select * from deletions`, (err, deletions) => {
        if (err) console.log(err)
        else {
            res.json({message: "Success", data: deletions})
        }
    })
})

inventoryAPI.post('/deletions/comment', (req, res) => {

})

inventoryAPI.listen(3001);

module.exports =  inventoryAPI 

