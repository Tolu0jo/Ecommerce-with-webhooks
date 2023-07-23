import ProductService from "../services/product-service";
import express, { Response, Request, NextFunction } from "express";
import userAuth from "./middleware/auth";
import { PublishCustomerEvent } from "../utils";
export const Product = (app: express.Application) => {
  const service = new ProductService();
  app.post(
    "/add",
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
  app.put(
    "/cart",
    userAuth,
    async (req: Request | any, res: Response, next: NextFunction) => {
      const { _id } = req.user;

      const data = await service.GetProductPayload(
        _id,
        { productId: req.body._id, qty: req.body.qty },
        "ADD_TO_CART"
      );
      console.log(data)
      PublishCustomerEvent(JSON.stringify(data));
      res.status(200).json(data);
    }
  );
};
