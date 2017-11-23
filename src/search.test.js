const _ = require('lodash');

const baseUrl = require('../baseUrl');
const request = require('supertest')(baseUrl);
const moment = require('moment');

const usersData = require('../data/2000users.json');

describe('Step 3 search test', () => {

    beforeAll(done => {
        request.delete('/user').expect(200, () =>{
            request.put('/user').send(usersData).end(done)
        });
    });

    afterAll(done => {
        request.delete('/user').expect(200, done);
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
                users.forEach(user => {
                    expect(moment().diff(moment(user.birthDay, "MM/DD/YYYY"), 'years')).toBeGreaterThanOrEqual(50)
                });
                done();
            });
        });

        it('should return different users for page 2', done => {
            return request.get('/user/age?gt=50&page=0').end((err, res) => {
                const users0 = _.map(res.body, user => _.omit(user, 'id'));
                return request.get('/user/age?gt=50&page=1').end((err, res1) => {
                    const user1 = _.map(res1.body, user => _.omit(user, 'id'));
                    expect(_.intersectionWith(users0, user1 , _.isEqual)).toEqual([]);
                    done();
                });
            });
        });

        it('should return 8 users of 73 years old', done => {
            request.get('/user/age?gt=73').end((err, res)=> {
                expect(res.body.length).toBeGreaterThanOrEqual(8);
                done();
            });
        });

        it('should return 0 users of more than 80 years old', done => {
            request.get('/user/age?gt=80').end((err, res)=> {
                expect(res.body.length).toEqual(0);
                done();
            });
        });

        it('should return Bad request for negative age', done => {
            request.get('/user/age?gt=-10').expect(400).end(done);
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

        it('should return at least 5 matching users', done => {
            request.get('/user/search?term=lopez').end((err, res)=> {
                const users = _.map(res.body, user => _.omit(user, 'id'));
                expect(users.length).toBeGreaterThan(5);
                done();
            });
        });

        it('should return exactly matching users', done => {
            request.get('/user/search?term=lopez').end((err, res)=> {
                const users = _.map(res.body, user => _.omit(user, 'id'));
                expect(users.length).toEqual(7);
                done();
            });
        });

        it('should return matching users', done => {
            request.get('/user/search?term=lopez').end((err, res)=> {
                const users = _.map(res.body, user => _.omit(user, 'id'));
                users.map(user => {
                    expect(user.firstName + user.lastName).toEqual(expect.stringMatching(/lopez/));
                });
                done();
            });
        });

        it('should return handle pagination', done => {
            return request.get('/user/search?term=lopez').end((err, res) => {
                const users0 = _.map(res.body, user => _.omit(user, 'id'));
                return request.get('/user/search?term=lopez&page=1').end((err, res1) => {
                    const user1 = _.map(res1.body, user => _.omit(user, 'id'));
                    expect(_.intersectionWith(users0, user1 , _.isEqual)).toEqual([]);
                    done();
                });
            });
        });
    });

    describe('Search by position', () => {

        it('should return 200', done => {
            request.get('/user/nearest?lat=0&lon=0').expect(200).end(done)
        });

        it('should return array', done => {
            request.get('/user/nearest?lat=0&lon=0').end((err, res)=> {
                expect(_.isArray(res.body)).toBe(true);
                done();
            });
        });

        it('should return matching users', done => {
            request.get('/user/nearest?lat=0&lon=0').end((err, res)=> {
                const users = _.map(res.body, user => _.omit(user, 'id'));
                expect(users).toMatchSnapshot();
                done();
            });
        });
    });
});