import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Games
export const getGames = (params) => api.get('/games', { params });
export const getGame = (id) => api.get(`/games/${id}`);
export const getGenres = () => api.get('/games/genres');
export const createGame = (data) => api.post('/games', data);
export const updateGame = (id, data) => api.put(`/games/${id}`, data);
export const deleteGame = (id) => api.delete(`/games/${id}`);

// Cart
export const getCart = () => api.get('/cart');
export const addToCart = (game_id, quantity = 1) => api.post('/cart', { game_id, quantity });
export const updateCartItem = (id, quantity) => api.put(`/cart/${id}`, { quantity });
export const removeFromCart = (id) => api.delete(`/cart/${id}`);
export const clearCart = () => api.delete('/cart');

// Ratings
export const getRatings = (gameId) => api.get(`/ratings/game/${gameId}`);
export const getUserRating = (gameId) => api.get(`/ratings/user/${gameId}`);
export const rateGame = (game_id, rating) => api.post('/ratings', { game_id, rating });

// Orders
export const getOrders = () => api.get('/orders');
export const checkout = () => api.post('/orders/checkout');

// Admin
export const getAdminStats = () => api.get('/admin/stats');
export const getAdminUsers = () => api.get('/admin/users');
export const getAdminOrders = () => api.get('/admin/orders');
export const getAdminCarts = () => api.get('/admin/carts');
export const getAdminRatings = () => api.get('/admin/ratings');
export const deleteAdminRating = (id) => api.delete(`/admin/ratings/${id}`);

export default api;
