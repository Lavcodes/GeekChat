export default (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
      text: DataTypes.STRING,
    });
  
    Message.associate = (models) => {
        Message.belongsTo(models.channel, {
            foreignKey: 'channel_id',
          });

        Message.belongsTo(models.user, {
            foreignKey: 'user_id',
          });
    };

  
    return Message;
  };
  