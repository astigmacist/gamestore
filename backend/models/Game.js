const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Game = sequelize.define('Game', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    genre: { type: DataTypes.STRING(50), allowNull: false },
    image_url: { type: DataTypes.STRING(500), allowNull: true },
    avg_rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    rating_count: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
    tableName: 'games',
    timestamps: true,
});

module.exports = Game;
