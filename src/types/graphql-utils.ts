import { Redis } from "ioredis";

export interface Session  {
  save(arg0: (err: any) => void): unknown;
  destroy(arg0: (err: any) => any): any;
  userId?: string;
}

export interface Context {
  redis: Redis;
  url:string;
  session:Session;
  req: Express.Request
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

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}