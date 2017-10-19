const baseUrl = require('./utils/baseUrl');
const request = require('supertest')(baseUrl);

describe('Step 1 specific REST calls', () => {

    describe('GET /user/:id',() => {
        it('should return 200 status', done => {
            request.get('/user').expect(200, done);
        });
    });
});