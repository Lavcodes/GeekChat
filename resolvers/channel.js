import _ from 'lodash';
import {ValidationError} from 'sequelize';
const formatErr = (e, models)=> {
    if(e instanceof ValidationError){
        return e.errors.map(x=> _.pick(x, ['path', 'message']));
    }
    //console.log(e.errors);
    return [{path :'name', message: 'Something unexpected went wrong.'}];
};

export default{
    Query: {
        getChannel : (parent, {id}, {models}) => models.channel.findOne({where :{id} }),
        allChannels : (parent, args, { models }) => models.channel.findAll(),

    },
    Mutation: {
        createChannel : async (parent, args, {models, user}) => {
            try{
                if(user==null) console.log("prob");
                //console.log(user.id);
                await models.channel.create({...args, admin: user.id});
                return {
                    ok:true,

                };
            } catch(err){
                console.log(err);
                return {
                    ok: false,
                    errors : formatErr(err, models),
                };
            }
        }
    },


};