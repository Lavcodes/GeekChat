export default{
    Query: {
        getUser : (parent, {id}, {models}) => models.user.findOne({where :{id} }),
        allUsers : (parent, args, { models }) => models.user.findAll(),

    },
    Mutation: {
        createUser : async (parent, args, {models}) => {
            try{
                await models.user.create(args);
                return true;
            } catch(err) {
                console.log(err);
                return false;
            }
        } 
    },
    
};