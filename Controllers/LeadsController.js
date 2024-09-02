// Importing neccessary components
import dotenv from "dotenv";
import { hashPassword } from "../Utils/Auth.js";
import jwt from "jsonwebtoken";
import Users from "../Models/UserSchema.js";
import Leads from "../Models/LeadsSchema.js";
import nodemailer from "nodemailer";

dotenv.config();


// Creating a Leads - Signup - Post (Employee, Manager and Admins)
export const CreateLeads = async(req,res)=>{
    try{
        const find_User = await Leads.findOne({Email:req.body.Email})
        if(!find_User){
            const token = req.cookies.token || req.headers.authorization.split(" ")[1];
            const data = await jwt.decode(token)
            let hashedPassword = await hashPassword(req.body.Password)
            req.body.Password = hashedPassword;
            const UserData = await Leads.create({
                First_Name : req.body.First_Name,
                Last_Name : req.body.Last_Name,
                Email : req.body.Email,
                Password : req.body.Password,
                Lead_Generated_by : data.Id
            });
            await UserData.save();
            await Users.findByIdAndUpdate({_id:data.Id},{$push:{ Leads_Generated:UserData._id}})

            const find_Admin = await Users.findOne({Role:"Admin"})
            const find_Manager = await Users.findOne({Role:"Manager"})
    

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
                to: `${find_Admin.Email},${find_Manager.Email}`,
                subject: 'New Lead Generated',
                html:`<p>A new Lead is generated with following Details:-</p><br/><p>Name:${UserData.First_Name},Id:${UserData._id},Email:${UserData.Email}</p>`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  res.status(400).send(error)
                } else {
                    res.status(200).send({message:"Leads created Successfully"})
                }
            });
        }
        else{
            res.status(400).send({message:"Email Id already exists!"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Get Leads - Get (Employee, Manager and Admins)
export const getLeads = async(req,res)=>{
    try{
        const find_Users = await Leads.find()
        if(find_Users){
            res.status(200).send({message:"Leads fetched Successfully",user:find_Users})
        }
        else{
            res.status(400).send({message:"Leads not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Get a Particular Lead - Get (Employee, Manager and Admins)
export const getOneLead = async(req,res)=>{
    try{
        const {id} = req.params;
        const find_Employee = await Leads.findById(id)
        if(find_Employee){
            const Service_Data = await Leads.findById(id).populate('Service_Requests','-_id')
            const Employee_Data = await Leads.findById(id).populate('Lead_Generated_by','-_id')
            res.status(200).send({message:"Lead Found",Lead:find_Employee,ServiceRequests:Service_Data.Service_Requests,Lead_Generated_by:Employee_Data.Lead_Generated_by})
        }
        else{
            res.status(400).send({message:"Lead not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Update a Lead - Put (Employee, Manager and Admins)
export const updateLead = async(req,res)=>{
    try{
        const {id} = req.params;
        const find_Employee = await Leads.findById(id)
        if(find_Employee){
            find_Employee.First_Name = req.body.First_Name || find_Employee.First_Name;
            find_Employee.Last_Name = req.body.Last_Name || find_Employee.Last_Name;
            find_Employee.Email = req.body.Email || find_Employee.Email;
            find_Employee.Status = req.body.Status || find_Employee.Status;

            const updatedEmployee = await find_Employee.save()
            res.status(200).send({message:"Lead data Updated!",user:updatedEmployee})
        }
        else{
            res.status(400).send({message:"Lead not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Delete a Lead - delete (Employee, Manager and Admins)
export const DeleteLead = async(req,res)=>{
    try{
        const {id} = req.params;
        const find_User = await Leads.findOne({Email: id})
        if(find_User){
            const user = await Leads.deleteOne({Email:id})
            const updateIn_User = await Users.findByIdAndUpdate({_id:find_User.Lead_Generated_by},{$pull:{Leads_Generated:find_User._id}})
            res.status(200).send({message:"Lead deleted successfully!"})
        }
        else{
            res.status(400).send({message:"Lead not found"})
        }
    }
    catch(err){
        res.status(500).send({message : "Internal server error",err})
    }
}