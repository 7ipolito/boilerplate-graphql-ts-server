import * as bcrypt from "bcryptjs"
import { IResolvers } from "@graphql-tools/utils";
import { User } from "../../entity/User";
import * as yup from "yup"
import { formatYupError } from "../../utils/formatYupError";
import { confirmEmailError, invalidLogin } from "./errorMessages";
import { ResolverMap } from "../../types/graphql-utils";
import { redisSessionPrefix, userSessionIdPrefix } from "../../constants";
import { forgotPasswordLockAccount } from "../../utils/forgotPasswordLockAccount";

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

export const resolvers: ResolverMap = {
  Mutation: {
    login: async (
      _,
      { email, password }: LoginArgs,
      { session, redis , req}
    ) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return errorResponse;
      }
      

      // if (!user.confirmed) {
        // return [
        //   {
        //     path: "email",
        //     message: confirmEmailError
        //   }
        // ];
      // }

      if(user.forgotPasswordLocked){
        return [
          {
            path: "email",
            message: forgotPasswordLockAccount
          }
        ];
      }

      const valid = bcrypt.compare(password, String(user.password));

      if (!valid) {
        return errorResponse;
      }

      // login sucessful

      session.userId = user.id;
     
      await new Promise((resolve, reject) => {
        session.save(err => {
          if (err) {
            reject(err);
          } else {
            resolve(null);
          }
        });
      });

      if(req.sessionID){
        await redis.lpush(`${userSessionIdPrefix}${user.id}`, req.sessionID)
      }

      redis.get(`${redisSessionPrefix}${req.sessionID}`)


      console.log(session)

      return null;
    }
  }}