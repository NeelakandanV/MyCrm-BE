// Importing dependencies
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import DBconnect from "./Utils/dbconfig.js";
import UserRouter from "./Routers/UserRouter.js";
import LeadsRouter from "./Routers/LeadsRouter.js";
import ContactsRouter from "./Routers/ContactsRouter.js";
import ServicesRouter from "./Routers/ServicesRouter.js";
import requestLogger from "./Utils/logger.js";
import cookieParser from "cookie-parser";
import unknownEndpoint from "./Utils/Error.js";



//Applying Middelewares
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(requestLogger)
app.use(cookieParser());

// Connecting to Database
DBconnect();
app.use("/",UserRouter);
app.use("/Lead",LeadsRouter);
app.use("/Contacts",ContactsRouter);
app.use("/Services",ServicesRouter);
app.all("*",unknownEndpoint)


//Port Setup
const Port = process.env.PORT || 9000;
app.listen(Port,()=>console.log(`App is listening on ${Port}`))