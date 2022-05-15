const chai = require('chai');
const chaiHttp = require('chai-http');
const inventoryAPI = require('../server/inventoryAPI');

const should = chai.should();

chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('Items', () => {
    
    describe('/GET /items', () => {
        it('it should retrieve all items in inventory', (done) => {
            chai.request(inventoryAPI)
                .get('/items')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql("Successfully retrieved inventory.");
                    res.body.data.should.be.a('array');
                done();
            })
        })
    })
    
    describe('/GET /items/:itemId', () => {
        it('it should retrieve a specific item from inventory by its ID', (done) => {
            const id = 1;
            chai.request(inventoryAPI)
                .get(`/items/${id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(`Successfully retrieved item with id ${id}.`);
                    res.body.data.should.be.a('object');
                    res.body.data.item_id.should.be.eql(1);
                done();
            })
        })
    
        it('it should send an error if an item ID does not exist.', (done) => {
            const id = 10000;
            chai.request(inventoryAPI)
                .get(`/items/${id}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.message.should.be.eql(`Error - item with id ${id} not found.`);
                done();
            })
        })
    
        it('it should send an error if an item ID is not a non-negative integer.', (done) => {
            const id = -1;
            chai.request(inventoryAPI)
                .get(`/items/${id}`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(`Error - item id must be non-nonegative integer.`);
                done();
            })
        })
    })

    describe('/POST /items/create', () => {
        it('it should create a new item by ID with the given name, quantity, and city', (done) => {
            const newItem = { name: 'testItem', quantity: 100, city: "Seattle, WA"};
            chai.request(inventoryAPI)
                .post(`/items/create`)
                .send(newItem)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql("Item successfully added.");
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('name');
                    res.body.data.should.have.property('quantity');
                    res.body.data.should.have.property('city');
                done();
            })
        })
    })

    describe('/PUT /items/update/:itemId', () => {
        it('it should update a specific item by ID to the updated fields given in a request', (done) => {
            const id = 1;
            const item = {name: 'updatedTestItem', quantity: 100, city: "Seattle, WA"}
            chai.request(inventoryAPI)
                .put(`/items/update/${id}`)
                .send(item)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eql(`Successfully updated item with id ${id}`);
                    res.body.data.name.should.be.eql('updatedTestItem');
                done();
            })
        })

        it('it should send an error if an item ID does not exist.', (done) => {
            const id = 10000;
            chai.request(inventoryAPI)
                .put(`/items/update/${id}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.message.should.be.eql(`Error - item with id ${id} not found.`);
                done();
            })
        })
    
        it('it should send an error if an item ID is not a non-negative integer.', (done) => {
            const id = -1;
            chai.request(inventoryAPI)
                .put(`/items/update/${id}`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.eql(`Error - item id must be non-nonegative integer.`);
                done();
            })
        })
    })

})