import express from 'express';
import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-express'; 

import models from './models';
import {sequelize} from './models';
import {refreshTokens} from './auth';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const path= require('path');

const types=loadFilesSync(path.join(__dirname, './schema'));
const typeDefs= mergeTypeDefs(types);
const resolvers=mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers')));

const SECRET = 'asecetforjwt1234458b';
const SECRET2 = 'asecondseretforjwttokens125789bjhk';
const PORT = 8081;
const app = express();
 const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
app.use(cors('*'));
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context :async () => {
      return{models,
      user:{
        id:1,
      },
       SECRET,
       SECRET2,
      };
    },
});

  server.applyMiddleware({ app });
  //app.use(addUser);
 
sequelize.sync().then(()=>{
    console.log("im done");
    app.listen(8081);
});

//schema.applyMiddleware({app});
// bodyParser is needed just for POST.




