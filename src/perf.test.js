const _ = require('lodash');

const baseUrl = require('../baseUrl');
const request = require('supertest')(baseUrl);

const usersData = require('../data/2000users.json');

describe('Step 3 search test', () => {

    beforeAll(done => {
        request.delete('/user').expect(200, () => {
            request.put('/user').send(usersData).end(done)
        });
    });

    afterAll(done => {
        request.delete('/user').expect(200, done);
    });

    describe('GET /user', () => {
        it('should answer in less than 5 seconds', done => {
            const start = process.hrtime();
            request.get('/user').end((err, res) => {
                expect(res.body.length).toBe(100);
                const end = process.hrtime(start)[0];
                expect(end).toBeLessThan(5);
                done();
            });
        });

        it('should answer in less than 2 seconds', done => {
            const start = process.hrtime();
            request.get('/user').end((err, res) => {
                const end = process.hrtime(start)[0];
                expect(end).toBeLessThan(2);
                done();
            });
        });

        it('should answer in less than 1 second', done => {
            const start = process.hrtime();
            request.get('/user').end((err, res) => {
                const end = process.hrtime(start)[0];
                expect(end).toBeLessThan(1);
                done();
            });
        });

        it('should answer in less than 0.5 second', done => {
            const start = process.hrtime();
            request.get('/user').end((err, res) => {
                const end = process.hrtime(start)[1] / 1000000;
                expect(end).toBeLessThan(500);
                done();
            });
        });

        it('should answer in less than 0.25 second', done => {
            const start = process.hrtime();
            request.get('/user').end((err, res) => {
                const end = process.hrtime(start)[1] / 1000000;
                expect(end).toBeLessThan(250);
                done();
            });
        });

        it('should answer in less than 50 milli second', done => {
            const start = process.hrtime();
            request.get('/user').end((err, res) => {
                const end = process.hrtime(start)[1] / 1000000;
                expect(end).toBeLessThan(50);
                done();
            });
        });
    });
});