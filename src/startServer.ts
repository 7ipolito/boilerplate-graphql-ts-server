import { ApolloServer } from 'apollo-server-express';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import path, { join } from 'node:path';
import { AppDataSource } from './data-source';
import * as fs from 'fs';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema';
import Redis from 'ioredis';
import express from 'express';
import session, { SessionOptions } from 'express-session';
import Redistore from 'connect-redis';
import { redis } from './redis';
import { User } from './entity/User';
import { Request, Response } from 'express';
import { redisSessionPrefix } from './constants';


const SESSION_SECRET = process.env.SESSION_SECRET || 'default_secret';

interface MyContext {
  req: Request;
  redis: Redis;
  session: session.Session;
  url: string;
}

export const startServer = async () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, './modules'));
  folders.forEach(folder => {
    const { resolvers } = require(`./modules/${folder}/resolvers`);

    const typeDefs = loadSchemaSync(join(__dirname, `./modules/${folder}/schema.graphql`), {
      loaders: [new GraphQLFileLoader()],
    });

    schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
  });

  const app = express();


  app.use(
    session({
      store: new Redistore({
        client: redis as any,
        prefix: redisSessionPrefix
      }),
      name: "qid",
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    } as any)
  );

  app.get('/confirm/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = await redis.get(id);
    if (userId) {
      await User.update({ id: userId }, { confirmed: true });
      res.send('ok');
    } else {
      res.send('invalid');
    }
  });

  await AppDataSource.initialize();

  const server = new ApolloServer({
    schema: mergeSchemas({ schemas }),
    
    context: ({ req }) => {
      return { redis, req,url: `${req.protocol}://${req.get('host')}`, session:req.session }
  }
    
  });
  

  

  await server.start();

  server.applyMiddleware({
    app,
    cors: {
      origin: 'https://studio.apollographql.com',
      credentials: true,
    },
  });

  app.listen(4000, () => {
    console.info(`Server is running on http://localhost:4000${server.graphqlPath}`);
  });
};