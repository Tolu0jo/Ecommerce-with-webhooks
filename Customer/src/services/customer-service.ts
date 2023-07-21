import { CustomerRepository } from "../database";
import { Iuser } from "./customer-services.dto";
import { GenerateSalt, GneratePassword,GenerateSignature, formatData} from "../utils";
class CustomerService {
  repository;
  constructor() {
    this.repository = new CustomerRepository();
  }
  async SignUp(userInput: Iuser) {
    try {
      const { email, password, phone } = userInput;
      const existingUser = await this.repository.FindCustomer({ email });
      if (existingUser) {
        throw new Error("Customer already exists");
      }

      const salt = await GenerateSalt();
      const userPassword = await GneratePassword(password, salt);
      const customer = await this.repository.CreateCustomer({
        email,
        password: userPassword,
        phone,
        salt,
      });
   
      const token= GenerateSignature({ email});
      return formatData({customer,token});
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

export default CustomerService;