export default{
    Query: {
        getMessage : (parent, {id}, {models}) => models.message.findOne({where :{id} }),
        allMessages : (parent, args, { models }) => models.message.findAll(),

    },
    Mutation: {
        createMessage : async (parent, args, {models}) => {
            try{
                await models.message.create(args);
                return true;
            } catch(err) {
                console.log(err);
                return false;
            }
        } 
    },
    
};