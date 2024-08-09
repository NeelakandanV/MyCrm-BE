// Importing neccessary components
import express from "express";
import { isAdminEmpManager, isAdminManager, isLead, Validate } from "../Utils/Auth.js";
import { CreateService_Request, DeleteService_Request, getOne_Service_Request, getService_Request, updateService_Request } from "../Controllers/ServicesController.js";


// Middleware
const router = express.Router();

// Setting routes
router.post("/create",Validate,isLead,CreateService_Request)
router.delete("/delete/:id",Validate,isAdminManager,DeleteService_Request)
router.get("/ServiceRequests",Validate,getService_Request)
router.get("/:id",Validate,isAdminEmpManager,getOne_Service_Request)
router.put("/update/:id",Validate,isAdminEmpManager,updateService_Request)

export default  router;