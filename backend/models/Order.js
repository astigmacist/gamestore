const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    order_items: { type: DataTypes.TEXT, allowNull: false }, // JSON string
    total_price: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING(30), defaultValue: 'completed' },
}, {
    tableName: 'orders',
    timestamps: true,
});

module.exports = Order;
