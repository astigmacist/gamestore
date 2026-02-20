const express = require('express');
const { User, Game, Rating, CartItem, Order } = require('../models');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes require admin
router.use(authenticate, isAdmin);

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'role', 'createdAt'],
            order: [['createdAt', 'DESC']],
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Get all orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{ model: User, attributes: ['id', 'username', 'email'] }],
            order: [['createdAt', 'DESC']],
        });
        const parsed = orders.map(o => ({
            ...o.toJSON(),
            order_items: JSON.parse(o.order_items),
        }));
        res.json(parsed);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Get all carts
router.get('/carts', async (req, res) => {
    try {
        const carts = await CartItem.findAll({
            include: [
                { model: User, attributes: ['id', 'username', 'email'] },
                { model: Game, attributes: ['id', 'title', 'price', 'image_url'] },
            ],
            order: [['createdAt', 'DESC']],
        });
        res.json(carts);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Get all ratings
router.get('/ratings', async (req, res) => {
    try {
        const ratings = await Rating.findAll({
            include: [
                { model: User, attributes: ['id', 'username'] },
                { model: Game, attributes: ['id', 'title'] },
            ],
            order: [['createdAt', 'DESC']],
        });
        res.json(ratings);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Delete a rating (admin)
router.delete('/ratings/:id', async (req, res) => {
    try {
        const rating = await Rating.findByPk(req.params.id);
        if (!rating) return res.status(404).json({ error: 'Рейтинг не найден' });

        const gameId = rating.game_id;
        await rating.destroy();

        // Recalculate average
        const sequelize = require('../config/database');
        const result = await Rating.findAll({
            where: { game_id: gameId },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'avg'],
                [sequelize.fn('COUNT', sequelize.col('rating')), 'count'],
            ],
            raw: true,
        });
        const avg = parseFloat(result[0].avg) || 0;
        const count = parseInt(result[0].count) || 0;
        await Game.update(
            { avg_rating: Math.round(avg * 10) / 10, rating_count: count },
            { where: { id: gameId } }
        );

        res.json({ message: 'Рейтинг удалён' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const usersCount = await User.count();
        const gamesCount = await Game.count();
        const ordersCount = await Order.count();
        const ratingsCount = await Rating.count();
        res.json({ usersCount, gamesCount, ordersCount, ratingsCount });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
