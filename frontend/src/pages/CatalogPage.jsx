import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getGames, getGenres } from '../api';
import GameCard from '../components/GameCard';
import './CatalogPage.css';

const CatalogPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [games, setGames] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState(searchParams.get('search') || '');

    const page = parseInt(searchParams.get('page') || '1');
    const genre = searchParams.get('genre') || 'all';
    const sort = searchParams.get('sort') || 'newest';

    useEffect(() => {
        setSearch(searchParams.get('search') || '');
    }, [searchParams]);

    useEffect(() => {
        getGenres().then((res) => setGenres(res.data)).catch(() => { });
    }, []);

    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            try {
                const res = await getGames({
                    page,
                    limit: 12,
                    genre: genre !== 'all' ? genre : undefined,
                    search: search || undefined,
                    sort,
                });
                setGames(res.data.games);
                setTotal(res.data.total);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchGames();
    }, [page, genre, sort, search]);

    const updateParams = (key, value) => {
        const params = new URLSearchParams(searchParams);
        params.set(key, value);
        if (key !== 'page') params.set('page', '1');
        setSearchParams(params);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        updateParams('search', search);
    };

    return (
        <div className="catalog-page">
            <div className="catalog-container">
                <div className="catalog-header">
                    <h1>🎮 Каталог игр</h1>
                    <p>Найдено <strong>{total}</strong> игр</p>
                </div>

                {/* Filters */}
                <div className="catalog-filters">
                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Поиск по названию..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">🔍</button>
                    </form>

                    <div className="filter-row">
                        <div className="filter-group">
                            <label>Жанр:</label>
                            <select value={genre} onChange={(e) => updateParams('genre', e.target.value)}>
                                <option value="all">Все жанры</option>
                                {genres.map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Сортировка:</label>
                            <select value={sort} onChange={(e) => updateParams('sort', e.target.value)}>
                                <option value="newest">Новые</option>
                                <option value="rating">По рейтингу</option>
                                <option value="price_asc">Цена ↑</option>
                                <option value="price_desc">Цена ↓</option>
                                <option value="title">По названию</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Games Grid */}
                {loading ? (
                    <div className="games-grid">
                        {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
                    </div>
                ) : games.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">🔍</span>
                        <h3>Игры не найдены</h3>
                        <p>Попробуйте изменить фильтры или поисковый запрос</p>
                    </div>
                ) : (
                    <div className="games-grid">
                        {games.map((game) => <GameCard key={game.id} game={game} />)}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            disabled={page <= 1}
                            onClick={() => updateParams('page', page - 1)}
                            className="page-btn"
                        >
                            ← Назад
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                                onClick={() => updateParams('page', i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={page >= totalPages}
                            onClick={() => updateParams('page', page + 1)}
                            className="page-btn"
                        >
                            Далее →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CatalogPage;
