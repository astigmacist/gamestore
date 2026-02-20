import { useState, useEffect } from 'react';
import { getOrders } from '../api';
import { useAuth } from '../context/AuthContext';
import './OrdersPage.css';

const OrdersPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getOrders()
                .then((res) => setOrders(res.data))
                .catch(() => { })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user]);

    if (!user) {
        return (
            <div className="orders-page">
                <div className="orders-empty">
                    <span>🔒</span>
                    <h2>Войдите для просмотра заказов</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="orders-container">
                <h1>📦 Мои заказы</h1>

                {loading ? (
                    <div className="orders-loading"><div className="spinner"></div></div>
                ) : orders.length === 0 ? (
                    <div className="orders-empty">
                        <span>📦</span>
                        <h2>У вас пока нет заказов</h2>
                        <p>Оформите первый заказ в каталоге!</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <span className="order-id">Заказ #{order.id}</span>
                                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</span>
                                    <span className={`order-status ${order.status}`}>{order.status === 'completed' ? '✅ Завершён' : order.status}</span>
                                </div>
                                <div className="order-items">
                                    {order.order_items.map((item, i) => (
                                        <div key={i} className="order-item">
                                            <img
                                                src={item.image_url}
                                                alt={item.title}
                                                className="order-item-img"
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=100&h=60&fit=crop'; }}
                                            />
                                            <div className="order-item-info">
                                                <span className="order-item-title">{item.title}</span>
                                                <span className="order-item-qty">{item.quantity} × ${item.price.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-footer">
                                    <span className="order-total">Итого: <strong>${order.total_price.toFixed(2)}</strong></span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
