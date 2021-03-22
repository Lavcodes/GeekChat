import { PubSub, withFilter } from 'graphql-subscriptions';
import {requiresAuth} from '../permissions';

const pubsub = new PubSub();

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';



export default{

    Subscription: {
        newChannelMessage: {
          subscribe: withFilter(
            () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
            (payload, args) => payload.channel_id === args.channel_id,
          ),
        },
      },

    Message: {
        user: async ({ user, user_id }, args, { models}) =>{
            
            const writer= await models.user.findOne({ where: { id: user_id } });
            if(!writer) console.log('gadbad');
            return writer;
        },
        
      },
    
    Query: {
        getMessage : (parent, {id}, {models}) => models.message.findOne({where :{id} }),
        allMessages :  requiresAuth.createResolver( async (parent, {channel_id}, { models, user }) => models.message.findAll({
            order: [['createdAt', 'ASC']],
            where:{channel_id}
        },
        {raw: true},
        )),
    },
    Mutation: {
        createMessage :requiresAuth.createResolver( async (parent, args, {models, user}) => {
            try{
                const Newmessage = await models.message.create({
                   ...args,
                   user_id: user.id,
                });

                const asyncFunc = async () => {
                    const currentUser = await models.user.findOne({
                      where: {
                        id: user.id,
                      },
                    });
                    console.log(currentUser.dataValues);
          
                    pubsub.publish(NEW_CHANNEL_MESSAGE, {
                      channel_id: args.channel_id,
                      newChannelMessage: {
                        ...Newmessage.dataValues,
                        user: currentUser.dataValues,
                      },
                    });
                };

                asyncFunc();

                return true;

            } catch(err) {
                console.log(err);
                return false;
            }
        }),
    },
    
};