import { User } from "../../entity/User";
import { Resolver } from "../../types/graphql-utils";

export default async (resolver:Resolver, parent:any, args:any, context:any, info:any)=>{
    console.log(context.session)
  if(!context.session || !context.session.userId){
    throw Error("no cookie")
  }
    return resolver(parent,args,context,info)
}