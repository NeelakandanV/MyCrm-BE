# MyCrm - A CRM App

## This documentaion provides details about the Creating,updating and fetching  datas of Employees,Leads,Contacts and Services, implemented using Node.js and Express with tokenized requests and role based validations.

# URL - [Website Url](https://mycrm-d2t8.onrender.com)

## Features :-

***bcryptjs*** - For Password hashing,your data is safe and secure.<br/>
***JWT*** - For tokenized requests and role based authorizations in our website.<br/>
***Nodemailer*** - For sending mails for verification and Password Resets.</br>

## Note: Since I'm deployed the apis in render's free tier, The initial request is taking time, Please wait little longer for initial request

# API Endpoints:-
## Basics:-

## Login - Users
### https://mycrm-d2t8.onrender.com/  - POST method <br/>
Description : This method requires users Email and Password to validate.Only Validated Users are allowed to sign in.

## Dashoard - Users
### https://mycrm-d2t8.onrender.com/Dashboard  - Get method<br/>
Description : This method will fetch total counts of contacts, Leads and Services Created to display in frontend.

## Login - Leads
### https://mycrm-d2t8.onrender.com/Lead/   - POST method <br/>
Description : This method requires Leads Email and Password to validate.Only Validated Leads are allowed to sign in.

## Verification Link - Users
### https://mycrm-d2t8.onrender.com/verifyUser    - Put method <br/>
Description : This method requires users Email to validate and send mail for verification to that User.Link sent will have **JWT** which is  valid for only 5 minutes.

## User Verification - Users
### https://mycrm-d2t8.onrender.com/verifyUser/:id/:pin/:token   - Get method <br/>
Description : This method will verify the Users and Grant them access.Only verified users are allowed to modify datas in Leads,Contacts and users.Other users can only be able to view the datas.<br/>
**(id - User Id , pin - Randomly generated String , token - JWT)**

## Forgot Password Link - Users
### https://mycrm-d2t8.onrender.com/ForgotPassword  - Put method <br/>
Description : This method verify the users with their Email.If the users exists,It will send the reset password Link to their Email.Link sent will have **JWT** which is  valid for only 5 minutes.

## Forgot Password Link - Leads
### https://mycrm-d2t8.onrender.com/Lead/ForgotPassword     - Put method<br/>
Description : This method verify the leads with their Email.If the leads exists,It will send the reset password Link to their Email.Link sent will have **JWT** which is  valid for only 5 minutes.

## Reset Password - Users
### https://mycrm-d2t8.onrender.com/ResetPassword/:id/:pin/:token   - Put method<br/>
Description : This method validate the Reset link and let the users to set or reset their Passwords.<br/>
**(id - User Id , pin - Randomly generated String , token - JWT)**

## Reset Password - Leads
### https://mycrm-d2t8.onrender.com/Lead/ResetPassword/:id/:pin/:token   - Put method<br/>
Description : This method validate the Reset link and let the leads to set or reset their Passwords.<br/>
**(id - User Id , pin - Randomly generated String , token - JWT)**

## Logout - Usesr and Leads
### https://mycrm-d2t8.onrender.com/Logout   - Get method<br/>
Description - This method will delete the token and logout the users.

## AuthCheck  - Users and Leads
### https://mycrm-d2t8.onrender.com/ValidCheck  - Get method<br/>
Description - This method check whether the token is present or not(For Frontend)


## Users - ***Employees***
### Only Manager and Admin with access can modify Employees data.Users without access can only able to view data.

## Create Employee  
### https://mycrm-d2t8.onrender.com/users/Create   - Post method<br/>
Description : This method will create new users.

## Delete Employee  
### https://mycrm-d2t8.onrender.com/users/delete/:id   - Delete method</br>
Description : This method only delete the users not holding any important data.<br/>
**(id - User Email)**

## List of Employees
### https://mycrm-d2t8.onrender.com/users   - Get method<br/>
Description - This method will fetch details of all Employees.

## Details of Particular Employee 
### https://mycrm-d2t8.onrender.com/users/:id  - Get method<br/>
Description - This method will fetch complete details of a Particular employee with Leads, Services and Contacts Created.</br>
**(id - User Id)**

## Update Employee Details.
### https://mycrm-d2t8.onrender.com/users/update/:id  - Put method<br/>
Description - This method will update the details of an employee<br/>
**(id - User Id)**

