// const  dotenv= require('dotenv'); 
// dotenv.config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("../database/connection");
const User = require("../models/userSchema");
const nodemailer = require('nodemailer');
// const Mailgen = require('mailgen');
const randomstring = require('randomstring');
// const url = require('url');





//  send mail for verify email
const sendVerifyMail = (name,email,userId)=>{
  console.log('sendVerifyMail',name,email,userId)
  try {

    // let config = {
    //   service:'gmail',
    //   auth:{
    //     user:'pavankadagi02@gmail.com',
    //     pass:'xibxxasjsfhdaouz'
    //   }
    // }

    // let transporter = nodemailer.createTransport(config)

    // let mailGenerator = new Mailgen({
    //   theme:"default",
    //   product:{
    //     name:"Mailgen",
    //     link:"https://mailgen.js"
    //   }
    // })

    // let response = {
    //   body:{
    //     name,
    //     intro:'Your bill has arrived!',
    //     table:{
    //       data:[
    //         {
    //           item:"Nodemailer Stack Book",
    //           description:"A Backend application",
    //           price:"$10"
    //         }
    //       ]
    //     },
    //     outro:"Looking forword to do more business"
    //   }
    // }

    // let mail = mailGenerator.generate(response);

    // let message = {
    //   from: "pavankadagi02@gmail.com",
    //   to:email,
    //   subject:"Please Prder",
    //   html:mail
    // }

    // transporter.sendMail(message).then(()=>console.log(
    //   'you should receive an email'
    // )).catch((err)=>console.log(err)) 


    // google smtp
  const transporter =  nodemailer.createTransport({
      host:'smtp.gmail.com',
      port:587,
      secure:false,
      requireTLS:true,
      auth:{
        user:process.env.EMAIL,
        pass:process.env.PASS
      }
    });

    const mailOptions = {
      from:process.env.EMAIL,
      to:email,
      subject:'For Verification mail',
      html:`<p>Hi ${name}, please click here to <a href="${process.env.CIIENT_URL}/verify?id=${userId}"> Verify </a> your mail.</p>`
    }
   

    transporter.sendMail(mailOptions).then(()=>console.log(
      'you should receive an email'
    )).catch((err)=>console.log("mail",err))
  } catch (error) {
    console.log(error.message) 
  }
}

const verifyMail = async (req,res)=>{
  try {
    console.log(req.query)
    const updateUser = await User.findByIdAndUpdate({_id:req.query.id},{is_verified:true});
    console.log(updateUser);
    if(updateUser){
  res.status(200).json({message:"Verify Successfully...!"})
    }else{
      res.status(400).json({error:"User is already login...!"})
    }
  } catch (error) {
    res.status(400).json({error:"not validate"})
    console.log("verifyMail",error.message)
  }
}

const userSignUp = async (req, res) => {
  try {
    const { nameVal, emailVal, phoneVal, profession, address, dob, passwordVal } = req.body;
    console.log(req.body)
    if (
      !nameVal ||
      !emailVal ||
      !phoneVal ||
      !profession ||
      !address ||
      !dob ||
      !passwordVal
    ) {
      return res
        .status(422)
        .json({ error: "Plz filled the field properly...!" });
    }

    const userExist = await User.findOne({ email: emailVal });

    if (userExist) {
      return res.status(422).json({ error: "Email already Exist...!" });
    }

    const newUser = new User({
      name:nameVal,
      email:emailVal,
     phone: phoneVal,
      profession,
      address,
      dob,
      password:passwordVal,
      is_admin:false
    });

    const userData = await newUser.save();
  console.log(userData)
    if(userData){
      console.log('00000000000',userData._id)
      sendVerifyMail(nameVal,emailVal,userData._id);
    res.status(201).json({ message: "Your registration has been successfully, Please verify your mail." }); 
    }
    else{
    res.status(500).json({ error: "Failed to registered...!" });
    }
  } catch (error) {
    console.log("login ---", error.message);
    res.status(500).json({ error: "Failed to registered...!" });
  }
};

const userSignIn = async (req, res) => {
  try {
    console.log(req.body)
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Plz filled the field properly...!" });
    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const passwordMatch = await bcrypt.compare(password, userLogin.password);

      if (passwordMatch) {
       if(userLogin.is_verified){
           //need to generate the token and stored cookie after the password match
           const token = await userLogin.generatingToken();
           // console.log('backend login',)
           console.log("-------------token", token);
   
           res.cookie("user", token, {
            expires: new Date(Date.now() + 258900000),
            httpOnly: true,
            secure:true,
            sameSite:"none"
          });

          // req.session.user = token;
          //  console.log(cookie)
      
        return res.status(200).json({ message: "Signin Successfull...!",token });
       }else{
        return res.status(400).json({ error: "Please verify your mail...!" });
       }
      } else {
        return res.status(400).json({ error: "Invalid Credientials...!" });
      }
    } else {
      return res.status(400).json({ error: "Invalid Credientials " });
    }
    // console.log(userLogin);
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: "Invalid Credientials" });
  }
};



