const express = require('express');
const { Order, CartItem, Game } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get user orders
router.get('/', authenticate, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user.id },
            order: [['createdAt', 'DESC']],
        });
        const parsed = orders.map(o => ({
            ...o.toJSON(),
            order_items: JSON.parse(o.order_items),
        }));
        res.json(parsed);
    } catch (err) {
        console.error('Get orders error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Checkout — create order from cart
router.post('/checkout', authenticate, async (req, res) => {
    try {
        const cartItems = await CartItem.findAll({
            where: { user_id: req.user.id },
            include: [{ model: Game }],
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Корзина пуста' });
        }

        const orderItems = cartItems.map(ci => ({
            game_id: ci.game_id,
            title: ci.Game.title,
            price: ci.Game.price,
            quantity: ci.quantity,
            image_url: ci.Game.image_url,
        }));

        const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = await Order.create({
            user_id: req.user.id,
            order_items: JSON.stringify(orderItems),
            total_price: Math.round(totalPrice * 100) / 100,
        });

        // Clear cart
        await CartItem.destroy({ where: { user_id: req.user.id } });

        res.status(201).json({
            ...order.toJSON(),
            order_items: orderItems,
        });
    } catch (err) {
        console.error('Checkout error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
