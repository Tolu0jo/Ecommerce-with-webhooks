import { CustomerModel, ICustomer } from "../models";

export class CustomerRepository{
    async CreateCustomer(CustomerData:ICustomer){
        try {
           const customer= new CustomerModel(CustomerData)  
           const customerResult = await customer.save();

           return customerResult
        } catch (error) {
          console.log(error);  
        }
    }
    async FindCustomer({email}:{email:string}){
      const existingUser = await CustomerModel.findOne({email});
    return existingUser;
    }
}
