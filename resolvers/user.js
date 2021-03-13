import bcrypt from 'bcrypt';

export default{
    Query: {
        getUser : (parent, {id}, {models}) => models.user.findOne({where :{id} }),
        allUsers : (parent, args, { models }) => models.user.findAll(),

    },
    Mutation: {
        Register : async (parent,{password, ...otherArgs}, {models}) => {
            

            try{
                const hashedPassword = await bcrypt.hash(password, 10);
                await models.user.create({...otherArgs, password: hashedPassword});
                return true;
            } catch(err) {
                //console.log(err);
                return false;
            }
        } 
    },
    
};