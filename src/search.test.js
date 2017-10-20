const _ = require('lodash');

const baseUrl = require('./utils/baseUrl');
const request = require('supertest')(baseUrl);

const usersData = require('../data/2000users.json');

describe('Step 3 search test', () => {

    beforeAll(done => {
        request.delete('/user').expect(200, () =>{
            request.put('/user').send(usersData).end(done)
        });
    });

    describe('Search by age', () => {

        it('should return 200', done => {
            request.get('/user/age?gt=50').expect(200).end(done)
        });

        it('should return array of user', done => {
            request.get('/user/age?gt=50').end((err, res) => {
                expect(_.isArray(res.body)).toBe(true);
                done();
            });
        });

        it('should return users', done => {
            request.get('/user/age?gt=50').end((err, res)=> {
                const users = _.map(res.body, user => _.omit(user, 'id'));
                expect(users).toMatchSnapshot();
                done();
            });
        });

        it('should return different users for page 2', done => {
            request.get('/user/age?gt=50&page=2').end((err, res)=> {
                const users = _.map(res.body, user => _.omit(user, 'id'));
                expect(users).toMatchSnapshot();
                done();
            });
        });
    });

    describe('Search by text', () => {

        it('should return 200', done => {
            request.get('/user/search?term=lopez').expect(200).end(done)
        });

        it('should return empty array for bad term', done => {
            request.get('/user/search?term=toto')
                .expect(200)
                .expect([])
                .end(done);
        });

        it('should return matching users', done => {
            request.get('/user/search?term=lopez').end((err, res)=> {
                const users = _.map(res.body, user => _.omit(user, 'id'));
                expect(users).toMatchSnapshot();
                done();
            });
        });

        it('should return handle pagination', done => {
            request.get('/user/search?term=lopez&page=2').end((err, res)=> {
                const users = _.map(res.body, user => _.omit(user, 'id'));
                expect(users).toMatchSnapshot();
                done();
            });
        });
    });

    describe('Search by position', () => {

        it('should return 200', done => {
            request.get('/user/nearest?lat=0&lon=0').expect(200).end(done)
        });

        it('should return matching users', done => {
            request.get('/user/nearest?lat=0&lon=0').end((err, res)=> {
                const users = _.map(res.body, user => _.omit(user, 'id'));
                expect(users).toMatchSnapshot();
                done();
            });
        });

        it('should return handle pagination', done => {
            request.get('/user/nearest?lat=0&lon=0&page=2').end((err, res)=> {
                const users = _.map(res.body, user => _.omit(user, 'id'));
                expect(users).toMatchSnapshot();
                done();
            });
        });
    });
});