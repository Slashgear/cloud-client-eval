const _ = require('lodash');

const baseUrl = require('./utils/baseUrl');
const request = require('supertest')(baseUrl);

const simpleUser = require('../data/user.json');
const tenUsers = require('../data/tenUsers.json');

describe('Step 1 global REST calls', () => {

    function resetData(){
        return request.delete('/user');
    }

    describe('DELETE /user',() => {
        it('should return 200 status', done => {
            request.delete('/user').expect(200, done);
        });

        it('should return empty object', done => {
            request.delete('/user').expect({}, done);
        });
    });

    describe('GET /user', () => {

        beforeEach(() => resetData());

        it('should return 200 status', done => {
            request.get('/user').expect(200, done);
        });

        it('should return array', done => {
            request.get('/user').expect(res => {
                expect(res.body).toEqual([]);
            }).end(done);
        });

        describe('Given database have 1 users', () => {
            beforeEach(async () =>{
                await resetData();
                return request.post('/user').send(simpleUser)
            });

            it('should return array with user', done => {
                request.get('/user').expect(res => {
                    expect(res.body.length).toEqual(1);
                    expect(_.omit(res.body[0], 'id')).toMatchSnapshot();
                    done();
                }).end(done);
            });
        });

        describe('Given database have 10 users', () => {
            beforeEach(async () =>{
                    await resetData();
                    return request.put('/user').send(tenUsers)
            });

            it('should return array with 10 users', done => {
                request.get('/user').expect(res => {
                    expect(res.body.length).toEqual(10);
                }).end(done);
            });

            it('should return users order by', done => {
                request.get('/user').expect(res => {
                    const users = _.map(res.body, user => _.omit(user, 'id'));
                    expect(users).toMatchSnapshot();
                }).end(done);
            })
        });
    });

    describe('POST /user', () => {
        beforeEach(() => resetData());

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
                expect(_.isString(res.body.id)).toBe(true);
            }).end(done);
        });


        it('should return same user', done => {
            request.post('/user').send(simpleUser).expect(res => {
                expect(_.omit(res.body, 'id')).toMatchSnapshot();
            }).end(done);
        });
    });

    describe('PUT /user', () => {
        beforeEach(() => resetData());

        it('should return 201 status', done => {
            request.put('/user').send(tenUsers).expect(201, done);
        });

        it('should return array', done => {
            request.put('/user').send(tenUsers).expect(res => {
                expect(_.isArray(res.body)).toBe(true);
            }).end(done);
        });

        it('should return 10 users', done => {
            request.put('/user').send(tenUsers).expect(res => {
                expect(res.body.length).toEqual(10);
            }).end(done);
        } )
    });
});