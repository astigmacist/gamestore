import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getGame, getUserRating, rateGame } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating';
import './GameDetailPage.css';

const GameDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [game, setGame] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [addedMsg, setAddedMsg] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getGame(id);
                setGame(res.data);
                if (user) {
                    const rRes = await getUserRating(id);
                    setUserRating(rRes.data.rating || 0);
                }
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchData();
    }, [id, user]);

    const handleRate = async (rating) => {
        if (!user) {
            alert('Войдите для оценки');
            return;
        }
        try {
            const res = await rateGame(game.id, rating);
            setUserRating(rating);
            setGame((prev) => ({
                ...prev,
                avg_rating: res.data.avg_rating,
                rating_count: res.data.rating_count,
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            alert('Войдите для добавления в корзину');
            return;
        }
        const success = await addToCart(game.id);
        if (success) {
            setAddedMsg('✅ Добавлено в корзину!');
            setTimeout(() => setAddedMsg(''), 2000);
        }
    };

    if (loading) {
        return (
            <div className="game-detail-page">
                <div className="detail-loading">
                    <div className="spinner"></div>
                    <p>Загрузка...</p>
                </div>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="game-detail-page">
                <div className="detail-loading">
                    <h2>Игра не найдена</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="game-detail-page">
            <div className="detail-container">
                <div className="detail-image-section">
                    <img
                        src={game.image_url}
                        alt={game.title}
                        className="detail-image"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=500&fit=crop'; }}
                    />
                </div>

                <div className="detail-info">
                    <span className="detail-genre">{game.genre}</span>
                    <h1 className="detail-title">{game.title}</h1>

                    <div className="detail-rating-row">
                        <StarRating rating={game.avg_rating} readOnly />
                        <span className="detail-rating-text">
                            {game.avg_rating.toFixed(1)} ({game.rating_count} отзывов)
                        </span>
                    </div>

                    <p className="detail-description">{game.description}</p>

                    <div className="detail-price-section">
                        <span className="detail-price">
                            {game.price === 0 ? 'Бесплатно' : `$${game.price.toFixed(2)}`}
                        </span>
                        <button className="btn-buy" onClick={handleAddToCart}>
                            🛒 Купить
                        </button>
                    </div>
                    {addedMsg && <div className="added-msg">{addedMsg}</div>}

                    {user && (
                        <div className="user-rating-section">
                            <h3>Ваша оценка:</h3>
                            <StarRating
                                rating={userRating}
                                onRate={handleRate}
                            />
                            {userRating > 0 && <span className="your-rating">Ваша оценка: {userRating} ★</span>}
                        </div>
                    )}

                    <div className="detail-meta">
                        <div className="meta-item">
                            <span className="meta-label">Жанр</span>
                            <span className="meta-value">{game.genre}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Рейтинг</span>
                            <span className="meta-value">{game.avg_rating.toFixed(1)} ⭐</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Цена</span>
                            <span className="meta-value">{game.price === 0 ? 'Free' : `$${game.price.toFixed(2)}`}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameDetailPage;
