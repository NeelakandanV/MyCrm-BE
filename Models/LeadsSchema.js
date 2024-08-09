// Importing neccessary components

import mongoose from "mongoose";
import validator from "validator";

// Validation Schema

const LeadsSchema = new mongoose.Schema({
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
    Status : {
        type : String,
        default : "New"
    },
    Role : {
        type : String,
        default : "Lead"
    },
    Password : {
        type : String,
        required : true
    },
    ResetPin : {
        type : String
    },
    Service_Requests : [{
        type : mongoose.Schema.Types.ObjectId,ref:'Services'
    }],
    Lead_Generated_by : {
        type : mongoose.Schema.Types.ObjectId,ref:'Users'
    },
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

const Leads = mongoose.model("Leads",LeadsSchema);
export default Leads;