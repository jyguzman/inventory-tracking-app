const chai = require('chai');
const chaiHttp = require('chai-http');
const deletionsAPI = require('../server/deletionsAPI');
const should = chai.should();

chai.use(chaiHttp);

process.env.NODE_ENV = 'test';