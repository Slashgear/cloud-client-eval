module.exports = {
    isUserEqual(userTested, user) {
        expect(userTested.firstName).toEqual(user.firstName);
        expect(userTested.lastName).toEqual(user.lastName);
        expect(userTested.birthDay).toEqual(user.birthDay);
        expect(userTested.position).toEqual(user.position);
    }
}