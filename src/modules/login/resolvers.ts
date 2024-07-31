import * as bcrypt from "bcryptjs"
import { IResolvers } from "@graphql-tools/utils";
import { User } from "../../entity/User";
import * as yup from "yup"
import { formatYupError } from "../../utils/formatYupError";
import { confirmEmailError, invalidLogin } from "./errorMessages";

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
  Mutation: {
    login: async (_: any, args: LoginArgs,
      {session}
      //  {redis,url}
      ): Promise<any> => {
        const {email, password} = args;
        const user = await User.findOne({where:{email}})

        if(!user){
          return errorResponse
        }

        // if(!user.confirmed){
        //   return [{
        //     path:"email",
        //     message: confirmEmailError

        //   }]
        // }

        const valid =  bcrypt.compare(password, String(user.password));
        if(!valid){
          return errorResponse
        }
         console.log(session)
       session.userId = user.id
        
      return session;
        

      }
  }}