import bcrypt from 'bcrypt';
//import { _ } from 'core-js';
import _ from 'lodash';
import {ValidationError} from 'sequelize';
import {tryLogin} from '../auth';
import { requiresAuth } from '../permissions';
const formatErr = (e, models)=> {
    if(e instanceof ValidationError){
        return e.errors.map(x=> _.pick(x, ['path', 'message']));
    }
    //console.log(e.errors);
    return [{path :'name', message: 'Something unexpected went wrong.'}];
};

export default{
    User:{
      channels:(parent, args, { models, user }) =>
      models.sequelize.query(
        'select * from channels as channel join members as member on channel.id = member.channel_id where member."userId" = ?',
        {
          replacements: [user.id],
          model: models.channel,
        },
      ),
    },

    Query: {
        getUser : (parent, args, { models, user }) =>
      models.user.findOne({ where: { id: user.id } }),
       
        allUsers : (parent, args, { models }) => models.user.findAll(),

        },

    Mutation: {
        Login : async (parent, {email, password}, {models,SECRET, SECRET2}) => {
            try {
               return tryLogin(email, password, models, SECRET, SECRET2);
            }catch{
                console.log(err);
            }

        },
        Register : async (parent,args, {models}) => {
            

            try{
                const user=await models.user.create(args);
                return {
                    ok : true, 
                    user,

                };
            } catch(err) {
                //console.log(err);
                return {
                    ok:false, 
                    errors : formatErr(err, models),
                };
            }
        } 
    },
    
};