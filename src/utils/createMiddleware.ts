import { Redis } from "ioredis";
import { GraphQLMiddlewareFunc, Resolver } from "../types/graphql-utils";


export const createMiddleware = (
  middlewareFunc: GraphQLMiddlewareFunc,
  resolverFunc: Resolver
) => (parent: any, args: any, context: any, info: any) =>
  middlewareFunc(resolverFunc, parent, args, context, info);