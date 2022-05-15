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

new sqlite3.Database('inventory.db').exec(`
        drop table deletions;
        drop table items;
        create table items (
            item_id integer primary key,
            name text integer not null,
            quantity integer not null,
            city text not null        
        );
        create table deletions (
            deletion_id integer primary key,
            comment text,
            item_id integer not null,
            name text integer not null,
            quantity integer null,
            city text not null  
        );
        `, (err) => { 
        if (err) {
            console.log(err);
            return;
        }
    });
