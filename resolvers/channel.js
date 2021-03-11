export default{
    Query: {
        getChannel : (parent, {id}, {models}) => models.channel.findOne({where :{id} }),
        allChannels : (parent, args, { models }) => models.channel.findAll(),

    },
    Mutation: {
        createChannel : async (parent, args, {models}) => {
            try{
                await models.channel.create(args);
                return true;
            } catch(err){
                console.log(err);
                return false;
            }
        }
    },


};