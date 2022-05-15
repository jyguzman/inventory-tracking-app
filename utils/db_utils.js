const sqlite3 = require('sqlite3');

const createDatabase = () => {
    const inventory = new sqlite3.Database('inventory.db', err => {
        if (err) {
            console.log("Error opening database");
            return;
        }
        console.log('Created database');
        createTables(inventory);
    })
}

const dropTables = (db) => {
    db.exec(`
        drop table item;
    `, err => console.log(err))

}

const createTables = (inventoryDB) => {
    new sqlite3.Database('inventory.db').exec(`
    create table items (
        item_id int primary key not null,
        name text int not null,
        quantity int not null,
        city text not null        
    );
    create table deletions (
        deletion_id int primary key not null,
        comment text,
        item_id int not null,
        name text int not null,
        quantity int not null,
        city text not null  
    );
        `, (err) => { 
        if (err) {
            console.log(err);
            return;
        }
        popuplateTables(inventoryDB);
    });
}

const populateTables = () => {
    new sqlite3.Database('inventory.db').exec(`
        insert into warehouses (warehouse_id, warehouse_name, city)
            values  (1, 'The Big One', 'Seattle, WA'),
                    (2, 'Red River Packaging', 'Boston, MA');
        
        insert into items (item_id, warehouse_id, name, quantity, city)
            values  (1, 1, 'Squirt Gun', 5, 'Seattle, WA');
        ;
    `, (err) => console.log(err));
}

const retrieveInventory = (inventoryDB) => {
    return new Promise((resolve, reject) => (
        inventoryDB.all(`select * from items;`, (err, items) => {
            if (err) reject('error');
            resolve(items);
        })
    ))
}

const retrieveItemById = (inventoryDB, itemId) => {
    return new Promise((resolve, reject) => {
        const query = `select * from items where item_id = ?;`
        inventoryDB.get(query, itemId, (err, item) => {
            if (err) reject('error');
            resolve(item);
        })
    })
}

const retrieveDeletionByItemId = (inventoryDB, itemId) => {
    return new Promise((resolve, reject) => {
        const query = `select * from deletions where item_id = ?;`
        inventoryDB.get(query, itemId, (err, deletion) => {
            if (err) reject('error');
            resolve(deletion);
        })
    })
}

const createItem = (inventoryDB, item) => {
    return new Promise((resolve, reject) => {
        const params = Object.values(item);
        const query = `
            insert into items (name, quantity, city) 
            values (?, ?, ?);
        `
        inventoryDB.run(query, params, (err) => {
            if (err) reject('error');
            resolve(item);
        })
    })
}

const updateItem = (inventoryDB, item, itemId) => {
    return new Promise((resolve, reject) => {
        const params = Object.values(item);
        params.push(itemId);
        const query = `
            update items set name = ?, 
            quantity = ?, city = ? where item_id = ?;
        `;
        inventoryDB.run(query, params, async (err) => {
            if (err)  reject('error');
            const item = await retrieveItemById(inventoryDB, itemId);
            resolve(item);
        })
    })
}

const deleteItem = (inventoryDB, itemId) => {
    return new Promise((resolve, reject) => {
        const query = `delete from items where item_id = ?`;
        inventoryDB.run(query, itemId, (err) => {
            if (err) reject('error');
            resolve();
        })
    })
}

const deleteItemAndAddComment = (inventoryDB, comment, item) => {
    return new Promise(async (resolve, reject) => {
        const query = `
            insert into deletions (comment, item_id, name, quantity, city)
                values (?, ?, ?, ?, ?);
        `
        const params = Object.values(item);
        params.unshift(comment);
        await deleteItem(inventoryDB, item.item_id);
        inventoryDB.run(query, params, (err) => {
            if (err) reject('error');
        })
        resolve(item);
    })
}

const undeleteItem = (inventoryDB, itemId) => {
    return new Promise((resolve, reject) => {
        const query = `
            select item_id, name, quantity, city from deletions
                where item_id = ?;
        `
        inventoryDB.get(query, itemId, (err, recoveredItem) => {
            if (err) reject('error');
            const recoveredItemParams = Object.values(recoveredItem);
            inventoryDB.run(`
                insert into items (item_id, name, quantity, city) 
                values (?, ?, ?, ?);
                `, recoveredItemParams, (err) => {
                if (err) reject('error');
                resolve(recoveredItem);
            })
        })
    })
}

/*new sqlite3.Database('inventory.db').exec(`
        drop table deletions;
        drop table items;
        create table items (
            item_id integer primary key,
            name text integer not null,
            quantity integer not null,
            city text not null        
        );
        create table deletions (
            comment text,
            item_id integer primary key not null,
            name text integer not null,
            quantity integer null,
            city text not null  
        );
        insert into items (name, quantity, city)
            values  ('Squirt Gun', 5, 'Seattle, US');
            values  ('Playstation 6', 1, 'Boston, US');
        ;
        `, (err) => { 
        if (err) {
            console.log(err);
            return;
        }
    });*/

module.exports = { 
    retrieveInventory, 
    retrieveItemById, 
    createItem, 
    updateItem,
    deleteItem,
    retrieveDeletionByItemId,
    deleteItemAndAddComment,
    undeleteItem
}