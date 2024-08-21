const express = require('express');

const { UserController } = require('../../controllers')

const { AuthMiddlewares } = require('../../middlewares');

const router = express.Router();

router.post('/signup', AuthMiddlewares.validateAuthRequest, UserController.signUp);

router.post('/signin', AuthMiddlewares.validateAuthRequest, UserController.signIn);

router.post('/admin/roles', AuthMiddlewares.isAuthenticated, AuthMiddlewares.isAdmin, UserController.addNewAdmin);

module.exports = router;