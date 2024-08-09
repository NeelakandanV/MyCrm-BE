// Importing neccessary components
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Users from "../Models/UserSchema.js";
import Leads from "../Models/LeadsSchema.js";
import Contacts from "../Models/ContactSchema.js"
import { hashPassword,hashCompare,LoginToken,ResetToken} from "../Utils/Auth.js";
import Services from "../Models/ServicesSchema.js";

dotenv.config();

// Checking credentials of a User  - Login - Post
export const LoginUser = async(req,res)=>{
    try{
        const find_User = await Users.findOne({Email:req.body.Email})
        if(find_User){
            if(req.body.Password){
                const Password_Status = await hashCompare(req.body.Password,find_User.Password)
                if(Password_Status){
                    let token = await LoginToken({
                        First_Name:find_User.First_Name,
                        Email:find_User.Email,
                        Role:find_User.Role,
                        Access:find_User.Access,
                        Id : find_User._id
                    })

                    // set a cookie with the token
                    res.cookie('token', token, {
                        httpOnly :true,
                        sameSite : 'none',
                        secure :  true
                    });
                    res.status(200).send({message:"Login Successful",token,user:find_User})
                }
                else{
                    res.status(401).send({message:"Incorrect Password!"})
                }
            }
            else{
                res.status(400).send({message:"Password required"})
            }
        }
        else{
            res.status(400).send({message:"User not registered yet!"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal server error",err})
    }
}


// Checking credentials of a Lead  - Login - Post
export const LoginLead = async(req,res)=>{
    try{
        const find_Lead = await Leads.findOne({Email:req.body.Email})
        if(find_Lead){
            if(req.body.Password){
                const Password_Status = await hashCompare(req.body.Password,find_Lead.Password)
                if(Password_Status){
                    let token = await LoginToken({
                        First_Name:find_Lead.First_Name,
                        Email:find_Lead.Email,
                        Role:find_Lead.Role,
                        Id : find_Lead._id,
                        Employee : find_Lead.Lead_Generated_by
                    })

                    // set a cookie with the token
                    res.cookie('token', token, {
                        httpOnly :true,
                        sameSite : 'none',
                        secure :  true
                    });
                    res.status(200).send({message:"Login Successful",token,user:find_Lead})
                }
                else{
                    res.status(401).send({message:"Incorrect Password!"})
                }
            }
            else{
                res.status(400).send({message:"Password required"})
            }
        }
        else{
            res.status(400).send({message:"User not Found!"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal server error",err})
    }
}


// Verifying User - for users - PUT
export const VerifyUserLink = async(req,res)=>{
    try{
        const find_User = await Users.findOne({Email: req.body.Email})
        if(!find_User){
            res.status(400).send({message:"User not found,Kindly Signup first"})
        }
        else{
            if(find_User.Access=="Granted"){
                res.status(400).send({message:"User Account already Activated"})
            }
            else{
            // Generating a random string
            const String = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            const ResetStringLength = 6;  //string length we want
            const StringLength = String.length;
            let ResetString ="";
            for(let i=0;i<ResetStringLength;i++){
                ResetString = ResetString + String.charAt(Math.floor(Math.random()*StringLength))
            }

            //Updating Reset String in Db
            const UpdateResetString = await Users.updateOne({Email :req.body.Email},{$set:{VerifyPin : ResetString}})

            // Generating reset link
            let token = await ResetToken({
                Name : find_User.First_Name,
                Email : find_User.Email
            })
            const link = `http://localhost:5000/verifyUser/${find_User._id}/${ResetString}/${token}`

            // for Sending mails - nodemailer
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'hari1507hari@gmail.com',
                      pass: process.env.MAILPASS
                    }
                  });
                  
                  var mailOptions = {
                    from: 'hari1507hari@gmail.com',
                    to: find_User.Email,
                    subject: 'Verify Your MyCrm Account ',
                    html:`<p>Kindly click the below link or copy and paste the link in your browser to verify your MiniUrl Account.<b>Your Link is valid for only 5 minutes</b></p><a href=${link}>Click here to verify account</a></br><p></p>copy and paste the link in your browser<p>${link}</p>`
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      res.status(400).send(error)
                    } else {
                        res.status(200).send({message : `Verification Link sent to ${find_User.Email}`, "Mail" : info.response})
                    }
                });
            }
        }
    }
    catch(err){
        res.status(500).send({message : "Internal server error",err})
    }
}


// VerifyUser - for users - GET
export const verifyUser =async(req,res)=>{
    try{
        const {id,pin,token} = req.params;
        // Validating the reset link
        const find_User = await Users.findOne({_id: id})
        if(pin===find_User.VerifyPin){
            const verifyToken = await jwt.verify(token,process.env.SECRETKEY_RESET)
            if(Math.floor((+new Date())/1000) < verifyToken.exp){
                // Updating New Password
                const changeStatus = await Users.updateOne({_id:id},{$set:{Access:"Granted"}})
                const deleteResetPin = await Users.updateOne({_id:id},{$unset:{VerifyPin:""}})
                res.status(200).send({message:"User Verified Successfully!"})
            }
            else{
                res.status(401).send({message:"Token expired or Token not found"})
            }
        }
        else{
            res.status(401).send({Error:"Unauthorized",message: "Token Expired or Token not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",data :"Invalid Link",err})
    }
}


// Forgot Password - for Users- ForgotPassword - put

export const ForgotPassword = async(req,res)=>{
    try{
        const find_User = await Users.findOne({Email: req.body.Email})
        if(!find_User){
            res.status(400).send({message:"User not found"})
        }
        else{
            // Generating a random string
            const String = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            const ResetStringLength = 6;  //string length we want
            const StringLength = String.length;
            let ResetString ="";
            for(let i=0;i<ResetStringLength;i++){
                ResetString = ResetString + String.charAt(Math.floor(Math.random()*StringLength))
            }
            //Updating Reset String in Db
            const UpdateResetString = await Users.updateOne({Email :req.body.Email},{$set:{ResetPin : ResetString}})
            // Generating reset link
            let token = await ResetToken({
                Name : find_User.First_Name,
                Email : find_User.Email
            })
            const link = `http://localhost:5000/ResetPassword/${find_User._id}/${ResetString}/${token}`
            // for Sending mails - nodemailer
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'hari1507hari@gmail.com',
                  pass: process.env.MAILPASS
                }
              });
              
              var mailOptions = {
                from: 'hari1507hari@gmail.com',
                to: find_User.Email,
                subject: 'Reset your Password',
                html:`<p>Kindly click the below link or copy and paste the link in your browser to reset your password.<b>Your Link is valid for only 5 minutes</b></p><a href=${link}>Click here to reset Password</a></br><p></p>copy and paste the link in your browser<p>${link}</p>`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  res.status(400).send(error)
                } else {
                    res.status(200).send({message : `Reset Link sent to ${find_User.Email}`, "Mail" : info.response})
                }
            });
        }
    }
    catch(err){
        res.status(500).send({message : "Internal server error",err})
    }
}


