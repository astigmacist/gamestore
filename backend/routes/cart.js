const express = require('express');
const { CartItem, Game } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get user cart
router.get('/', authenticate, async (req, res) => {
    try {
        const items = await CartItem.findAll({
            where: { user_id: req.user.id },
            include: [{ model: Game }],
        });
        res.json(items);
    } catch (err) {
        console.error('Get cart error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Add to cart
router.post('/', authenticate, async (req, res) => {
    try {
        const { game_id, quantity = 1 } = req.body;
        if (!game_id) return res.status(400).json({ error: 'game_id обязателен' });

        const game = await Game.findByPk(game_id);
        if (!game) return res.status(404).json({ error: 'Игра не найдена' });

        const existing = await CartItem.findOne({
            where: { user_id: req.user.id, game_id }
        });

        if (existing) {
            existing.quantity += quantity;
            await existing.save();
            const item = await CartItem.findByPk(existing.id, { include: [{ model: Game }] });
            return res.json(item);
        }

        const cartItem = await CartItem.create({
            user_id: req.user.id,
            game_id,
            quantity,
        });
        const item = await CartItem.findByPk(cartItem.id, { include: [{ model: Game }] });
        res.status(201).json(item);
    } catch (err) {
        console.error('Add to cart error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Update cart item quantity
router.put('/:id', authenticate, async (req, res) => {
    try {
        const item = await CartItem.findOne({
            where: { id: req.params.id, user_id: req.user.id }
        });
        if (!item) return res.status(404).json({ error: 'Элемент не найден' });

        const { quantity } = req.body;
        if (quantity < 1) {
            await item.destroy();
            return res.json({ message: 'Удалено из корзины' });
        }
        item.quantity = quantity;
        await item.save();
        const updated = await CartItem.findByPk(item.id, { include: [{ model: Game }] });
        res.json(updated);
    } catch (err) {
        console.error('Update cart error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Remove from cart
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const item = await CartItem.findOne({
            where: { id: req.params.id, user_id: req.user.id }
        });
        if (!item) return res.status(404).json({ error: 'Элемент не найден' });
        await item.destroy();
        res.json({ message: 'Удалено из корзины' });
    } catch (err) {
        console.error('Remove from cart error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Clear cart
router.delete('/', authenticate, async (req, res) => {
    try {
        await CartItem.destroy({ where: { user_id: req.user.id } });
        res.json({ message: 'Корзина очищена' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
