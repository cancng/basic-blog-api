import dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import cors from 'cors';

import createSchema from './util/createSchema';
import { createContext, MyContext, prisma } from './types/MyContext';

(async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('ENV JWT_SECRET must be defined');
  }

  try {
    const initSchema = await createSchema();
    const apolloServer = new ApolloServer({
      schema: initSchema,
      context: (ctx: MyContext) => ({ ...createContext(ctx) }),
      formatError: (error: GraphQLError): GraphQLFormattedError => {
        if (error && error.extensions)
          error.extensions.code = 'GRAPHQL_VALIDATION_FAILED';
        return error;
      },
    });

    const app = express();
    app.use(cors());
    app.use(express.static('public'));
    apolloServer.applyMiddleware({ app });
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server up at port ${PORT} 🐤`);
    });
  } catch (error) {
    console.log('app init error ⚠️', error);
    throw error;
  }
})();
