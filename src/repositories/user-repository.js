const CrudRepository = require('./crud-repository');

const User = require('../models/user');

class UserRepository extends CrudRepository {  

    constructor () {
        super(User)
    }

    async findUserByEmail (email) {

        const user = await User.findOne({
            where: {
                email: email
            }
        })
        return user;
    }
    
};

module.exports = UserRepository;