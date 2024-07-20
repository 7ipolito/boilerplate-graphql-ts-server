import { ApolloServer } from 'apollo-server';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { join } from 'node:path';
import { AppDataSource } from './data-source';
import { resolvers } from './resolvers';

async function startServer() {
  // Carrega o schema GraphQL do arquivo
  const typeDefs = loadSchemaSync(join(__dirname, 'schema.graphql'), {
    loaders: [new GraphQLFileLoader()],
  });

  // Cria a instância do Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await AppDataSource.initialize();

  // Inicia o servidor Apollo
  const { url } = await server.listen({ port: 4000 });

  console.info(`Server is running on ${url}`);
}

startServer();