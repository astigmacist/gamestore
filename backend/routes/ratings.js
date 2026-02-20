const express = require('express');
const { Rating, Game } = require('../models');
const { authenticate } = require('../middleware/auth');
const sequelize = require('../config/database');

const router = express.Router();

// Get ratings for a game
router.get('/game/:gameId', async (req, res) => {
    try {
        const ratings = await Rating.findAll({
            where: { game_id: req.params.gameId },
            include: [{ model: require('../models/User'), attributes: ['id', 'username'] }],
        });
        res.json(ratings);
    } catch (err) {
        console.error('Get ratings error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Get user rating for a game
router.get('/user/:gameId', authenticate, async (req, res) => {
    try {
        const rating = await Rating.findOne({
            where: { user_id: req.user.id, game_id: req.params.gameId }
        });
        res.json(rating || { rating: 0 });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Rate a game (create or update)
router.post('/', authenticate, async (req, res) => {
    try {
        const { game_id, rating } = req.body;
        if (!game_id || !rating) {
            return res.status(400).json({ error: 'game_id и rating обязательны' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Рейтинг должен быть от 1 до 5' });
        }

        const game = await Game.findByPk(game_id);
        if (!game) return res.status(404).json({ error: 'Игра не найдена' });

        const [ratingRecord, created] = await Rating.findOrCreate({
            where: { user_id: req.user.id, game_id },
            defaults: { rating }
        });

        if (!created) {
            ratingRecord.rating = rating;
            await ratingRecord.save();
        }

        // Recalculate average
        const result = await Rating.findAll({
            where: { game_id },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'avg'],
                [sequelize.fn('COUNT', sequelize.col('rating')), 'count'],
            ],
            raw: true,
        });

        const avg = parseFloat(result[0].avg) || 0;
        const count = parseInt(result[0].count) || 0;
        await game.update({ avg_rating: Math.round(avg * 10) / 10, rating_count: count });

        res.json({
            rating: ratingRecord,
            avg_rating: Math.round(avg * 10) / 10,
            rating_count: count,
        });
    } catch (err) {
        console.error('Rate game error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
