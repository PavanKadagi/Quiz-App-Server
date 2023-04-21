const jwt = require('jsonwebtoken')
const User = require('../models/userSchema');
const adminAuthenticate = async (req,res,next)=>{
    try{
        const token = req.cookies.admin;
        // console.log('req',token)
   const verifyToken = await  jwt.verify(token,process.env.SECRETE_KEY);
   const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token":token})

   if(!rootUser) {
    throw new Error('User not found') ;
    }


   req.token = token;
   req.rootUser = rootUser;
   req.userId = rootUser._id;
   
   next();

    }catch(err){
        console.log(err.message)
        res.status(401).send('Unauthorized:No token provided');
    }
}

module.exports = adminAuthenticate;