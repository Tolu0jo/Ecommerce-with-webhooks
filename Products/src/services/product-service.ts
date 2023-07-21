import { ProductRepository } from "../database";
import { formatData} from "../utils";
import { IProductDto } from "./product-services.dto";
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
}

export default ProductService;