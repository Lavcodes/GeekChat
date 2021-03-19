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


app.use(addUser);


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context :async ({req}) => {
      return{models,
     // user:req.user,
     user:{
       id:18,
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




