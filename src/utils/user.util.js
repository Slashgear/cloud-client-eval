const _ = require('lodash');

module.exports = {

    isUserEqual(userTested, user) {
        return _.isEqual(_.omit(userTested, 'id'), _.omit(user, 'id'));
    },

};