import {requiresAuth} from '../permissions';

export default{
    Message: {
        user: ({ user_id }, args, { models }) =>
          models.user.findOne({ where: { id: user_id } }, { raw: true }),
      },
    Query: {
        getMessage : (parent, {id}, {models}) => models.message.findOne({where :{id} }),
        allMessages :  requiresAuth.createResolver( async (parent, {channel_id}, { models }) => models.message.findAll({
            order: [['createdAt', 'ASC']],
            where:{channel_id}
        },
        {raw: true},
        )),
    },
    Mutation: {
        createMessage :requiresAuth.createResolver( async (parent, args, {models, user}) => {
            try{
                await models.message.create({
                   ...args,
                   user_id: user.id,
                });
                return true;
            } catch(err) {
                console.log(err);
                return false;
            }
        }),
    },
    
};