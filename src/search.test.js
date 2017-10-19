const _ = require('lodash');

const baseUrl = require('./utils/baseUrl');
const request = require('supertest')(baseUrl);

const tenUsers = require('../data/tenUsers.json');

describe('Step 3 search test', () => {

    beforeAll(() => {
        request.delete('/user').expect(() => {
            request.put('/user').send(tenUsers);
        })
    });

    describe('Search by age', () => {

        it('should return 200', done => {
            request.get('/user/age?gt=50').expect(200).end(done)
        });

        it('should return array of user', done => {
            request.get('/user/age?gt=50').expect(res => {
                expect(_.isArray(res.body)).toBe(true);
            }).end(done);
        });

        it('should return users', done => {
            request.get('/user/age?gt=50').expect(res => {
                const users = _.map(res.body, user => _.omit(user, 'id'));
                expect(users).toMatchSnapshot();
            }).end(done);
        });
    });

});