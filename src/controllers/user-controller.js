const { StatusCodes } = require('http-status-codes');

const { ErrorResponse, SuccessResponse } = require('../utils/common')

const { UserService } = require('../services');

/**
 * POST: /signup
 * req-body: { email, password }
 */

async function signUp (req, res) {
    try {
        const user = await UserService.signup({
            email: req.body.email,
            password: req.body.password
        })
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } 
    catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function signIn (req, res) {
    try {
        const response = await UserService.signin({
            email: req.body.email,
            password: req.body.password
        })
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } 
    catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function addNewAdmin (req, res) {
    try {
        const userId = req.body.userId;
        const response = await UserService.addNewAdmin(userId)
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } 
    catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

module.exports = {
    signUp,
    signIn,
    addNewAdmin
}