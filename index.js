import express from 'express';
import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-express'; 

import models from './models';
import {sequelize} from './models';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import cors from 'cors';
const path= require('path');

const types=loadFilesSync(path.join(__dirname, './schema'));
const typeDefs= mergeTypeDefs(types);
const resolvers=mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers')));

 const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

const PORT = 8081;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context :{models}
});
  
  server.applyMiddleware({ app });

  app.use(cors('*'));

  app.use((req, res) => {
    res.status(200);
    //res.send('Hello!');
    res.end();
  });
  
sequelize.sync().then(()=>{
    console.log("im done");
    app.listen(8081);
});

//schema.applyMiddleware({app});
// bodyParser is needed just for POST.




