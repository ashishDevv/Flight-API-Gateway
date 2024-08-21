const { StatusCodes } = require('http-status-codes');
const { UserRepository } = require('../repositories');
const AppError  = require('../utils/errors/app-error');
const { AuthMethods } = require('../utils/common/index');

const userRepo = new UserRepository();

async function signup (data) {
    try {
        const hashedPassword = await AuthMethods.hashPassword(data.password);
        data.password = hashedPassword;
        
        const user = await userRepo.create(data);
        return user;
    } 
    catch (error) {
        if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError') {  
            let explanation = [];                        
            error.errors.forEach((err) => {              
                explanation.push(err.message)            
            });
            throw new AppError( explanation , StatusCodes.BAD_REQUEST);       
        }
        if(error instanceof AppError) throw error            // this is for getting to know error during hashing , which is thrown by hashPassword function
        throw new AppError('Cannot create new User', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signin (data) {
    try {
        //verify user exists or not
        const user = await userRepo.findUserByEmail(data.email);
        if(!user) {
            throw new AppError("User not found", StatusCodes.NOT_FOUND)
        }

        //verfiy password is correct or not
        const isMatch = await AuthMethods.comparePassword(data.password, user.password);
        if(!isMatch) {
            throw new AppError("Invalid Password", StatusCodes.BAD_REQUEST)
        }

        //gernerate JWT token 
        const token = await AuthMethods.createToken({ id: user.id, email: user.email, role: user.role });  //remove email later
        return token;
    } 
    catch (error) {
        if(error instanceof AppError) {
            throw error;
        }
        throw new AppError("Error in signin", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function addNewAdmin(userId) {                            // this can only be done by other Admin
    try {
        const response = await userRepo.update(userId, { role: 'admin'});
        return response;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {    
            throw error;                                   
        }
        throw new AppError("Cannot able to add New Admin", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAdmin(userId) {
    try {
        const user = await userRepo.get(userId);
        // if(!user) {
        //     throw new AppError("No user found for given Id", StatusCodes.NOT_FOUND);
        // }
        if(user.role == 'admin') {
            return true;
        }
        else {
            return false;
        }
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {    
            throw error;                                   
        }
        throw new AppError("Cannot able to Verify Admin", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    signup,
    signin,
    addNewAdmin,
    isAdmin
}