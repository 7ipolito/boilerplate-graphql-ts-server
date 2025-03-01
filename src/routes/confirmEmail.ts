import {Request, Response} from "express";
import { User } from "../entity/User";
import { redis } from "../redis";

export const confirmEmail = async (req:Request, res:Response)=>{
  const {id} = req.params;
  const userId:any = await redis.get(id)
  if(userId){
    await User.update({id:userId},{confirmed:true})
    res.send("ok")
  }else{
    res.send("invalid")
  }
  
}