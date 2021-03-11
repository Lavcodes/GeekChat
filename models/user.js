export default (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
    });
  
   User.associate = (models) => {
      User.belongsToMany(models.channel, {
        through: 'member',
        foreignKey: 'user_id',
      });
     User.belongsToMany(models.channel, {
        through :'channel_member',
        foreignKey :{
          name: 'user_id',
        } 
      });
      User.hasMany(models.channel);
    };
  
    return User;
  };
  