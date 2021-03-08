import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express'; 

import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';
import {sequelize} from './models';

export const schema = new ApolloServer({
    typeDefs,
    resolvers,
});


const PORT = 8081;
const app = express();
schema.applyMiddleware({app});
// bodyParser is needed just for POST.

sequelize.sync().then(()=>{
    console.log("done");
    app.listen(8081);
});

//app.listen(PORT);
