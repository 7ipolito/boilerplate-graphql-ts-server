import { hash } from "bcryptjs";
import { IResolvers } from "@graphql-tools/utils";
import { User } from "../../entity/User";

interface RegisterArgs {
  email: string;
  password: string;
}

export const resolvers: IResolvers = {
  Mutation: {
    register: async (_: any, args: RegisterArgs): Promise<any> => {
      const { email, password } = args;
      const userAlreadyExists = await User.findOne({where:{email}, select:["id"]})
      if(userAlreadyExists){
        return [
          {
            path: "email",
            message:"already taken"
          }
        ]
      }
      const hashedPassword = await hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword,
      });
      

      await user.save()

      return null;
    },
  },
};