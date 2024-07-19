

import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'
import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'

import { join } from 'node:path'
import { AppDataSource } from './data-source'

async function startServer() {

const typeDefs = loadSchemaSync(join(__dirname, 'schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
});
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};
const yoga = createYoga({
  schema: createSchema({typeDefs:typeDefs,resolvers})
})


await AppDataSource.initialize();

const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})

}

startServer();



