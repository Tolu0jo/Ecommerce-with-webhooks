import { Iproduct } from "../../services/customer-services.dto";
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

    async AddCartItem(customerId:string,{_id,name,price,banner}:Iproduct,qty:number,isRemove:boolean){

        const profile = await CustomerModel.findById(customerId).populate("cart")
        if(profile){
          const cartItem ={
            product:{
              _id,name,price,banner
            },
            unit:qty
          };
          
          let cartItems = profile.cart;
          if(cartItems.length>0){
            let isExist = false;
            cartItems.map((item:any)=>{
              if(item.product._id.toString() === _id.toString()){
                if(isRemove){
                  cartItems.splice(cartItems.indexOf(item),1);
                }else{
                  item.unit = qty;
                }
                isExist = true;
              }
            });
          
            if(!isExist){
             
              cartItems.push(cartItem);
            }
          }
          else{
              cartItems.push(cartItem);
            }

            profile.cart=cartItems
           

            const cartSaveResult = await profile.save();

            return cartSaveResult
          }
          throw new Error ("Unable to save to cart")
        }
    }

