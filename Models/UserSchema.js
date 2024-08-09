// Importing neccessary components

import mongoose from "mongoose";
import validator from "validator";

// Validation Schema

const UserSchema = new mongoose.Schema({
    First_Name : {
        type : String,
        required : true
    },
    Last_Name : {
        type : String,
        required : true
    },
    Email : {
        type : String,
        required : true ,
        lowercase : true,
        validate : (value) =>{
            return validator.isEmail(value);
        }
    },
    Password : {
        type : String,
        required : true
    },
    Role :{
        type : String,
        required : true
    },
    VerifyPin : {
        type : String
    },
    ResetPin : {
        type : String
    },
    Access : {
        type : String,
        default : "Denied"
    },
    Leads_Generated : [{
        type : mongoose.Schema.Types.ObjectId,ref:'Leads'
    }],
    Service_Requests : [{
        type : mongoose.Schema.Types.ObjectId,ref:'Services'
    }],
    Contacts_Created:[{
        type : mongoose.Schema.Types.ObjectId,ref:'Contacts'
    }],
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : String,
        default : Date.now
    }
},{
    versionKey : false
})

const Users = mongoose.model("Users",UserSchema);
export default Users;