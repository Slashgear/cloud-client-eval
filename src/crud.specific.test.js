const _ = require('lodash');

const baseUrl = require('./utils/baseUrl');
const request = require('supertest')(baseUrl);

const simpleUser = require('../data/user.json');

describe('Step 1 specific REST calls', () => {

    function resetData(){
        return request.delete('/user');
    }

    describe('GET /user/:id',() => {
        beforeEach(() => resetData());

        it('should return 200 status', done => {
            request.post('/user').send(simpleUser).expect(res => {
                request.get(`/user/${res.body.id}`)
                    .expect(200);
            }).end(done);
        });

        it('should return user', done => {
            request.post('/user').send(simpleUser).expect(res => {
                request.get(`/user/${res.body.id}`)
                    .expect(res => {
                        expect(_.omit(res.body, 'id')).toMatchSnapshot();
                    });
            }).end(done);
        });

        it('should return 404 status', done => {
            request.post('/user').send(simpleUser).expect(() => {
                request.get(`/user/fakeid`).expect(404);
            }).end(done);
        });
    });

    describe('DELETE /user/:id', () => {
        beforeEach(() => resetData());

        it('should return 204 status', done => {
            request.post('/user').send(simpleUser).expect(res => {
                request.delete(`/user/${res.body.id}`)
                    .expect(204);
            }).end(done);
        });

        it('should return empty object', done => {
            request.post('/user').send(simpleUser).expect(res => {
                request.delete(`/user/${res.body.id}`)
                    .expect(res => {
                        expect(res.body).toEqual({});
                    });
            }).end(done);
        });

        it('should return 500 status', done => {
            request.post('/user').send(simpleUser).expect(() => {
                request.delete(`/user/fakeid`).expect(500);
            }).end(done);
        });
    });

    describe('PUT /user/:id', () => {
        beforeEach(() => resetData());

        it('should return 200 status', done => {
            request.put('/user').send(simpleUser).expect(res => {
                request.put(`/user/${res.body.id}`)
                    .send({
                        firstName: 'Antoine',
                    })
                    .expect(200);
            }).end(done);
        });

        it('should return 200 status', done => {
            request.put('/user').send(simpleUser).expect(res => {
                request.put(`/user/${res.body.id}`)
                    .send({
                        firstName: 'Antoine',
                    })
                    .expect(res => {
                        expect(_.omit(res.body, 'id')).toMatchSnapshot();
                    });
            }).end(done);
        });
    });
});