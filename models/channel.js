export default (sequelize, DataTypes) => {
    const Channel = sequelize.define('channel', {
      channelname: {
        type: DataTypes.STRING,
        unique: true,
      },
    });
  
    Channel.associate = (models) => {
      Channel.belongsToMany(models.user, {
        through: models.member,
        foreignKey: 'channel_id',
      });
      Channel.belongsTo(models.user, {
        foreignKey: 'admin',
      });
    
  };
  
    return Channel;
  };
  
