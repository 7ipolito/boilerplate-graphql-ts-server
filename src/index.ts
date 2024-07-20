import { ApolloServer } from 'apollo-server';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { join } from 'node:path';
import { AppDataSource } from './data-source';
import { resolvers } from './resolvers';

export const startServer = async () => {
  const typeDefs = loadSchemaSync(join(__dirname, 'schema.graphql'), {
    loaders: [new GraphQLFileLoader()],
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await AppDataSource.initialize();

  const { url } = await server.listen({ port: 4000 });

  console.info(`Server is running on ${url}`);
}

startServer();