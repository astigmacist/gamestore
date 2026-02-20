require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const seedData = require('./seed');

// Import routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const cartRoutes = require('./routes/cart');
const ratingRoutes = require('./routes/ratings');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Start server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('📦 Database connected');

        await sequelize.sync({ force: true });
        console.log('📋 Tables created');

        await seedData();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
