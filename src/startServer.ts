import { ApolloServer } from 'apollo-server';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import path, { join } from 'node:path';
import { AppDataSource } from './data-source';
import * as fs from 'fs';
import { GraphQLSchema, printSchema } from 'graphql';
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema';
import Redis from 'ioredis';
import express from "express"
import { User } from './entity/User';
import { request } from 'node:http';
import { redis } from './redis';
import {Response, Request} from "express"

interface MyContext {
  req: Request;
  res: Response;
  redis: any;
  url: string;
}

export const startServer = async () => {
  const schemas:GraphQLSchema[] =[];
  const folders = fs.readdirSync(path.join(__dirname, './modules'))
  folders.forEach((folder=>{
    const {resolvers}= require(`./modules/${folder}/resolvers`)
    
    const typeDefs = loadSchemaSync(join(__dirname, `./modules/${folder}/schema.graphql`), {
      loaders: [new GraphQLFileLoader()],
    });

    schemas.push(makeExecutableSchema({resolvers, typeDefs}))


  }))

  
  const app = express();

  const server = new ApolloServer({
    schema: mergeSchemas({ schemas }),
    context: ({ req, res }: { req: Request, res: Response }): MyContext => {
      return {
        req,
        res,
        redis,
        url: `${req.protocol}://${req.get('host')}`
      };
    }
  });
  

  app.get("/confirm/:id", async (req:any, res:any)=>{
    const {id} = req.params;
    const userId:any = await redis.get(id)
    if(userId){
      await User.update({id:userId},{confirmed:true})
      res.send("ok")
    }else{
      res.send("invalid")
    }
    
  })

  await AppDataSource.initialize();

  const { url } = await server.listen({ port: 4000 });
  console.info(`Server is running on ${url}`);
}
