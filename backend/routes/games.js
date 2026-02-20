const express = require('express');
const { Op } = require('sequelize');
const { Game, Rating } = require('../models');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all games with filters, search, pagination
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 12, genre, search, sort } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const where = {};

        if (genre && genre !== 'all') {
            where.genre = genre;
        }
        if (search) {
            where.title = { [Op.like]: `%${search}%` };
        }

        let order = [['createdAt', 'DESC']];
        if (sort === 'price_asc') order = [['price', 'ASC']];
        if (sort === 'price_desc') order = [['price', 'DESC']];
        if (sort === 'rating') order = [['avg_rating', 'DESC']];
        if (sort === 'title') order = [['title', 'ASC']];

        const { rows: games, count: total } = await Game.findAndCountAll({
            where,
            order,
            limit: parseInt(limit),
            offset,
        });

        res.json({
            games,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
        });
    } catch (err) {
        console.error('Get games error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Get all genres
router.get('/genres', async (req, res) => {
    try {
        const games = await Game.findAll({ attributes: ['genre'], group: ['genre'] });
        const genres = games.map(g => g.genre);
        res.json(genres);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Get single game
router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) return res.status(404).json({ error: 'Игра не найдена' });
        res.json(game);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Create game (admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
    try {
        const { title, description, price, genre, image_url } = req.body;
        if (!title || !description || !price || !genre) {
            return res.status(400).json({ error: 'Все поля обязательны' });
        }
        const game = await Game.create({ title, description, price: parseFloat(price), genre, image_url });
        res.status(201).json(game);
    } catch (err) {
        console.error('Create game error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Update game (admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) return res.status(404).json({ error: 'Игра не найдена' });

        const { title, description, price, genre, image_url } = req.body;
        await game.update({ title, description, price: parseFloat(price), genre, image_url });
        res.json(game);
    } catch (err) {
        console.error('Update game error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Delete game (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) return res.status(404).json({ error: 'Игра не найдена' });
        await Rating.destroy({ where: { game_id: game.id } });
        await game.destroy();
        res.json({ message: 'Игра удалена' });
    } catch (err) {
        console.error('Delete game error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
