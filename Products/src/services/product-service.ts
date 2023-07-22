import { ProductRepository } from "../database";
import { formatData} from "../utils";
import { IProductDto, ProductPayload } from "./product-services.dto";
class ProductService {
  repository;
  constructor() {
    this.repository = new ProductRepository();
  }
  async ProductCreate(productInput: IProductDto) {
    try {
      const {  
        name,
        description,
        banner,
        type,
        unit,
        price,
        available,
        supplier} = productInput;
      

      const Product = await this.repository.CreateProduct({
        name,
        description,
        banner,
        type,
        unit,
        price,
        available,
        supplier
      });

      return formatData({Product});
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async GetProductPayload(userId: string,{productId,qty}:ProductPayload,event:string){
 try {
  const product = await this.repository.FindById({id:productId});
    if(product){
      const payload={
        event,
        data:{userId,product,qty}
      }
      return formatData(payload)
    }

 } catch (error) {
  throw new Error("Product not found")
 }
  }
}

export default ProductService;