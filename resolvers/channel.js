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
        },
    Mutation: {
        addChannelMember:requiresAuth.createResolver( async (parent, { email, channel_id }, { models, user }) => {
            try {
              const channelPromise = models.channel.findOne({ where: { id: channel_id } }, { raw: true });
              const userToAddPromise = models.user.findOne({ where: { email } }, { raw: true });
              const [channel, userToAdd] = await Promise.all([channelPromise, userToAddPromise]);
              const member= await models.member.findOne({where:{channel_id:channel.id, userId: user.id }});
              console.log(member);
              if (!member.admin) {
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
              const response = await models.sequelize.transaction(async ()=>{
              //  if(user==null) console.log("prob");
                //console.log(user.id);
                const newchannel = await models.channel.create({...args});
                await models.member.create({channel_id: newchannel.id, userId: user.id, admin:true});
                return newchannel;
              });
                
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