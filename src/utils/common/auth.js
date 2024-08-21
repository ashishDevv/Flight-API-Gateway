const { StatusCodes } = require('http-status-codes');
const AppError = require('../errors/app-error');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/server-config');

const saltRounds = 8;

async function hashPassword(password) {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword;
    } 
    catch (error) {
        throw new AppError("Error in hashing password", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function comparePassword(enteredPassword, storedHash) {
    try {
        const isMatch = await bcrypt.compare(enteredPassword, storedHash);
        return isMatch;
    } catch (error) {
        throw new AppError("Error in comparing password", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function createToken(payloadData) {
    try {
        const token = await jwt.sign(payloadData, JWT_SECRET, { expiresIn: '3h' });   
        return token;
    } catch (error) {
        throw new AppError("Error in creating token", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function verifyToken(token) {
    try {
        const payloadData = await jwt.verify(token, JWT_SECRET );    // it decrypts the token , if its valid token, it returns the payloadData, 
        return payloadData;                                          // which you given while creating token
    }                                                                // Else, if token is not valid, it returns the 'JsonWebTokenError' Error and
    catch (error) {                                                  // if token is expired, it returns the 'TokenExpiredError' Error
        if(error.name == 'JsonWebTokenError') {
            throw new AppError("Invalid Token, Please Signin again", StatusCodes.BAD_REQUEST)
        }
        if(error.name == 'TokenExpiredError') {
            throw new AppError("Token Expired, Please Signin again", StatusCodes.BAD_REQUEST)
        }
        throw new AppError("Error in Verifing the Token", StatusCodes.INTERNAL_SERVER_ERROR);
        
    }
}


module.exports = {
    hashPassword,
    comparePassword,
    createToken,
    verifyToken
}