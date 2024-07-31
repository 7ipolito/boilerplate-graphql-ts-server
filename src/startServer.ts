import { ApolloServer } from 'apollo-server';
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
import connectRedis from 'connect-redis';
import { redis } from './redis';
import { User } from './entity/User';
import { Request, Response } from 'express';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

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

  const RedisStore = require("connect-redis").default;

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
      }) as any,
      name: 'qid',
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    } as SessionOptions)
  );

  const cors = {
    credentials: true,
    origin: 'http://localhost:3000',
  };

  app.get('/confirm/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = await redisClient.get(id);
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
    context: ({ req }: { req: Request }): MyContext => {
      return {
        redis,
        req,
        url: `${req.protocol}://${req.get('host')}`,
        session: req.session,
      };
    },
  });

  const { url } = await server.listen({ port: 4000, cors });
  console.info(`Server is running on ${url}`);
};