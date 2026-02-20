const User = require('./User');
const Game = require('./Game');
const Rating = require('./Rating');
const CartItem = require('./CartItem');
const Order = require('./Order');

// Associations
User.hasMany(Rating, { foreignKey: 'user_id' });
Rating.belongsTo(User, { foreignKey: 'user_id' });

Game.hasMany(Rating, { foreignKey: 'game_id' });
Rating.belongsTo(Game, { foreignKey: 'game_id' });

User.hasMany(CartItem, { foreignKey: 'user_id' });
CartItem.belongsTo(User, { foreignKey: 'user_id' });

Game.hasMany(CartItem, { foreignKey: 'game_id' });
CartItem.belongsTo(Game, { foreignKey: 'game_id' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { User, Game, Rating, CartItem, Order };
