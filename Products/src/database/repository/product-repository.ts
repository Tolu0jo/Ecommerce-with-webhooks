import { ProductModel, IProduct } from "../models";

export class ProductRepository{
    async CreateProduct(ProductData:IProduct){
        try {
           const Product= new ProductModel(ProductData)  
           const productResult = await Product.save();

           return productResult
        } catch (error) {
          console.log(error);  
        }
    }
    // async FindProduct({email}:{email:string}){
    //   const existingUser = await ProductModel.findOne({email});
    // return existingUser;
    // }
}
