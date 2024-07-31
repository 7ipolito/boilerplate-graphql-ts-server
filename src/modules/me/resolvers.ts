import * as bcrypt from "bcryptjs"
import { IResolvers } from "@graphql-tools/utils";
import { User } from "../../entity/User";
import * as yup from "yup"
import { formatYupError } from "../../utils/formatYupError";
import { createMiddleware } from "../../utils/createMiddleware";
import middleware from "./middleware";
import { invalidLogin } from "../login/errorMessages";

const errorResponse =[
  {
    path:"email",
    message:invalidLogin
  }
]

interface LoginArgs {
  email: string;
  password: string;
}

export const resolvers: IResolvers = {
  Query:{
    me: createMiddleware(middleware, (_,__,{session})=> User.findOne({where:{id:session.userId}}))      
      
  }
}