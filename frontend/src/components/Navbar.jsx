import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';
import './Navbar.css';

const Navbar = () => {
    const { user, logoutUser } = useAuth();
    const { totalItems } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null
    const [cartOpen, setCartOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
                        <span className="logo-icon">🎮</span>
                        <span className="logo-text">GameVault</span>
                    </Link>

                    <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
                        <Link to="/" onClick={() => setMenuOpen(false)}>Главная</Link>
                        <Link to="/catalog" onClick={() => setMenuOpen(false)}>Каталог</Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" onClick={() => setMenuOpen(false)}>Админ</Link>
                        )}
                        {user && (
                            <Link to="/orders" onClick={() => setMenuOpen(false)}>Заказы</Link>
                        )}
                    </div>

                    <div className="navbar-actions">
                        {user ? (
                            <div className="user-section">
                                {user.role === 'admin' ? (
                                    <Link to="/admin" className="btn-admin-nav">🛡️ Админ</Link>
                                ) : (
                                    <span className="user-greeting">👤 {user.username}</span>
                                )}
                                <button className="btn-logout" onClick={handleLogout}>Выйти</button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <button className="btn-login" onClick={() => setAuthModal('login')}>Войти</button>
                                <button className="btn-register" onClick={() => setAuthModal('register')}>Регистрация</button>
                            </div>
                        )}
                        <button className="cart-btn" onClick={() => setCartOpen(true)}>
                            🛒
                            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                        </button>

                        <button className={`burger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </nav>

            {authModal && (
                <AuthModal
                    mode={authModal}
                    onClose={() => setAuthModal(null)}
                    onSwitch={(m) => setAuthModal(m)}
                />
            )}

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

            {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}
        </>
    );
};

export default Navbar;
