import ProductService from "../services/product-service";
import express, { Response, Request, NextFunction } from "express";
import userAuth from "./middleware/auth";

export const Product = (app: express.Application) => {
  const service = new ProductService();
  app.post(
    "/product/add",
    userAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {
          name,
          description,
          banner,
          type,
          unit,
          price,
          available,
          supplier,
        } = req.body;
        const data = await service.ProductCreate({
          name,
          description,
          banner,
          type,
          unit,
          price,
          available,
          supplier,
        });

        return res.status(201).json(data);
      } catch (error) {
        console.log(error);
      }
    }
  );
};
