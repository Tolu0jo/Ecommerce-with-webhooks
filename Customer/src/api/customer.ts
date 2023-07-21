import CustomerService from "../services/customer-service";
import express,{Response,Request,NextFunction}from "express";

export const Customer=(app:express.Application)=>{
     const service = new CustomerService()
   app.post("/customer/signup",async(req:Request,res:Response,next:NextFunction)=>{
 
     try {
        const {email,password,phone}=req.body
        const data= await service.SignUp({email,password,phone})

        return res.status(201).json(data)
     } catch (error) {
        console.log(error)
     }
   

   })
}