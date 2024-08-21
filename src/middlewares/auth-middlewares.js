const { StatusCodes } = require('http-status-codes');
const { ErrorResponse, SuccessResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');

const { AuthMethods } = require('../utils/common/index');
const { UserService } = require('../services/index');

function validateAuthRequest(req, res, next) {                  // we use it in both signUp and signIn
    if(!req.body.email) {
        ErrorResponse.message = 'Bad request done by client';          
        ErrorResponse.error = new AppError(['Email not given'], StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse)
    }
    if(!req.body.password) {
        ErrorResponse.message = 'Bad request done by client';          
        ErrorResponse.error = new AppError(['Password not given'], StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse)
    }
    next();
}

async function isAuthenticated (req, res, next) {                //use this middlware method to protect any api 
    try {
        if(!req.headers['x-access-token']) {
            throw new AppError('Access Token Missing, Please SignIn', StatusCodes.BAD_REQUEST);
        }
        const payloadData = await AuthMethods.verifyToken(req.headers['x-access-token'])
        req.userData = payloadData;

        next();

    } catch (error) {
        if( error instanceof AppError){
            ErrorResponse.error = error;
            return res
                .status(error.statusCode)
                .json(ErrorResponse);
        }
        else {
            ErrorResponse.error = new AppError(['Error in Authentication'], StatusCodes.INTERNAL_SERVER_ERROR);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse)
        }       
    }
}

/**
 * you see two isAdmin methods , the uncommented method is optimized one , 
 * In previous `isAdmin` method there is service call {middleware -> service -> repository(DB call)} 
 * as it involving DB call so it making that middleware slow and heavy , which is not good for a middleware 
 * So I include `role` property in the payload , which is used to create JWT token and send that payload object after checking authentication
 * in request in `isAuthentication` method 
 * then use that role property in `isAdmin` middleware to check user is admin or not 
 */

function isAdmin(req, res, next) {     
    
    const userRole = req.userData.role;                     
    if(userRole !== 'admin') {
        ErrorResponse.message = 'Bad request done by client';          
        ErrorResponse.error = new AppError(["User not authorized for this action"], StatusCodes.UNAUTHORIZED)
        return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(ErrorResponse)
    } 

    next();

}

// async function isAdmin(req, res, next) {
//     try {
//         const userId = req.userData.id;                   //this userData object we put in req, after authentication by isAuthenticated middleware
//         const response = await UserService.isAdmin(userId);
//         if(!response) {
//             throw new AppError("User not authorized for this action", StatusCodes.UNAUTHORIZED)
//         } 
//         next();

//     } catch (error) {
//         if( error instanceof AppError){
//             ErrorResponse.error = error;
//             return res
//                 .status(error.statusCode)
//                 .json(ErrorResponse);
//         }
//         else {
//             ErrorResponse.error = new AppError(['Error in Verification of Admin'], StatusCodes.INTERNAL_SERVER_ERROR);
//             return res
//                 .status(StatusCodes.INTERNAL_SERVER_ERROR)
//                 .json(ErrorResponse)
//         }  
//     }

// }

module.exports = {
    validateAuthRequest,
    isAuthenticated,
    isAdmin
}