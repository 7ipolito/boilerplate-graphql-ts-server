import * as bcrypt from "bcryptjs"
import { IResolvers } from "@graphql-tools/utils";
import { User } from "../../entity/User";
import * as yup from "yup"
import { formatYupError } from "../../utils/formatYupError";
import { confirmEmailError, invalidLogin } from "./errorMessages";
import { ResolverMap } from "../../types/graphql-utils";

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
      { session }
    ) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return errorResponse;
      }

      // if (!user.confirmed) {
      //   return [
      //     {
      //       path: "email",
      //       message: confirmEmailError
      //     }
      //   ];
      // }

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


      console.log(session)

      return null;
    }
  }}