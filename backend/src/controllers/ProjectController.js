const Project = require('../models/Project');
const UserProject = require('../models/UserProject');
const { Op, fn, col } = require('sequelize');

async function setProject(req, res){
    try{
        let project = {
            'name': req.body.name,
            'description': req.body.description,
            'initial_date': req.body.initial_date,
            'expected_end_date': req.body.expected_end_date,
            'status': req.body.status,
            'priority': req.body.priority,
        }
        const createdProject = await Project.create(project);
        
        if(createdProject){
            const createdUserProject = await UserProject.create({'id_project': createdProject.id, id_user: req.body.id_user, status: 1});
            if(createdUserProject){
                res.status(201).json({message:'Project created successfully !'});
            }else{
                res.status(422).json({message: 'Error attempting to link the user to the created project !'});
            }
        }else{
            res.status(400).json({message: 'Project data is not in the correct format !'});
        }

    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

async function getProjects(req, res){
    try{
        const projects = await Project.findAll({
            include: [{
                model: UserProject,
                where: {
                    status: 1,
                    id_user: req.headers.id_user,
                }
            }]
        });

        res.send(projects);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

async function updateProject(req, res){
    try{
        let today = new Date();
        today = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
        let update = ''
        if(req.body.status == "completed"){
            update = await Project.update({
                'name': req.body.name,
                'description': req.body.description,
                'expected_end_date': req.body.expected_end_date,
                'real_end_date': today,
                'status': req.body.status,
                'priority': req.body.priority,
            }, {
                where: {
                    'id': req.body.project_id
                }
            });
        }else if(req.body.status == "cancelled"){
            update = await Project.update({
                'name': req.body.name,
                'description': req.body.description,
                'expected_end_date': req.body.expected_end_date,
                'status': req.body.status,
                'priority': req.body.priority,
            }, {
                where: {
                    'id': req.body.project_id
                }
            });

            await UserProject.update({
                'status': 0
            }, {
                where: {
                    'id_user': req.body.id_user,
                    'id_project': req.body.project_id
                }
            });
        }else{
            update = await Project.update({
                'name': req.body.name,
                'description': req.body.description,
                'expected_end_date': req.body.expected_end_date,
                'status': req.body.status,
                'priority': req.body.priority,
            }, {
                where: {
                    'id': req.body.project_id
                }
            });
        }

        if(update){
            res.status(200).json({message: 'Project updated successfully'});
        }
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

async function getProjectById(req, res){
    try{
        const project = await Project.findByPk(req.params.id);
        res.send(project);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

async function getProjectsByFilter(req, res){
    try{
        
        let filter = {};
        
        if (req.query.filter && req.query.filter.length > 0 && req.query.search && req.query.search.length > 0) {
            if(req.query.filter == 'name'){
                filter.name = req.query.search
            }
        }
        
        if (req.query.status && req.query.status.length > 0) {
            filter.status = req.query.status;
        }

        if (req.query.priority && req.query.priority.length > 0) {
            filter.priority = req.query.priority;
        }
        
        const projects = await Project.findAll({
            include: [{
                model: UserProject,
                where: {
                    status: 1,
                    id_user: req.headers.id_user,
                }
            }],
            where: filter
        });
        res.send(projects);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}


module.exports = { setProject, getProjects, updateProject, getProjectById, getProjectsByFilter };