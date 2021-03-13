import bcrypt from 'bcrypt';
//import { _ } from 'core-js';
import _ from 'lodash';
import {ValidationError} from 'sequelize'

const formatErrors = (e, models) => {
    if(e instanceof ValidationError){
        return e.errors.map(x=> _.pick(x, ['path', 'message']));
    }
    
    return [{path :'name', message: 'Something unexpected went wrong.'}];
};

export default{
    Query: {
        getUser : (parent, {id}, {models}) => models.user.findOne({where :{id} }),
        allUsers : (parent, args, { models }) => models.user.findAll(),

    },
    Mutation: {
        Register : async (parent,{password, ...otherArgs}, {models}) => {
            

            try{
                if(password.length<8 || password.length>50 ){
                    return{
                        ok: false,
                        errors :[
                            {
                                path : 'password',
                                message : 'The password must be 8 to 50 characters long.',
                            },
                        ],
                    };
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                const user=await models.user.create({...otherArgs, password: hashedPassword});
                return {
                    ok : true, 
                    user,

                };
            } catch(err) {
                //console.log(err);
                return {
                    ok:false, 
                    errors : formatErrors(err, models),
                };
            }
        } 
    },
    
};