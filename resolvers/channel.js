import _ from 'lodash';
import {ValidationError} from 'sequelize';
import {requiresAuth} from '../permissions';
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
        allChannels : //requiresAuth.createResolver(

            async(parent, args, { models, user }) => models.channel.findAll({where:{
                admin: user.id
            }}, {raw:true}),

    //),
        },
    Mutation: {
        addChannelMember:requiresAuth.createResolver( async (parent, { email, channel_id }, { models, user }) => {
            try {
              const channelPromise = models.channel.findOne({ where: { id: channel_id } }, { raw: true });
              const userToAddPromise = models.user.findOne({ where: { email } }, { raw: true });
              const [channel, userToAdd] = await Promise.all([channelPromise, userToAddPromise]);
              if (channel.admin !== user.id) {
                return {
                  ok: false,
                  errors: [{ path: 'email', message: 'You need to be admin to add members to the team.' }],
                };
              }
              if (!userToAdd) {
                return {
                  ok: false,
                  errors: [{ path: 'email', message: 'Could not find user with this email' }],
                };
              }
              await models.member.create({ userId: userToAdd.id, channel_id });
              return {
                ok: true,
              };
            } catch (err) {
              console.log(err);
              return {
                ok: false,
                errors: formatErr(err, models),
              };
            }
          }),



        createChannel : requiresAuth.createResolver(async (parent, args, {models, user}) => {
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
        }),
    },


};