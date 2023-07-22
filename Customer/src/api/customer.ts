import CustomerService from "../services/customer-service";
import express, { Response, Request, NextFunction } from "express";

export const Customer = (app: express.Application) => {
  const service = new CustomerService();
  app.post(
    "/signup",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password, phone } = req.body;
        const data = await service.SignUp({ email, password, phone });
        return res.status(201).json(data);
      } catch (error) {
        console.log(error);
        res.status(500).json({ Error: "Internal Server Error" });
      }
    }
  );

  app.post("/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const data = await service.Login({email, password});

      return res.status(200).json({message:"Login successful",data});
    } catch (error) {
      console.log(error);
      res.status(500).json({ Error: "Internal Server Error" });
    }
  });
};
