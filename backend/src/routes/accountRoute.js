const express = require('express');
const route = express.Router();
const AccountController = require('../controllers/AccountController');
const accessTokenMiddleware = require('../middlewares/accessTokenMiddleware');
const uploadDirectoryMiddleware = require('../middlewares/uploadDirectoryMiddleware');

route.get('/account', accessTokenMiddleware.verifyToken, AccountController.getUserData);
route.patch('/account', accessTokenMiddleware.verifyToken, AccountController.updateUserData);
route.patch('/account/disable_account', accessTokenMiddleware.verifyToken, AccountController.disableAccount);
route.patch('/account/upload_avatar', accessTokenMiddleware.verifyToken, uploadDirectoryMiddleware.findOrCreateUserUploadDirectory);
module.exports =  route;