import { Redis } from "ioredis";


export interface Context {
  redis: Redis;
  url: string;
  session: any;
  req: Express.Request;
}
export type Resolver = (
  parent: any,
  args: any,
  context: Context,
  info: any
) => any;

export type GraphQLMiddlewareFunc = (
  resolver: Resolver,
  parent: any,
  args: any,
  context: Context,
  info: any
) => any;
export const createMiddleware = (middlewareFunc:GraphQLMiddlewareFunc, resolverFunc: Resolver)=>(
  parent: any, 
  args: any, 
  context: any,
  info: any
)=>middlewareFunc(resolverFunc, parent, args, context, info)