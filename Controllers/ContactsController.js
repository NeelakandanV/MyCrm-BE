// Importing neccessary components
import dotenv from "dotenv";
import Contacts from "../Models/ContactSchema.js"
import { hashPassword } from "../Utils/Auth.js";
import jwt from "jsonwebtoken";
import Users from "../Models/UserSchema.js";
import Leads from "../Models/LeadsSchema.js";
import nodemailer from "nodemailer";

dotenv.config();


// Creating a Contact - Signup - Post (Employee, Manager and Admins)
export const CreateContacts = async(req,res)=>{
    try{
        const find_User = await Contacts.findOne({Email:req.body.Email})
        if(!find_User){
            const token = req.cookies.token;
            const data = await jwt.decode(token)
            const UserData = await Contacts.create({
                First_Name : req.body.First_Name,
                Last_Name : req.body.Last_Name,
                Email : req.body.Email,
                Contact_Generated_by : data.Id
            });
            await UserData.save();
            await Users.findByIdAndUpdate({_id:data.Id},{$push:{ Contacts_Created:UserData._id}})
            res.status(200).send({message:"Contact created Successfully"})
        }
        else{
            res.status(400).send({message:"Email Id already exists!"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Get Contacts - Get (Employee, Manager and Admins)
export const getContacts = async(req,res)=>{
    try{
        const find_Users = await Contacts.find()
        if(find_Users){
            res.status(200).send({message:"Contacts fetched Successfully",user:find_Users})
        }
        else{
            res.status(400).send({message:"Contacts not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Get a Particular Contact - Get (Employee, Manager and Admins)
export const getOneContact = async(req,res)=>{
    try{
        const {id} = req.params;
        const find_Employee = await Contacts.findById(id)
        if(find_Employee){
            const Employee_Data = await Contacts.findById(id).populate('Contact_Generated_by','-_id')
            res.status(200).send({message:"Contact Found",Contact:find_Employee,Contact_Generated_by:Employee_Data.Contact_Generated_by})
        }
        else{
            res.status(400).send({message:"Contact not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Update a Contact - Put (Employee, Manager and Admins)
export const updateContact = async(req,res)=>{
    try{
        const {id} = req.params;
        const find_Employee = await Contacts.findById(id)
        if(find_Employee){
            find_Employee.First_Name = req.body.First_Name || find_Employee.First_Name;
            find_Employee.Last_Name = req.body.Last_Name || find_Employee.Last_Name;
            find_Employee.Email = req.body.Email || find_Employee.Email;

            const updatedEmployee = await find_Employee.save()
            res.status(200).send({message:"Contact data Updated!",user:updatedEmployee})
        }
        else{
            res.status(400).send({message:"Employee not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Delete a Contact - delete (Employee, Manager and Admins)
export const DeleteContact = async(req,res)=>{
    try{
        const {id} = req.params;
        const find_User = await Contacts.findOne({Email: id})
        if(find_User){
            const user = await Contacts.deleteOne({Email:id})
            const updateIn_User = await Users.findByIdAndUpdate({_id:find_User.Contact_Generated_by},{$pull:{Contacts_Created:find_User._id}})
            res.status(200).send({message:"Contact deleted successfully!"})
        }
        else{
            res.status(400).send({message:"Contact not found"})
        }
    }
    catch(err){
        res.status(500).send({message : "Internal server error",err})
    }
}

// Change Contact to Lead - Put (Employee, Manager and Admins)
export const Contact_to_Lead = async(req,res)=>{
    try{
        const {id} = req.params;
        const find_User = await Contacts.findOne({Email: id})
        if(find_User){
            const token = req.cookies.token;
            const data = await jwt.decode(token)
            
            const UserData = await Leads.create({
                First_Name : find_User.First_Name,
                Last_Name : find_User.Last_Name,
                Email : find_User.Email,
                Password : await hashPassword("123456"),
                Lead_Generated_by : data.Id
            });
            await UserData.save();
            await Users.findByIdAndUpdate({_id:data.Id},{$push:{ Leads_Generated:UserData._id}})

            const user = await Contacts.deleteOne({Email:id})
            const updateIn_User = await Users.findByIdAndUpdate({_id:data.Id},{$pull:{Contacts_Created:find_User._id}})

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
                subject: 'Contact converted As New Lead',
                html:`<p>A new Lead is generated with following Details:-</p><br/><p>Name:${UserData.First_Name},Id:${UserData._id},Email:${UserData.Email}</p>`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  res.status(400).send(error)
                } else {
                    res.status(200).send({message:"Contact changed as Lead!"})
                }
            });
        }
        else{
            res.status(400).send({message:"Contact not found"})
        }
    }
    catch(err){
        res.status(500).send({message : "Internal server error",err})
    }
}