// Forgot Password for Leads- ForgotPassword - put

export const Leads_ForgotPassword = async(req,res)=>{
    try{
        const find_Lead = await Leads.findOne({Email: req.body.Email})
        if(!find_Lead){
            res.status(400).send({message:"User not found"})
        }
        else{
            // Generating a random string
            const String = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            const ResetStringLength = 6;  //string length we want
            const StringLength = String.length;
            let ResetString ="";
            for(let i=0;i<ResetStringLength;i++){
                ResetString = ResetString + String.charAt(Math.floor(Math.random()*StringLength))
            }
            //Updating Reset String in Db
            const UpdateResetString = await Leads.updateOne({Email :req.body.Email},{$set:{ResetPin : ResetString}})
            // Generating reset link
            let token = await ResetToken({
                Name : find_Lead.First_Name,
                Email : find_Lead.Email
            })
            const link = `http://localhost:5000/Lead/ResetPassword/${find_Lead._id}/${ResetString}/${token}`
            // for Sending mails - nodemailer
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'hari1507hari@gmail.com',
                  pass: process.env.MAILPASS
                }
              });
              
              var mailOptions = {
                from: 'hari1507hari@gmail.com',
                to: find_Lead.Email,
                subject: 'Reset your Password',
                html:`<p>Kindly click the below link or copy and paste the link in your browser to reset your password.<b>Your Link is valid for only 5 minutes</b></p><a href=${link}>Click here to reset Password</a></br><p></p>copy and paste the link in your browser<p>${link}</p>`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  res.status(400).send(error)
                } else {
                    res.status(200).send({message : `Reset Link sent to ${find_Lead.Email}`, "Mail" : info.response})
                }
            });
        }
    }
    catch(err){
        res.status(500).send({message : "Internal server error",err})
    }
}


