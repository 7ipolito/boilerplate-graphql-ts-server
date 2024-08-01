import { forgotPasswordPrefix, redisSessionPrefix, userSessionIdPrefix } from "../../constants";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { ResolverMap } from "../../types/graphql-utils";
import { createForgotPasswordLink } from "../../utils/createForgotPasswordLink";
import { forgotPasswordLockAccount } from "../../utils/forgotPasswordLockAccount";
import { formatYupError } from "../../utils/formatYupError";
import { removeAllUsersSessions } from "../../utils/removeAllusersSessions";
import { registerPasswordValidation } from "../../yupSchemas";
import { emailNotLongEnough, invalidEmail } from "../register/errorMessages";
import { expiredKeyError, userNotFoundError } from "./errorMessages";
import * as bcrypt from "bcryptjs";

import * as yup from 'yup';

const schema = yup.object().shape({
  newPassword:registerPasswordValidation
});

export const resolvers: ResolverMap = {
  
  Mutation:{
    sendForgotPasswordEmail:async (_, {email}:any, {redis}) => {
      const user = await User.findOne({where:{email}})
      if(!user){
        
        return [
          {
            path:"email",
            message:userNotFoundError
          }
        ]
      }
      await forgotPasswordLockAccount(String(user.id), redis);
      // @todo add front end url
      await createForgotPasswordLink("",String(user.id), redis)

      //@todo send email with url
      return true;
    },
    forgotPasswordChange: async (_, {newPassword, key}:any, ___)=>{

      const redisKey = `${forgotPasswordPrefix}${key}`

      const userId = await redis.get(redisKey);
      if(userId){
        return [{
          path: 'key',
          message: expiredKeyError

        }]
      }

      try {
        await schema.validate({newPassword},{abortEarly:false})

      } catch (error) {
        return formatYupError
      }

      const hashedPassword= await bcrypt.hash(newPassword, 10);

      const updatePromise = User.update({id: String(userId)},{
        forgotPasswordLocked:false,
        password: hashedPassword
      })
      const deleteKeyPromise = redis.del(redisKey)

      await Promise.all([updatePromise, deleteKeyPromise])


      return null;
    }



  
  }
}