const _ = require('lodash');

const baseUrl = require('../baseUrl');
const request = require('supertest')(baseUrl);

const simpleUser = require('../data/user.json');

describe('Step 1 specific REST calls', () => {

    describe('GET /user/:id',() => {
        let id;

        beforeEach(done => {
            request.delete('/user').expect(200, () => {
                request.post('/user').send(simpleUser).expect(201, (err, res) => {
                    id = res.body.id;
                    done();
                });
            })
        });

        it('should return 200 status', done => {
            request.get(`/user/${id}`)
                .expect(200).end(done);
        });

        it('should return user', done => {
            request.get(`/user/${id}`)
                .end((err,resp) => {
                    expect(_.omit(resp.body, 'id')).toMatchSnapshot();
                    done();
                });
        });

        it('should return 404 status', done => {
            request.get(`/user/fakeid`).expect(404).end(done);
        });
    });

    describe('DELETE /user/:id', () => {
        beforeEach(done =>
            request.delete('/user').expect(200, () => {
                done();
            })
        );

        it('should return 204 status', done => {
            request.post('/user').send(simpleUser).end((err,res) => {
                request.delete(`/user/${res.body.id}`)
                    .expect(204);
                done();
            })
        });

        it('should return empty object', done => {
            request.post('/user').send(simpleUser).end((err,res) => {
                request.delete(`/user/${res.body.id}`)
                    .expect(res => {
                        expect(res.body).toEqual({});
                    }).end(done);
            })
        });

        it('should return 500 status', done => {
            request.post('/user').send(simpleUser).end((err,res) => {
                request.delete(`/user/fakeid`).expect(500).end(done);
            })
        });
    });

    describe('PUT /user/:id', () => {
        beforeEach(done =>
            request.delete('/user').expect(200, () => {
                done();
            })
        );

        it('should return 200 status', done => {
            request.post('/user').send(simpleUser).end((err,res) => {
                request.put(`/user/${res.body.id}`)
                    .send({
                        firstName: 'Test',
                    })
                    .expect(200)
                    .end(done);
            })
        });

        it('should return user with new name', done => {
            request.post('/user').send(simpleUser).end((err,res) => {
                request.put(`/user/${res.body.id}`)
                    .send({
                        firstName: 'Test',
                    })
                    .end((err,res) => {
                        expect(_.omit(res.body, 'id')).toMatchSnapshot();
                    });
                done();
            })
        });
    });
});