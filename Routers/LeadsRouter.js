// Importing neccessary components
import express from "express";
import { Leads_ForgotPassword, Leads_PasswordReset, LoginLead } from "../Controllers/verifyController.js";
import { isAdminEmpManager, isAdminManager, Validate } from "../Utils/Auth.js";
import { CreateLeads, DeleteLead, getLeads, getOneLead, updateLead } from "../Controllers/LeadsController.js";


// Middleware
const router = express.Router();

// Setting routes
router.post("/",LoginLead)
router.put("/ForgotPassword",Leads_ForgotPassword)
router.put("/ResetPassword/:id/:pin/:token",Leads_PasswordReset)

router.post("/create",Validate,isAdminEmpManager,CreateLeads)
router.delete("/delete/:id",Validate,isAdminManager,DeleteLead)
router.get("/LeadData",Validate,getLeads)
router.get("/:id",Validate,isAdminEmpManager,getOneLead)
router.put("/update/:id",Validate,isAdminEmpManager,updateLead)

export default  router;