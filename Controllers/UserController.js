// Importing neccessary components
import dotenv from "dotenv";
import Users from "../Models/UserSchema.js";
import { hashPassword } from "../Utils/Auth.js";

dotenv.config();

// Creating a User - Signup - Post (only Manager and Admins)
export const CreateUser = async(req,res)=>{
    try{
        const find_User = await Users.findOne({Email:req.body.Email})
        if(!find_User){
            if(req.body.Role!="Manager" && req.body.Role!="Admin"){
                let hashedPassword = await hashPassword(req.body.Password)
                req.body.Password = hashedPassword;
                const UserData = await Users.create(req.body);
                await UserData.save();
                res.status(200).send({message:"User created Successfully"})
            }
            else{
                res.status(400).send({message:"Authorized to appoint Employees only"})
            }
        }
        else{
            res.status(400).send({message:"Email Id already exists!"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Get Users - Get (Only Manager and Admins)
export const getUsers = async(req,res)=>{
    try{
        const find_Users = await Users.find({Role:"Employee"})
        if(find_Users){
            res.status(200).send({message:"Users fetched Successfully",user:find_Users})
        }
        else{
            res.status(400).send({message:"Employees not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Get a Particular Employee - Get (Only Manager and Admins)
export const getOneUser = async(req,res)=>{
    try{
        const {id} = req.params;
        const find_Employee = await Users.findById(id)
        if(find_Employee){
            const Service_Data = await Users.findById(id).populate('Service_Requests','-_id')
            const Lead_Data = await Users.findById(id).populate('Leads_Generated','-_id')
            const Contact_Data = await Users.findById(id).populate('Contacts_Created','-_id')
            res.status(200).send({message:"Employee Found",user:find_Employee,ServiceRequest:Service_Data.Service_Requests,Leads:Lead_Data.Leads_Generated,Contacts:Contact_Data.Contacts_Created})
        }
        else{
            res.status(400).send({message:"Employee not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}

// Update a Employee - Put (Only Manager and Admins)
export const updateUser = async(req,res)=>{
    try{
        const {id} = req.params;
        const find_Employee = await Users.findById(id)
        if(find_Employee){
            find_Employee.First_Name = req.body.First_Name || find_Employee.First_Name;
            find_Employee.Last_Name = req.body.Last_Name || find_Employee.Last_Name;
            find_Employee.Email = req.body.Email || find_Employee.Email;
            find_Employee.Access = req.body.Access || find_Employee.Access;

            const updatedEmployee = await find_Employee.save()
            res.status(200).send({message:"Employee data Updated!",user:updatedEmployee})
        }
        else{
            res.status(400).send({message:"Employee not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Delete a User - delete (Only Manager and Admins)
export const DeleteUser = async(req,res)=>{
    try{
        const {id} = req.params;
        const find_User = await Users.findOne({Email: id})
        if(find_User){
            if(find_User.Access=="Denied" && find_User.Role=="Employee"){
                const user = await Users.deleteOne({Email:id})
                res.status(200).send({message:"User deleted successfully!"})
            }
            else{
                res.status(400).send({message:"Employee is holding Important Data"})
            }
        }
        else{
            res.status(400).send({message:"User not found"})
        }
    }
    catch(err){
        res.status(500).send({message : "Internal server error",err})
    }
}


// Creating a Manager - Signup - Post (only Admins)
export const CreateManager = async(req,res)=>{
    try{
        const find_User = await Users.findOne({Email:req.body.Email})
        if(!find_User){
            if(req.body.Role="Manager"){
                let hashedPassword = await hashPassword(req.body.Password)
                req.body.Password = hashedPassword;
                const UserData = await Users.create(req.body);
                await UserData.save();
                res.status(200).send({message:"Manager created Successfully"})
            }
            else{
                res.status(400).send({message:"This is for appointing Managers"})
            }
        }
        else{
            res.status(400).send({message:"Email Id already exists!"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Get Managers - Get (Only Admins)
export const getManagers = async(req,res)=>{
    try{
        const find_Users = await Users.find({Role:"Manager"})
        if(find_Users){
            res.status(200).send({message:"Managers fetched Successfully",user:find_Users})
        }
        else{
            res.status(400).send({message:"Managers not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Get Details of a Particular Manager - Get (Only Admins)
export const getOneManager = async(req,res)=>{
    try{
        const {id} = req.params;
        const find_Manager = await Users.findById(id)
        if(find_Manager){
            const Service_Data = await Users.findById(id).populate('Service_Requests','-_id')
            const Lead_Data = await Users.findById(id).populate('Leads_Generated','-_id')
            const Contact_Data = await Users.findById(id).populate('Contacts_Created','-_id')
            res.status(200).send({message:"Manager Found",user:find_Manager,ServiceRequest:Service_Data.Service_Requests,Leads:Lead_Data.Leads_Generated,Contacts:Contact_Data.Contacts_Created})
        }
        else{
            res.status(400).send({message:"Manager not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Update a Manager - Put (Only Admins)
export const updateManager = async(req,res)=>{
    try{
        const {id} = req.params;
        const find_Employee = await Users.findById(id)
        if(find_Employee){
            find_Employee.First_Name = req.body.First_Name || find_Employee.First_Name;
            find_Employee.Last_Name = req.body.Last_Name || find_Employee.Last_Name;
            find_Employee.Email = req.body.Email || find_Employee.Email;
            find_Employee.Access = req.body.Access || find_Employee.Access;

            const updatedManager = await find_Employee.save()
            res.status(200).send({message:"Manager data Updated!",Manager:updatedManager})
        }
        else{
            res.status(400).send({message:"Manager not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Delete a Manager - delete (Only Admins)
export const DeleteManager = async(req,res)=>{
    try{
        const {id} = req.params;
        const find_User = await Users.findOne({Email: id})
        if(find_User){
            if(find_User.Access=="Denied" && find_User.Role=="Manager"){
                const user = await Users.deleteOne({Email:id})
                res.status(200).send({message:"Manager deleted successfully!"})
            }
            else{
                res.status(400).send({message:"Manager is holding Important Data"})
            }
        }
        else{
            res.status(400).send({message:"Manager not found"})
        }
    }
    catch(err){
        res.status(500).send({message : "Internal server error",err})
    }
}