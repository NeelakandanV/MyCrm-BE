// Importing neccessary components

import mongoose from "mongoose";
import validator from "validator";

// Validation Schema

const ContactsSchema = new mongoose.Schema({
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
    Contact_Generated_by : {
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

const Contacts = mongoose.model("Contacts",ContactsSchema);
export default Contacts;