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
        cart:[]
      });
     if(customer){
      const token= GenerateSignature({ email,_id: customer._id});
      return formatData({customer,token});
     }
    } catch (error) {
      throw new Error(`${error}`);
      
    }
  };
  async Login(userInput:IuserLogin){
   try {
      const{email,password}=userInput
      const user = await this.repository.FindCustomer({ email});
   if (!user) {
      throw new Error("Customer does not exists");
    }
  const validPassword = await validatePassword(
   password,
   user.password,
   user.salt
  )
if(!validPassword) throw new Error("Invalid password")
const token= GenerateSignature({ email,_id:user._id});
return formatData({id:user._id,token});
   } catch (error) {
      throw new Error(`${error}`);
   }  
  }

  async ManageCart(customerId:string, product:any,qty:number,
    isRemove:boolean){
      const cartResult = await this.repository.AddCartItem(customerId,product,qty,isRemove);
      return cartResult;
    }

  async SubscriberEvents(payload:any){
    payload = JSON.parse(payload);

    const {event,data} = payload

    const {userId,product,qty}=data

    switch (event){
      case 'ADD_TO_CART':
        this.ManageCart(userId,product,qty,false);
        break;
      
        default:
          break;
    }
  }
}

export default CustomerService;