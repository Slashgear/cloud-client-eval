const _ = require('lodash');

const baseUrl = require('../baseUrl');
const request = require('supertest')(baseUrl);

const usersData = require('../data/2000users.json');

describe('Step 2 pagination', () => {

    beforeAll(done => {
        request.delete('/user').expect(200, () => {
            request.put('/user').send(usersData).end(done)
        });
    });

    afterAll(done => {
        request.delete('/user').expect(200, done);
    });

    it('should return 200 with 2000 users in DB', done => {
        request.get('/user').expect(200).end(done);
    });

    it('should return array of user', done => {
        request.get('/user').end((err, res) => {
            expect(_.isArray(res.body)).toBe(true);
            done();
        });
    });

    it('should return exactly 100 users', done => {
        request.get('/user').end((err, res) => {
            expect(res.body.length).toBe(100);
            done();
        });
    });

    it('should return page 0', done => {
        let usersFirstPage0;
        request.get('/user').end((err, res) => {
            usersFirstPage0 = _.map(res.body, user => _.omit(user, 'id'));
        });
        request.get('/user?page=0').end((err, res) => {
            expect(usersFirstPage0).toEqual(_.map(res.body, user => _.omit(user, 'id')))
            done();
        });
    });

    it('should return different users with page 0 and 1', done => {
        let usersFirstPage0;
        request.get('/user').end((err, res) => {
            usersFirstPage0 = _.map(res.body, user => _.omit(user, 'id'));
        });
        request.get('/user?page=1').end((err, res) => {
            expect(usersFirstPage0).not.toEqual(_.map(res.body, user => _.omit(user, 'id')))
            done();
        });
    });

    it('should return empty array for empty page', done => {
        request.get('/user?page=1000').expect([]).end(done);
    });

    it('should contain this users on page 0', done => {
        request.get('/user?page=0').end((err, res) => {
            expect(_.map(res.body, user => _.omit(user, 'id'))).toMatchSnapshot();
            done();
        });
    });

    it('should contain this users on page 1', done => {
        request.get('/user?page=1').end((err, res) => {
            expect(_.map(res.body, user => _.omit(user, 'id'))).toMatchSnapshot();
            done();
        });
    });
});