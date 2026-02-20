import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import {
    getAdminStats, getAdminUsers, getAdminOrders, getAdminCarts, getAdminRatings,
    deleteAdminRating, getGames, createGame, updateGame, deleteGame
} from '../api';
import './AdminPage.css';

const AdminPage = () => {
    const { user } = useAuth();
    const [tab, setTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [carts, setCarts] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);

    // Game form
    const [gameForm, setGameForm] = useState({ title: '', description: '', price: '', genre: '', image_url: '' });
    const [editId, setEditId] = useState(null);
    const [formError, setFormError] = useState('');

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const loadTab = async (t) => {
        setTab(t);
        setLoading(true);
        try {
            if (t === 'dashboard') {
                const res = await getAdminStats();
                setStats(res.data);
            } else if (t === 'users') {
                const res = await getAdminUsers();
                setUsers(res.data);
            } else if (t === 'games') {
                const res = await getGames({ limit: 100 });
                setGames(res.data.games);
            } else if (t === 'orders') {
                const res = await getAdminOrders();
                setOrders(res.data);
            } else if (t === 'carts') {
                const res = await getAdminCarts();
                setCarts(res.data);
            } else if (t === 'ratings') {
                const res = await getAdminRatings();
                setRatings(res.data);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadTab('dashboard');
    }, []);

    const handleGameSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!gameForm.title || !gameForm.description || !gameForm.price || !gameForm.genre) {
            setFormError('Заполните все обязательные поля');
            return;
        }
        try {
            if (editId) {
                await updateGame(editId, gameForm);
            } else {
                await createGame(gameForm);
            }
            setGameForm({ title: '', description: '', price: '', genre: '', image_url: '' });
            setEditId(null);
            loadTab('games');
        } catch (err) {
            setFormError(err.response?.data?.error || 'Ошибка');
        }
    };

    const handleEdit = (game) => {
        setEditId(game.id);
        setGameForm({
            title: game.title,
            description: game.description,
            price: game.price,
            genre: game.genre,
            image_url: game.image_url || '',
        });
    };

    const handleDelete = async (id) => {
        if (!confirm('Удалить игру?')) return;
        try {
            await deleteGame(id);
            loadTab('games');
        } catch (err) {
            alert(err.response?.data?.error || 'Ошибка удаления');
        }
    };

    const handleDeleteRating = async (id) => {
        if (!confirm('Удалить рейтинг?')) return;
        try {
            await deleteAdminRating(id);
            loadTab('ratings');
        } catch (err) {
            alert('Ошибка удаления');
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-container">
                <h1>⚙️ Админ-панель</h1>

                <div className="admin-tabs">
                    {['dashboard', 'games', 'users', 'orders', 'carts', 'ratings'].map((t) => (
                        <button
                            key={t}
                            className={`admin-tab ${tab === t ? 'active' : ''}`}
                            onClick={() => loadTab(t)}
                        >
                            {t === 'dashboard' && '📊 Дашборд'}
                            {t === 'games' && '🎮 Игры'}
                            {t === 'users' && '👥 Пользователи'}
                            {t === 'orders' && '📦 Заказы'}
                            {t === 'carts' && '🛒 Корзины'}
                            {t === 'ratings' && '⭐ Рейтинги'}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="admin-loading"><div className="spinner"></div></div>
                ) : (
                    <div className="admin-content">
                        {/* Dashboard */}
                        {tab === 'dashboard' && stats && (
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <span className="stat-icon">👥</span>
                                    <span className="stat-num">{stats.usersCount}</span>
                                    <span className="stat-lbl">Пользователей</span>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-icon">🎮</span>
                                    <span className="stat-num">{stats.gamesCount}</span>
                                    <span className="stat-lbl">Игр</span>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-icon">📦</span>
                                    <span className="stat-num">{stats.ordersCount}</span>
                                    <span className="stat-lbl">Заказов</span>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-icon">⭐</span>
                                    <span className="stat-num">{stats.ratingsCount}</span>
                                    <span className="stat-lbl">Оценок</span>
                                </div>
                            </div>
                        )}

                        {/* Games CRUD */}
                        {tab === 'games' && (
                            <>
                                <form className="game-form" onSubmit={handleGameSubmit}>
                                    <h3>{editId ? 'Редактировать игру' : 'Добавить игру'}</h3>
                                    <div className="form-grid">
                                        <input placeholder="Название *" value={gameForm.title} onChange={(e) => setGameForm({ ...gameForm, title: e.target.value })} />
                                        <input placeholder="Жанр *" value={gameForm.genre} onChange={(e) => setGameForm({ ...gameForm, genre: e.target.value })} />
                                        <input placeholder="Цена *" type="number" step="0.01" value={gameForm.price} onChange={(e) => setGameForm({ ...gameForm, price: e.target.value })} />
                                        <input placeholder="URL изображения" value={gameForm.image_url} onChange={(e) => setGameForm({ ...gameForm, image_url: e.target.value })} />
                                    </div>
                                    <textarea placeholder="Описание *" value={gameForm.description} onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })} rows={3} />
                                    {formError && <div className="form-error">{formError}</div>}
                                    <div className="form-actions">
                                        <button type="submit" className="btn-primary">{editId ? 'Сохранить' : 'Добавить'}</button>
                                        {editId && <button type="button" className="btn-secondary" onClick={() => { setEditId(null); setGameForm({ title: '', description: '', price: '', genre: '', image_url: '' }); }}>Отмена</button>}
                                    </div>
                                </form>

                                <div className="admin-table-wrap">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Название</th>
                                                <th>Жанр</th>
                                                <th>Цена</th>
                                                <th>Рейтинг</th>
                                                <th>Действия</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {games.map((g) => (
                                                <tr key={g.id}>
                                                    <td>{g.id}</td>
                                                    <td>{g.title}</td>
                                                    <td>{g.genre}</td>
                                                    <td>${g.price.toFixed(2)}</td>
                                                    <td>{g.avg_rating.toFixed(1)} ⭐</td>
                                                    <td>
                                                        <button className="tbl-btn edit" onClick={() => handleEdit(g)}>✏️</button>
                                                        <button className="tbl-btn delete" onClick={() => handleDelete(g.id)}>🗑</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {/* Users */}
                        {tab === 'users' && (
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Имя</th>
                                            <th>Email</th>
                                            <th>Роль</th>
                                            <th>Дата регистрации</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u.id}>
                                                <td>{u.id}</td>
                                                <td>{u.username}</td>
                                                <td>{u.email}</td>
                                                <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                                                <td>{new Date(u.createdAt).toLocaleDateString('ru-RU')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Orders */}
                        {tab === 'orders' && (
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Пользователь</th>
                                            <th>Товары</th>
                                            <th>Сумма</th>
                                            <th>Дата</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((o) => (
                                            <tr key={o.id}>
                                                <td>{o.id}</td>
                                                <td>{o.User?.username}</td>
                                                <td>{o.order_items.map(i => i.title).join(', ')}</td>
                                                <td className="price-cell">${o.total_price.toFixed(2)}</td>
                                                <td>{new Date(o.createdAt).toLocaleDateString('ru-RU')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Carts */}
                        {tab === 'carts' && (
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Пользователь</th>
                                            <th>Игра</th>
                                            <th>Количество</th>
                                            <th>Цена</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {carts.length === 0 ? (
                                            <tr><td colSpan={4} className="empty-cell">Корзины пусты</td></tr>
                                        ) : carts.map((c) => (
                                            <tr key={c.id}>
                                                <td>{c.User?.username}</td>
                                                <td>{c.Game?.title}</td>
                                                <td>{c.quantity}</td>
                                                <td>${c.Game?.price?.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Ratings */}
                        {tab === 'ratings' && (
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Пользователь</th>
                                            <th>Игра</th>
                                            <th>Оценка</th>
                                            <th>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ratings.map((r) => (
                                            <tr key={r.id}>
                                                <td>{r.User?.username}</td>
                                                <td>{r.Game?.title}</td>
                                                <td>{'⭐'.repeat(r.rating)}</td>
                                                <td>
                                                    <button className="tbl-btn delete" onClick={() => handleDeleteRating(r.id)}>🗑</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
