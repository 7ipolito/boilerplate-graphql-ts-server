import { ApolloServer } from 'apollo-server';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import path, { join } from 'node:path';
import { AppDataSource } from './data-source';
import * as fs from 'fs';
import { GraphQLSchema, printSchema } from 'graphql';
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema';

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
  
  const server = new ApolloServer({
    schema:mergeSchemas({schemas})
  });

  await AppDataSource.initialize();

  const { url } = await server.listen({ port: 4000 });
  console.info(`Server is running on ${url}`);
}

startServer();