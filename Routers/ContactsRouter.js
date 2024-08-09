// Importing neccessary components
import express from "express";
import { isAdminEmpManager, Validate } from "../Utils/Auth.js";
import { Contact_to_Lead, CreateContacts, DeleteContact, getContacts, getOneContact, updateContact } from "../Controllers/ContactsController.js";


// Middleware
const router = express.Router();

// Setting routes
router.post("/create",Validate,isAdminEmpManager,CreateContacts)
router.delete("/delete/:id",Validate,isAdminEmpManager,DeleteContact)
router.get("/",Validate,getContacts)
router.get("/:id",Validate,isAdminEmpManager,getOneContact)
router.put("/update/:id",Validate,isAdminEmpManager,updateContact)
router.put("/changeToLead/:id",Validate,isAdminEmpManager,Contact_to_Lead)

export default  router;