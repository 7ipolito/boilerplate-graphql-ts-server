import { ResolverMap } from "../../types/graphql-utils";

export const resolvers: ResolverMap = {
  
  Mutation:{
    logout: (_, __, {session}) => 
      new Promise(res=>
      session.destroy((err: string) => {
      if(err){
        console.log('logour error', err)
      }
      res(true)
    })
    )

  
  }
}