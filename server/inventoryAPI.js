const express = require('express');
const ejs = require('ejs');
const sqlite3 = require('sqlite3');
const inventoryDB = new sqlite3.Database('inventory.db');
const { isValidCreatedIte, isValidNumberInput } = require('./utils/input_validation_functions');
const { urlencoded } = require('body-parser');

const inventoryAPI = express();
inventoryAPI.use(express.json());
inventoryAPI.use(urlencoded({ extended : true }));
inventoryAPI.set('view engine', 'ejs');

inventoryAPI.get('/', function(req, res) {
    res.render('Pages/LandingPage');
});

inventoryAPI.get('/items', (req, res) => {
    inventoryDB.all(`select * from items;`, (err, items) => {
        if (err) {
            res.status(500).json({message: 'Error retrieving items.'});
            return;
        }
        res.status(200).json({message: "Success", data: items});
    })
});

inventoryAPI.get('/items/:itemId', (req, res) => {
    const id = parseFloat(req.params.itemId);
    if (!isValidNumberInput(id)) {
        res.status(400).json({message: `Error - item id must be non-nonegative integer.`});
        return;
    }
    const query = `select * from items where item_id = ?;`
    inventoryDB.get(query, id, (err, item) => {
        if (err) {
            res.status(500).json({message: 'Error'});
            return;
        }
        if (!item) {
            res.status(400).json({message: `Error - item with id ${id} not found.`});
            return;
        }
        res.status(200).json({message: "Success", data: item});
    })
})

inventoryAPI.post('/items/create', (req, res) => {
    const item = req.body;
    if(!isValidCreatedItem(item)) {
        res.status(400).json({
            message: `Error: please ensure all fields are filled,` +
            `'name' and 'city' are not numbers, and quantity is a` +
            `non-negative integer.`
        })
        return;
    }
    const params = Object.values(item);
    const query = `
        insert into items (name, quantity, city) 
        values (?, ?, ?);
    `
    inventoryDB.run(query, params, (err) => {
        if (err) { 
            res.status(500).json({message: 'Error inserting item into database.'});
            return;
        }
        res.status(200).json({message: "Success", data: { newItem: item }});
    })
})

inventoryAPI.put('/items/update/:itemId', (req, res) => {
    const id = req.params.itemId;
    const itemBefore = req.body;
    const params = Object.values(itemBefore)
    params.push(id);
    const query = `
        update items set name = ?, 
        quantity = ?, city = ? where item_id = ?;
    `;
    inventoryDB.run(query, params, (err) => {
        if (err) {
            res.status(500).json({message: `Error updating item with id ${id}` });
            return;
        } else { 
            res.status(200).json({
                message: `Successfully updated item with id ${id}`, 
            });
        }
    })
})

inventoryAPI.delete('/items/delete/:itemId', (req, res) => {
    const itemId = req.params.itemId;
    const query = `delete from items where item_id = ?`;
    inventoryDB.run(query, itemId, (err) => {
        if (err) {
            res.status(500).json({message: `Error deleting item with id ${id}` });
            return;
        } else {
            res.json({message: `Successfully deleted item with ${id}`})
        }
    })
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

module.exports = { inventoryAPI }

