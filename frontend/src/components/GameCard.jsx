import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';
import './GameCard.css';

const GameCard = ({ game }) => {
    const { user } = useAuth();
    const { addToCart } = useCart();

    const handleAdd = async () => {
        if (!user) {
            alert('Войдите в аккаунт для добавления в корзину');
            return;
        }
        const success = await addToCart(game.id);
        if (success) {
            // visual feedback
        }
    };

    return (
        <div className="game-card">
            <Link to={`/game/${game.id}`} className="game-card-image-wrap">
                <img
                    src={game.image_url}
                    alt={game.title}
                    className="game-card-image"
                    loading="lazy"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop'; }}
                />
                <div className="game-card-overlay">
                    <span className="game-genre-badge">{game.genre}</span>
                </div>
            </Link>
            <div className="game-card-body">
                <Link to={`/game/${game.id}`} className="game-card-title">{game.title}</Link>
                <div className="game-card-rating">
                    <StarRating rating={game.avg_rating} readOnly size="small" />
                    <span className="rating-count">({game.rating_count})</span>
                </div>
                <div className="game-card-footer">
                    <span className="game-price">
                        {game.price === 0 ? 'Бесплатно' : `$${game.price.toFixed(2)}`}
                    </span>
                    <button className="btn-add-cart" onClick={handleAdd}>
                        🛒 В корзину
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameCard;
