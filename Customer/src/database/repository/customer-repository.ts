import { IOrder, Iproduct } from "../../services/customer-services.dto";
import { AddressModel, CustomerModel, IAddress, ICustomer } from "../models";

export class CustomerRepository {
  //ADD CUSTOMER
  async CreateCustomer(CustomerData: ICustomer) {
    try {
      const customer = new CustomerModel(CustomerData);
      const customerResult = await customer.save();

      return customerResult;
    } catch (error) {
      console.log(error);
    }
  }

  //FIND CUSTOMER BY EMAIL
  async FindCustomer({ email }: { email: string }) {
    const existingUser = await CustomerModel.findOne({ email });
    return existingUser;
  }

  //FIND CUSTOMER BY ID

  async FindCustomerById(id: string) {
    try {
      const existingCustomer = await CustomerModel.findById(id).populate(
        "address"
      );
      return existingCustomer;
    } catch (error) {
      console.log(error);
    }
  }

  //CART
  async GetCartItems(customerId: string) {
    try {
      const profile = (await CustomerModel.findById(customerId).populate(
        "cart"
      )) as ICustomer;
      return profile.cart;
    } catch (error) {
      console.log(error);
    }
  }

  //WISHLIST
  async WishList(customerId: string) {
    try {
      const profile = (await CustomerModel.findById(customerId).populate(
        "wishList"
      )) as ICustomer;
      return profile.wishList;
    } catch (error) {
      console.log(error);
    }
  }

  //AddWishList
  async AddWishListItem(customerId: string, product: Iproduct) {
    try {
      const profile = await CustomerModel.findById(customerId).populate(
        "wishList"
      );
      if (profile) {
        const wishList = profile.wishList;
        if (wishList.length > 0) {
          let isExist = false;
          wishList.map((item: any) => {
            if (item._id.toString() === product._id.toString()) {
              const index = wishList.indexOf(item);
              wishList.splice(index, 1);
              isExist = true;
            }
          });
          if (isExist) {
            wishList.push(product);
          }
        } else {
          wishList.push(product);
        }
        profile.wishList = wishList;
      }
      const profileResult = await profile?.save();

      return profileResult?.wishList;
    } catch (error) {
      console.log(error);
    }
  }

  //AddCartItem

  async AddCartItem(
    customerId: string,
    { _id, name, price, banner }: Iproduct,
    qty: number,
    isRemove: boolean
  ) {
    try {
      const profile = await CustomerModel.findById(customerId).populate("cart");
      if (profile) {
        const cartItem = {
          product: {
            _id,
            name,
            price,
            banner,
          },
          unit: qty,
        };

        let cartItems = profile.cart;
        if (cartItems.length > 0) {
          let isExist = false;

          cartItems.map((item: any) => {
            if (item.product._id.toString() === _id.toString()) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = qty;
              }
              isExist = true;
            }
          });

          if (!isExist) {
            cartItems.push(cartItem);
          }
        } else {
          cartItems.push(cartItem);
        }

        profile.cart = cartItems;

        const cartSaveResult = await profile.save();

        return cartSaveResult;
      }
      throw new Error("Unable to save to cart");
    } catch (error) {
      console.log(error);
    }
  }

  //ADD ORDER
  async AddOrderToProfile(customerId: string, order: IOrder) {
    try {
      const profile = await CustomerModel.findById(customerId);
      if (profile) {
        if (profile.orders === undefined) {
          profile.orders = [];
        }
        profile.orders.push(order);
        profile.cart = [];
        const profileResult = await profile.save();
        return profileResult;
      }
      throw new Error("Unable to add to order!");
    } catch (error) {
      console.log(error);
    }
  }

  //CREATE ADDRESS

  async CreateAddress(customerId: string, address: IAddress) {
    try {
      const profile = await CustomerModel.findById(customerId)

      if (profile) {
        const newAddress = new AddressModel(
          address
      );
         await newAddress.save();
        const profileAddress = profile.address;

        profileAddress.push(newAddress);
      };
     
      return await profile?.save();
   
    } catch (error) {
      console.log(error);
    }
  }
}
