const User = require('../models/userSchema');
const bcrypt = require('bcrypt');


const adminLogin = async(req,res)=>{
    try {
        const {email,password} = req.body;
    console.log(email,password);
    let admin  = await User.findOne({email});
    if(admin){
      const passwordMatch =  await bcrypt.compare(password,admin.password);
      if(passwordMatch){
        if(admin.is_admin){
            const token = await admin.generatingToken();
            // console.log('backend login',)
            console.log("-------------token", token);
    
            res.cookie("admin", token, {
              expires: new Date(Date.now() + 25892000),
              httpOnly: true,
              // path: "/",
            });
            //  25892000000 (30days)
        return res.status(200).json({ message: "Signin Successfull...!",token });
        }else{
        res.status(400).json({error:"Invalid email and password"})
        }
      }else{
        res.status(400).json({error:"Invalid email and password"})
      }
    }else{
        res.status(400).json({error:"Invalid email and password"})
    }
    } catch (error) {
        console.log("adminLogin",error.message)
    }
}


const adminLogout = async (req,res)=>{
    try {
        // console.log('Before',req.rootUser.tokens.length);
        req.rootUser.tokens = req.rootUser.tokens.filter((token)=>token.token !== req.token);
        res.clearCookie('admin');
        const adminLogout = await req.rootUser.save();
        if(adminLogout){
         res.status(200).json({message: 'Logout Successfully'})
        }else{
          res.status(400).json({error:"Admin is not login...!"})
        }
        console.log('After',req.rootUser.tokens.length);
        } catch (error) {
             res.status(500).json({error:'Admin not logout'})
        }
}

const adminDashboard = async (req,res)=>{
  try {
    const userData = await User.find({is_admin:false});
    res.status(200).json(userData);
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
    adminLogin,
    adminLogout,
    adminDashboard
}