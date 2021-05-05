import express from 'express';
import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-express'; 
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';


import formidable from 'formidable';
import models from './models';
import {sequelize} from './models';
import {refreshTokens} from './auth';



const path = require('path');
const http = require('http');

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

const addUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
      console.log(req.user);
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

//app.use(fileMiddleware);

app.use(addUser);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context :async ({req, connection}) => {
      if(req)
      return{models,
      // user:req.user,
      /*user:{
        id:req.user.id,
      },*/
     user:{
        id:1,
      },
       SECRET,
       SECRET2,
      };
      else if(connection)
        return {
          models,
        user:connection.user,
      /*user:{
        id:req.user.id,
      },*/
     /* user:{
        id:2,
      },*/
       SECRET,
       SECRET2,
        };
      
    },
    subscriptions: {
      path: '/subscriptions',
      onConnect: 
      (connectionParams, webSocket, context) => {
        console.log('client connected');
        
      },
      /**/

      onDisconnect: (webSocket, context) => {
        console.log('Client disconnected')
      },
    },
});
  const httpServer = http.createServer(app);

  

  server.applyMiddleware({ app });
 
  server.installSubscriptionHandlers(httpServer);
  //app.use(addUser);
 
sequelize.sync().then(()=>{
    console.log("im done");
    httpServer.listen(8081);
   //app.listen(8081);
});

//schema.applyMiddleware({app});
// bodyParser is needed just for POST.




