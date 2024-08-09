// Importing neccessary components

import mongoose from "mongoose";
import validator from "validator";

// Validation Schema

const ServicesSchema = new mongoose.Schema({
    Service_Name : {
        type : String,
        required : true
    },
    Description : {
        type : String
    },
    Status :{
        type : String,
        default : "Created"
    },
    Requested_By : {
        type : mongoose.Schema.Types.ObjectId,ref:'Leads',
        required : true
    },
    Employee_Assigned : {
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

const Services = mongoose.model("Services",ServicesSchema);
export default Services;