// Reset Password for users- ResetPassword - Put
 export const PasswordReset =async(req,res)=>{
    try{
        const {id,pin,token} = req.params;
        // Validating the reset link
        const find_User = await Users.findOne({_id: id})
        if(pin===find_User.ResetPin){
            const verifyToken = await jwt.verify(token,process.env.SECRETKEY_RESET)
            if(Math.floor((+new Date())/1000) < verifyToken.exp){
                // Updating New Password
                let hashedPassword = await hashPassword(req.body.Password)
                req.body.Password = hashedPassword;
                const updateNewPassword = await Users.updateOne({_id:id},{$set:{Password:req.body.Password}});
                const deleteResetPin = await Users.updateOne({_id:id},{$unset:{ResetPin:""}})
                res.status(200).send({message:"New Password Created Successfully!"})
            }
            else{
                res.status(401).send({message:"Token expired or Token not found"})
            }
        }
        else{
            res.status(401).send({Error:"Unauthorized",message: "Token Expired or Token not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",data :"Send Password in req.body",err})
    }
}


// Reset Password for Leads- ResetPassword - Put
export const Leads_PasswordReset =async(req,res)=>{
    try{
        const {id,pin,token} = req.params;
        // Validating the reset link
        const find_Lead = await Leads.findOne({_id: id})
        if(pin===find_Lead.ResetPin){
            const verifyToken = await jwt.verify(token,process.env.SECRETKEY_RESET)
            if(Math.floor((+new Date())/1000) < verifyToken.exp){
                // Updating New Password
                let hashedPassword = await hashPassword(req.body.Password)
                req.body.Password = hashedPassword;
                const updateNewPassword = await Leads.updateOne({_id:id},{$set:{Password:req.body.Password}});
                const deleteResetPin = await Leads.updateOne({_id:id},{$unset:{ResetPin:""}})
                res.status(200).send({message:"New Password Created Successfully!"})
            }
            else{
                res.status(401).send({message:"Token expired or Token not found"})
            }
        }
        else{
            res.status(401).send({Error:"Unauthorized",message: "Token Expired or Token not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",data :"Send Password in req.body",err})
    }
}


// Logout User - Get
export const Logout = async(req,res)=>{
    try{
        const token = req.cookies.token;

        //if user does not logged in
        if(!token){
            return res.status(400).send({message: 'User not logged in'});
        }

        //clear the cookie
        res.clearCookie('token');

        //return the user
        res.status(200).send({message : 'Logout successful'});

    }catch(error){
        res.send({message : error.message})
    }
}


//For Dashboard
export const Dashboard = async(req,res)=>{
    try{
        const ServicesCount = await Services.countDocuments();
        const ContactsCount = await Contacts.countDocuments();
        const LeadsCount = await Leads.countDocuments();
        res.status(200).send({message:"Data fetched Successfully",Service:ServicesCount,Contact:ContactsCount,Lead:LeadsCount})
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error"})
    }
}


//for frontend - Get
export const  checkAuth =async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send({ message: 'Access denied' });
        }
        // verify the token
        try {
            const decoded = jwt.verify(token, process.env.SECRETKEY_LOGIN);
            return res.status(200).send({ message: 'Valid token' });
        } catch (error) {
            return res.status(401).send({ message: 'Invalid token' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}