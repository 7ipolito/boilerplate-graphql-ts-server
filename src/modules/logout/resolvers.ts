import { redisSessionPrefix, userSessionIdPrefix } from "../../constants";
import { redis } from "../../redis";
import { ResolverMap } from "../../types/graphql-utils";
import { removeAllUsersSessions } from "../../utils/removeAllusersSessions";

export const resolvers: ResolverMap = {
  
  Mutation:{
    logout:async (_, __, {session}) => {
      const {userId} = session;
      if(userId){
        removeAllUsersSessions(userId, redis)
        return true;    

      }

      return false
    }



  
  }
}