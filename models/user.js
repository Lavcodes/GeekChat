import bcrypt from 'bcrypt'

export default (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
      username: {
        type: DataTypes.STRING,
        unique: true,
        validate:{
          isAlphanumeric : {
            args: true,
            msg: "The username can only contain alphabets or numbers.",
          },
          len:{
            args:[5, 25],
            msg:"The username has to be greater than 5 and lower than 25 characters.",
          },

        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate:{
          isEmail :{
            args: true,
            msg:"The field must be a valid Email id.",
          },
        },
      },
      password: {
        type : DataTypes.STRING,
        validate : {
          len : {
            args : [8, 50],
            msg : 'The password must be 8 to 50 characters long.',
          }
 
        }, 
      }
    },
    {
      hooks : {
        afterValidate : async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
          
        }
      }
    }
    );
  
   User.associate = (models) => {
      User.belongsToMany(models.channel, {
        through: models.member,
        foreignKey: 'user_id',
      });
      User.hasMany(models.channel);
    };
  
    return User;
  };
  