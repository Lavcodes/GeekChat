export default (sequelize, DataTypes) => {
    const Channel = sequelize.define('channel', {
      channelname: {
        type: DataTypes.STRING,
        unique: true,
      },
    });
  
    Channel.associate = (models) => {
      Channel.belongsToMany(models.user, {
        through: 'member',
        foreignKey: 'channel_id',
      });
    };
  
    return Channel;
  };
  