## Users - ***Manager****
### Only  Admin with access can modify Manager data.

## Create Manager
### https://mycrm-d2t8.onrender.com/manager/Create  - Post method<br/>
Description : This method will create new users.

## Delete Manager 
### https://mycrm-d2t8.onrender.com/manager/delete/:id  - Delete method<br/>
Description : This method only delete the managers not holding any important data.<br/>
**(id - Manager Email)**

## List of Managers
### https://mycrm-d2t8.onrender.com/manager   - Get method<br/>
Description - This method will fetch details of all managers.

## Details of Particular Manager
### https://mycrm-d2t8.onrender.com/manager/:id   - Get method<br/>
Description - This method will fetch complete details of a Particular manager with Leads, Services and Contacts Created.</br>
**(id - Manager Id)**

## Update Manager Details.
### https://mycrm-d2t8.onrender.com/manager/update/:id  -Put method<br/>
Description - This method will update the details of an manager<br/>
**(id - Manager Id)**


## ***Leads***
## Only Admin , Manager and Employees with access can modify Leads data.Other can only be able to view it.

## Create Lead
### https://mycrm-d2t8.onrender.com/Lead/create   - Post method<br/>
Description : This method will create new leads.

## Delete Lead
### https://mycrm-d2t8.onrender.com/Lead/delete/:id   - Delete method<br/>
Description : This method  delete the lead.<br/>
**(id - Lead Email)**

## List of Leads
### https://mycrm-d2t8.onrender.com/Lead/LeadData   - Get method<br/>
Description - This method will fetch details of all leads.

## Details of Particular Lead
### https://mycrm-d2t8.onrender.com/Lead/:id   - Get method <br/>
Description - This method will fetch complete details of a Particular Leads with  Services Requests Created and Employee who created that lead.</br>
**(id - Lead Id)**

## Update Lead Status
### https://mycrm-d2t8.onrender.com/Lead/update/:id   - Put method<br/>
Description - This method will update the status of a Lead<br/>
**(id - Lead Id)**

## ***Service Requests***
## Only ***Leads*** can create Service Requests.
## Only Admin , Manager and Employees with access can modify Service Request .Other can only be able to view it.

## Create Service Requests
### https://mycrm-d2t8.onrender.com/Services/create  - Post method<br/>
Description : This method will create new service requests.

## Delete Service Request  
### https://mycrm-d2t8.onrender.com/Services/delete/:id    - Delete method <br/>
Description : This method  delete the Service Request.<br/>
**(id - Service Request Id)**

## List of Service Requests.
### https://mycrm-d2t8.onrender.com/Services/ServiceRequests   - Get method<br/>
Description - This method will fetch details of all service requests.

## Details  of Particular service Request.
### https://mycrm-d2t8.onrender.com/Services/:id   - Get method<br/>
Description - This method will fetch complete details of a Particular Service Request with  details of Employee assigned and lead who created that request.</br>
**(id - Service Request Id)*

## Update Service Request Status
### https://mycrm-d2t8.onrender.com/Services/update/:id  - Put method <br/>
Description - This method will update the status of a Service Request<br/>
**(id - Service Request Id)**

## ***Contacts***
## Only Admin , Manager and Employees with access can modify Contacts.Other can only be able to view it.

## Create Contact
### https://mycrm-d2t8.onrender.com/Contacts/create   - Post method<br/>
Description : This method will create new contacts.

## Delete Contact
### https://mycrm-d2t8.onrender.com/Contacts/delete/:id  - Delete method<br/>
Description : This method  delete the Contact.<br/>
**(id - Contact Email)**

## List of Contacts
### https://mycrm-d2t8.onrender.com/Contacts  - Get method<br/>
Description - This method will fetch details of all contacts.

## Details of Particular Contact 
### https://mycrm-d2t8.onrender.com/Contacts/:id   - Get method
Description - This method will fetch complete details of a Particular Contact.</br>
**(id - Contact Id)**

## Update Contact Details
### https://mycrm-d2t8.onrender.com/Contacts/update/:id  - Put method <br/>
Description : This method will update the details of a contact.<br/>
**(id - Contact Id)**

## Convert Contact as Lead.
### https://mycrm-d2t8.onrender.com/Contacts/changeToLead/:id   - Put method<br/>
description : This method will delete the contact as contact and create them as lead.<br/>
**(id - Contact Email)**
