const db_queries = require('./db_queries');
const sqlite3 = require('sqlite3');
const inventoryDB = new sqlite3.Database('inventory.db');

const itemExists = (itemId) => {
    const item = await db_queries.retrieveItemById(inventoryDB, itemId);
    if (item === 'error') return true;
    return false;
}

module.exports = { itemExists }