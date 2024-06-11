const express = require('express');
const route = express.Router();
const ProjectController = require('../controllers/ProjectController')
const accessTokenMiddleware = require('../middlewares/accessTokenMiddleware');


route.post('/project', accessTokenMiddleware.verifyToken, ProjectController.setProject);
route.get('/project', accessTokenMiddleware.verifyToken, ProjectController.getProjects);

module.exports =  route;