//  send mail for reset password
const SendResetPassword = (name,email,token)=>{
  console.log('sendVerifyMail',name,email,token)
  try {
    // google smtp
  const transporter =  nodemailer.createTransport({
      host:'smtp.gmail.com',
      port:587,
      secure:false,
      requireTLS:true,
      auth:{
        user:process.env.EMAIL,
        pass:process.env.PASS
      }
    });

    const mailOptions = {
      from:process.env.EMAIL,
      to:email,
      subject:'For Reset Password',
      html:`<p>Hi ${name}, please click here to <a href="${process.env.CIIENT_URL}/forget-password?token=${token}"> Reset </a> your password.</p>`
    }
    

    transporter.sendMail(mailOptions).then(()=>console.log(
      'you should receive an email'
    )).catch((err)=>console.log("mail",err))
  } catch (error) {
    console.log(error.message) 
  }
}

const forgetPassword = async (req,res)=>{
  try {
    const {email} = req.body;
    const user = await User.findOne({email});
    console.log(user);
    if(user){
      if(user.is_verified){
      const randomString = randomstring.generate();
      const updateUser = await User.updateOne({email},{$set:{token:randomString}}) 
      console.log(updateUser)
      SendResetPassword(user.name,user.email,randomString)
      res.status(200).json({message:"Please check your mail to reset your password...!"})
      }else{
      res.status(400).json({error:"Please verify your mail...!"})
      }
    }else{
      res.status(400).json({error:"User email is incorrect...!"})
    }
  } catch (error) {
    console.log(error.message)
  }
}

const verifyPassword = async (req,res)=>{
  try {
    const {token} = req.body;
    console.log('verifyPassword',token);
    const tokenData = await User.findOne({token});
    console.log('tokenData',tokenData);
    if(tokenData){
      res.status(200).json({userId:tokenData._id});
    }else{
      res.status(400).json({error:"Token is invalid...!"})
    }
  } catch (error) {
    console.log(error.message);
  }
}

const resetPassword = async (req,res)=>{
  try {
    const {password,id} = req.body;
    console.log('password',password,id);
    const newPassword = await bcrypt.hash(password,10);

    const updateData = await User.findByIdAndUpdate({_id:id},{$set:{password:newPassword,token:''}})
    if(updateData){
      res.status(200).json({message:"Password Update Successfully...!"});
    }

  } catch (error) {
    console.log(error.message)
  }
}

const sendVerificationLink = async (req,res)=>{
 try {
  const {email} = req.body;
  let user = await User.findOne({email});
  console.log(user);
  if(user){
    sendVerifyMail(user.name,user.email,user._id);
    res.status(200).json({message:"Reset verification mail send to your mail id, please check...!"})
  }else{
    res.status(400).json({error:"This email is not exist...!"})
  }
 } catch (error) {
  console.log(error.message)
 }
}

const userDetails = async (req, res) => {
   res.status(200).send(req.rootUser);
};

const userDetailsUpdate = async (req, res) => {
  try {
    console.log("Hello from about page (PATCH)!");
    console.log(req.body);
    let updataUserData = await User.findByIdAndUpdate(
      { _id: req.userId },
      req.body,
      { new: true }
    );
    console.log("------------------------------", updataUserData);
    return res.status(200).json({ message: "Update Successfull...!" });
  } catch (error) {
    return res.status(400).json({ error: "Invalid Credientials...!" });
  }
};

const getUserData = async (req, res) => {
  return res.status(200).send(req.rootUser);
};

const messageFromUser = async (req, res) => {
  try {
    console.log("contact --------", req.body);
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res
        .status(400)
        .json({ error: "please filled the contact form...!" });
    }
    const userConatct = await User.findOne({ _id: req.userId });

    if (userConatct) {
      const userMessage = await userConatct.addMessage(
        name,
        email,
        phone,
        message
      );
      console.log("message", userMessage);
      await userConatct.save();
      return res.status(201).json({ message: "Message Send...!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Message not send...!" });
  }
};


const userLogout = async (req,res)=>{
  try {
console.log('Before',req.rootUser.tokens.length);
req.rootUser.tokens = req.rootUser.tokens.filter((token)=>token.token !== req.token);
res.clearCookie('user');
const userLogout = await req.rootUser.save();
if(userLogout){
 res.status(200).json({message: 'Logout Successfully'})
}else{
  res.status(400).json({error:"User is not login...!"})
}
console.log('After',req.rootUser.tokens.length);
} catch (error) {
     res.status(500).json({error:'user not logout'})
}
}

const addAnswerToUser = async (req, res) => {
  try {
    const { answer, language,timeTaken } = req.body;
    const user = await User.findOne({ _id: req.userId });
    console.log('user',user,timeTaken);

    if (user) {
      const userAnswer = await user.addAnswerToUser(answer, language,timeTaken);
      console.log('----',userAnswer);
      await user.save();
      return res.status(201).json({message:"Test completed...!"})
    }
  } catch (error) {
    res.status(400).json({error})
    console.log('answers',error)
  }
};

const getAnswers = async (req,res)=>{
  res.status(200).send(req.rootUser.answers);
}

module.exports = {
  userSignUp,
  userSignIn,
  userDetails,
  userDetailsUpdate,
  getUserData,
  messageFromUser,
  userLogout,
  addAnswerToUser,
  getAnswers,
  verifyMail,
  forgetPassword,
  verifyPassword,
  resetPassword,
  sendVerificationLink
};
