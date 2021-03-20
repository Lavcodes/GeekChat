import {Sequelize, DataTypes} from 'sequelize';
import User from './user';
import Message from './message';
import Channel from './channel';
import Member from './member';

const sequelize = new Sequelize('geekchat', 'postgres', 'postgres', {
    dialect: 'postgres',
    operatorsAliases: 0,
    logging: 0
  });
  
  
const models ={
  
  user : User(sequelize, Sequelize),
  message: Message(sequelize, Sequelize),
  channel : Channel(sequelize, Sequelize),
  member : Member(sequelize, Sequelize),
 // Message : require('./message'),

};
/*models.user.belongsToMany(models.channel, {
  through: models.message,
  foreignKey: 'userId',
});*/
Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});


  
  models.sequelize = sequelize;
  models.Sequelize = Sequelize;
export {sequelize};
export default models;