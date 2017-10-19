const _ = require('lodash');

const baseUrl = require('./utils/baseUrl');
const request = require('supertest')(baseUrl);

const isUserEqual = require('./utils/user.util').isUserEqual;

const simpleUser = require('../data/user.json');
const tenUsers = require('../data/tenUsers.json');

describe('Step 1 global REST calls', () => {

    const resetData = done => request.delete('/user').end(done());

    describe('DELETE /user',() => {
        it('should return 200 status', done => {
            request.delete('/user').expect(200, done);
        });
    });

    describe('GET /user', () => {

        beforeEach(done => resetData(done));

        it('should return 200 status', done => {
            request.get('/user').expect(200, done);
        });

        it('should retrun array', done => {
            request.get('/user').expect(res => {
                expect(res.body).toEqual([]);
            }).end(done);
        });

        describe('Given database have 1 users', () => {
            beforeEach(done => {
                resetData(() => {
                    request.post('/user').send(simpleUser).end(done);
                })
            });

            it('should return array with user', () => {
                request.get('/user').expect(res => {
                    expect(res.body.length).toEqual(1);
                    isUserEqual(res.body, simpleUser)
                }).end(done);
            });
        });

        describe('Given database have 10 users', () => {
            beforeEach(done => {
                resetData(() => {
                    request.put('/user').send(tenUsers).end(done);
                })
            });

            it('should return array with 10 users', () => {
                request.get('/user').expect(res => {
                    expect(res.body.length).toEqual(10);
                    _.forEach(res.body, userReturned => {
                       expect(_.find(tenUsers, user => isUserEqual(userReturned, user))).toBe(true);
                    });
                })
                    .end(done);
            });
        });
    });

    describe('POST /user', () => {
        beforeEach(done => resetData(done));

        it('should return 201 status', done => {
            request.post('/user').send(simpleUser).expect(201, done);
        });

        it('should return object', done => {
            request.post('/user').send(simpleUser).expect(res => {
                expect(_.isObject(res.body)).toBe(true);
            }).end(done);
        });

        it('should return user with id', done =>{
            request.post('/user').send(simpleUser).expect(res => {
                expect(_.isNumber(res.body.id)).toBe(true);
            }).end(done);
        });


        it('should return same user', done =>{
            request.post('/user').send(simpleUser).expect(res => {
                expect(isUserEqual(res.body, simpleUser)).toBe(true);
            }).end(done);
        });
    });

    describe('PUT /user', () => {
        beforeEach(done => resetData(done));

        it('should return 201 status', done => {
            request.put('/user').send(tenUsers).expect(201, done);
        });
    });
});