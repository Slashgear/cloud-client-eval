const request = require('supertest')('http://localhost:8000');
const simpleUser = require('./data/user.json');
const tenUsers = require('./data/tenUsers.json');

describe('Step 1 tests', () => {
    describe('DELETE /user',() => {
        it('should return 200 status', done => {
            request.delete('/user').expect(200, done);
        });
    });

    describe('GET /user', () => {
        it('should return 200 status', done => {
            request.get('/user').expect(200, done);
        });
    });

    describe('POST /user', () => {
        it('should return 200 status', done => {
            request.post('/user').send(simpleUser).expect(201, done);
        });
    });

    describe('PUT /user', () => {
        it('should return 200 status', done => {
            request.put('/user').send(tenUsers).expect(201, done);
        });
    })
});