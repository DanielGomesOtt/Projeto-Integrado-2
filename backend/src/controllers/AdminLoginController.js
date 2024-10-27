const Administrator = require('../models/Administrator');
const jwt = require('../middlewares/accessTokenMiddleware');


async function handleLogin(req, res){
    try{
        const admin = await Administrator.findOne({
            where: {
                'admin_register': req.body.admin_register,
                'email': req.body.email,
                'status': 1,
            },
        });
        if(admin === null){
            res.status(404).json({message: 'User not found'});
        }else{
            if(req.body.password == admin.dataValues.password){
                delete admin.dataValues.password;
                const token = jwt.sign({ 'id': admin.dataValues.id });
                if(token !== 401 && token !== 500){
                    res.status(200).json({'administrator':admin, 'token': token});
                }else{
                    res.status(token).json({message: 'An error occurred while trying to generate the token'});
                }
            }else{
                res.status(401).json({message: 'Your login credentials are incorrect'});
            }
        }    
    }catch(error){
        console.log(error)
        res.status(500).json({message: 'An error occurred while trying to log in'});
    }
}

module.exports = {handleLogin};
