import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <div className="footer-logo">
                        <span className="logo-icon">🎮</span>
                        <span className="logo-text">GameVault</span>
                    </div>
                    <p className="footer-desc">
                        Лучший магазин цифровых игр. Тысячи игр по лучшим ценам с мгновенной доставкой ключей.
                    </p>
                    <div className="footer-socials">
                        <a href="#" className="social-link">🐦</a>
                        <a href="#" className="social-link">📘</a>
                        <a href="#" className="social-link">📸</a>
                        <a href="#" className="social-link">💬</a>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>Быстрые ссылки</h4>
                    <Link to="/">Главная</Link>
                    <Link to="/catalog">Каталог</Link>
                    <Link to="/orders">Мои заказы</Link>
                </div>

                <div className="footer-section">
                    <h4>Жанры</h4>
                    <Link to="/catalog?genre=RPG">RPG</Link>
                    <Link to="/catalog?genre=Action">Action</Link>
                    <Link to="/catalog?genre=Shooter">Shooter</Link>
                    <Link to="/catalog?genre=Strategy">Strategy</Link>
                </div>

                <div className="footer-section">
                    <h4>Контакты</h4>
                    <span>📧 support@gamevault.com</span>
                    <span>📞 +7 (999) 123-45-67</span>
                    <span>📍 Москва, Россия</span>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 GameVault. Все права защищены. Сделано с ❤️</p>
            </div>
        </footer>
    );
};

export default Footer;
