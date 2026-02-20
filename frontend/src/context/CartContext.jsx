import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart as fetchCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadCart = useCallback(async () => {
        if (!user) {
            setItems([]);
            return;
        }
        setLoading(true);
        try {
            const res = await fetchCart();
            setItems(res.data);
        } catch {
            setItems([]);
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const addToCart = async (gameId) => {
        if (!user) return false;
        try {
            await apiAddToCart(gameId);
            await loadCart();
            return true;
        } catch {
            return false;
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            await apiUpdateCartItem(itemId, quantity);
            await loadCart();
        } catch (err) {
            console.error(err);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await apiRemoveFromCart(itemId);
            await loadCart();
        } catch (err) {
            console.error(err);
        }
    };

    const clearCartItems = async () => {
        try {
            await apiClearCart();
            setItems([]);
        } catch (err) {
            console.error(err);
        }
    };

    const totalPrice = items.reduce((sum, item) => sum + (item.Game?.price || 0) * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, loading, totalPrice, totalItems, addToCart, updateQuantity, removeItem, clearCartItems, loadCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
