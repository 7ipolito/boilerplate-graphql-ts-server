import { hash } from "bcryptjs";
import { IResolvers } from "@graphql-tools/utils";
import { User } from "../../entity/User";
import * as yup from "yup"
import { formatYupError } from "../../utils/formatYupError";
import { duplicateEmail, emailNotLongEnough, invalidEmail, passwordNotLongEnough } from "./errorMessages";
import { createConfirmEmailLink } from "../../utils/createConfirmEmailLink";

const schema = yup.object().shape({
  email: yup.string().min(3, emailNotLongEnough).max(255).email(invalidEmail),
  password: yup.string().min(3, passwordNotLongEnough).max(255)
});
interface RegisterArgs {
  email: string;
  password: string;
}

export const resolvers: IResolvers = {
  Mutation: {
    register: async (_: any, args: RegisterArgs, {redis,url}): Promise<any> => {
      try {
        await schema.validate(args, {abortEarly:false})
      } catch (err:any) {
       return formatYupError(err)
      }
      const { email, password } = args;
      const userAlreadyExists = await User.findOne({where:{email}, select:["id"]})
      if(userAlreadyExists){
        return [
          {
            path: "email",
            message:duplicateEmail
          }
        ]
      }
      const hashedPassword = await hash(password, 10);
      const user:any = User.create({
        email,
        password: hashedPassword,
      });
      

      await user.save()

      const link = await createConfirmEmailLink(url, user.id, redis);

      return null;
    },
  },
};