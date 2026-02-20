import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGames } from '../api';
import GameCard from '../components/GameCard';
import './HomePage.css';

const HomePage = () => {
    const [popular, setPopular] = useState([]);
    const [newest, setNewest] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const [popRes, newRes] = await Promise.all([
                    getGames({ sort: 'rating', limit: 8 }),
                    getGames({ sort: 'newest', limit: 8 }),
                ]);
                setPopular(popRes.data.games);
                setNewest(newRes.data.games);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchGames();
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-orb orb-1"></div>
                    <div className="hero-orb orb-2"></div>
                    <div className="hero-orb orb-3"></div>
                </div>
                <div className="hero-content">
                    <span className="hero-badge">🎮 Digital Game Store</span>
                    <h1 className="hero-title">
                        Откройте мир<br />
                        <span className="gradient-text">цифровых игр</span>
                    </h1>
                    <p className="hero-subtitle">
                        Тысячи игр по лучшим ценам. RPG, шутеры, стратегии, инди — всё в одном месте с мгновенной доставкой.
                    </p>
                    <div className="hero-actions">
                        <Link to="/catalog" className="btn-primary">Перейти в каталог</Link>
                        <Link to="/catalog?genre=RPG" className="btn-secondary">Популярные RPG</Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">30+</span>
                            <span className="stat-label">Игр</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">4.5</span>
                            <span className="stat-label">Средний рейтинг</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Поддержка</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Games */}
            <section className="games-section">
                <div className="section-header">
                    <div>
                        <h2>🔥 Популярные игры</h2>
                        <p>Игры с наивысшим рейтингом от наших пользователей</p>
                    </div>
                    <Link to="/catalog?sort=rating" className="see-all">Все игры →</Link>
                </div>
                {loading ? (
                    <div className="loading-grid">
                        {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" />)}
                    </div>
                ) : (
                    <div className="games-grid">
                        {popular.map((game) => <GameCard key={game.id} game={game} />)}
                    </div>
                )}
            </section>

            {/* New Games */}
            <section className="games-section">
                <div className="section-header">
                    <div>
                        <h2>🆕 Новинки</h2>
                        <p>Недавно добавленные игры в нашу коллекцию</p>
                    </div>
                    <Link to="/catalog" className="see-all">Все игры →</Link>
                </div>
                {loading ? (
                    <div className="loading-grid">
                        {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" />)}
                    </div>
                ) : (
                    <div className="games-grid">
                        {newest.map((game) => <GameCard key={game.id} game={game} />)}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;
