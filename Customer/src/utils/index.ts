import {hash,genSalt} from "bcryptjs"
import {verify,sign} from "jsonwebtoken"
import { APP_SECRET } from "../config"
export const GenerateSalt= async()=>{
    return await genSalt()
}

export const GneratePassword=(password:string,salt:string)=>{
   return hash(password, salt)
}

export const GenerateSignature = (payload:string|object|Buffer) =>{
    return sign(payload,APP_SECRET,{expiresIn:"1d"})

}

export const formatData =(data:any)=>{
    if(data){
        return data
    }
    throw new Error('Data not found');
}