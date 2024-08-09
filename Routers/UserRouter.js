// Importing neccessary components
import express from "express";
import { checkAuth, Dashboard, ForgotPassword, LoginUser, Logout, PasswordReset, verifyUser, VerifyUserLink } from "../Controllers/verifyController.js";
import { isAdmin, isAdminManager, Validate } from "../Utils/Auth.js";
import { CreateManager, CreateUser, DeleteManager, DeleteUser, getManagers, getOneManager, getOneUser, getUsers, updateManager, updateUser } from "../Controllers/UserController.js";


// Middleware
const router = express.Router();

// Setting routes - General
router.post("/",LoginUser)
router.put("/verifyUser",VerifyUserLink)
router.get("/verifyUser/:id/:pin/:token",verifyUser)
router.put("/ForgotPassword",ForgotPassword)
router.put("/ResetPassword/:id/:pin/:token",PasswordReset)
router.get("/Logout",Logout)

router.get("/Dashboard",Validate,Dashboard)

//For Employee ,Manager and Admin
router.post("/users/Create",Validate,isAdminManager,CreateUser)
router.delete("/users/delete/:id",Validate,isAdminManager,DeleteUser)
router.get("/users",Validate,getUsers)
router.get("/users/:id",Validate,isAdminManager,getOneUser)
router.put("/users/update/:id",Validate,isAdminManager,updateUser)

router.post("/manager/Create",Validate,isAdmin,CreateManager)
router.delete("/manager/delete/:id",Validate,isAdmin,DeleteManager)
router.get("/manager",Validate,isAdmin,getManagers)
router.get("/manager/:id",Validate,isAdmin,getOneManager)
router.put("/manager/update/:id",Validate,isAdmin,updateManager)


// For Frontend
router.get("/ValidCheck",checkAuth)

export default  router;