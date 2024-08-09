// Importing neccessary components
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Services from "../Models/ServicesSchema.js";
import Users from "../Models/UserSchema.js";
import Leads from "../Models/LeadsSchema.js";

dotenv.config();


// Creating a Request - Create - Post (Only Leads)
export const CreateService_Request = async(req,res)=>{
    try{
        const token = req.cookies.token;
        const data = await jwt.decode(token)
        const find_User = await Leads.findOne({_id:data.Id})
        if(find_User){
            const Service_Data = await Services.create({
                Service_Name : req.body.Service_Name,
                Description : req.body.Description || "",
                Requested_By : data.Id,
                Employee_Assigned : data.Employee
            });
            await Service_Data.save();
            await Users.findByIdAndUpdate({_id:data.Employee},{$push:{ Service_Requests:Service_Data._id}})
            await Leads.findByIdAndUpdate({_id:data.Id},{$push:{ Service_Requests:Service_Data._id}})

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
                subject: 'New Service Request',
                html:`<p>A new service request is generated with following Details:-</p><br/><p>Service Name:${Service_Data.Service_Name},Id:${Service_Data._id},Email:${Service_Data.Description},Requested By :${data.First_Name}</p>`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  res.status(400).send(error)
                } else {
                    res.status(200).send({message:"Service request created Successfully"})
                }
            });
        }
        else{
            res.status(400).send({message:"Lead not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Get Service Requests - Get (Employee, Manager and Admins)
export const getService_Request = async(req,res)=>{
    try{
        const find_Users = await Services.find()
        if(find_Users){
            res.status(200).send({message:"Service Requests fetched Successfully",user:find_Users})
        }
        else{
            res.status(400).send({message:"Service Requests not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Get a Particular Request - Get (Employee, Manager and Admins)
export const getOne_Service_Request = async(req,res)=>{
    try{
        const {id} = req.params;
        const find_Employee = await Services.findById(id)
        if(find_Employee){
            const Lead_Data = await Services.findById(id).populate('Requested_By','-_id')
            const Employee_Data = await Services.findById(id).populate('Employee_Assigned','-_id')
            res.status(200).send({message:"Service Request Found",user:find_Employee,RequestedBy:Lead_Data.Requested_By,EmployeeAssigned:Employee_Data.Employee_Assigned})
        }
        else{
            res.status(400).send({message:"Service Request not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Update a Service Request - Put (Employee, Manager and Admins)
export const updateService_Request = async(req,res)=>{
    try{
        const {id} = req.params;
        const find_Employee = await Services.findById(id)
        if(find_Employee){
            find_Employee.Service_Name = req.body.Service_Name || find_Employee.Service_Name;
            find_Employee.Description = req.body.Description || find_Employee.Description;
            find_Employee.Status = req.body.Status || find_Employee.Status;

            const updatedEmployee = await find_Employee.save()
            res.status(200).send({message:"Service Request Updated!",user:updatedEmployee})
        }
        else{
            res.status(400).send({message:"Service Request not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Delete a Service_Request - delete (Employee, Manager and Admins)
export const DeleteService_Request = async(req,res)=>{
    try{
        const {id} = req.params;
        const find_User = await Services.findById(id)
        if(find_User){
            const user = await Services.findByIdAndDelete(id)
            const updateIn_User = await Users.findByIdAndUpdate({_id:find_User.Employee_Assigned},{$pull:{Service_Requests:find_User._id}})
            const updateIn_Lead = await Leads.findByIdAndUpdate({_id:find_User.Requested_By},{$pull:{Service_Requests:find_User._id}})
            res.status(200).send({message:"Service Request deleted successfully!"})
        }
        else{
            res.status(400).send({message:"Service Request not found"})
        }
    }
    catch(err){
        res.status(500).send({message : "Internal server error",err})
    }
}