import { hash } from "bcryptjs";
import { User } from "./entity/User";
import { IResolvers } from "@graphql-tools/utils";

interface RegisterArgs {
  email: string;
  password: string;
}

export const resolvers: IResolvers = {
  Query:{
    users: async (): Promise<User[]> => {
      const user = await User.find()
      return user;
    },
  },
  Mutation: {
    register: async (_: any, args: RegisterArgs): Promise<boolean> => {
      const { email, password } = args;
      const hashedPassword = await hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword,
      });
      

      await user.save()

      return true;
    },
  },
};