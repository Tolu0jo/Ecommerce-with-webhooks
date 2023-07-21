import { CustomerRepository } from "../database";
import { Iuser, IuserLogin } from "./customer-services.dto";
import { GenerateSalt, GeneratePassword,GenerateSignature, formatData, validatePassword} from "../utils";
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
      const userPassword = await GeneratePassword(password, salt);
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
  };
  async Login(userInput:IuserLogin){
   try {
      const{email,password}=userInput
      const user = await this.repository.FindCustomer({ email });
   if (!user) {
      throw new Error("Customer does not exists");
    }
  const validPassword = await validatePassword(
   password,
   user.password,
   user.salt
  )
if(!validPassword) throw new Error("Invalid password")
const token= GenerateSignature({ email});
return formatData({id:user._id,token});
   } catch (error) {
      throw new Error(`${error}`);
   }  
  }
}

export default CustomerService;