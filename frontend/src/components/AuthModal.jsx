import { useState } from 'react';
import { login, register } from '../api';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

const AuthModal = ({ mode, onClose, onSwitch }) => {
    const { loginUser } = useAuth();
    const [formData, setFormData] = useState({
        username: '', email: '', password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'register') {
                if (!formData.username || !formData.email || !formData.password) {
                    setError('Заполните все поля');
                    setLoading(false);
                    return;
                }
                if (formData.username.length < 3) {
                    setError('Имя минимум 3 символа');
                    setLoading(false);
                    return;
                }
                if (formData.password.length < 6) {
                    setError('Пароль минимум 6 символов');
                    setLoading(false);
                    return;
                }
                const res = await register(formData);
                loginUser(res.data.user, res.data.token);
            } else {
                if (!formData.email || !formData.password) {
                    setError('Заполните все поля');
                    setLoading(false);
                    return;
                }
                const res = await login({ email: formData.email, password: formData.password });
                loginUser(res.data.user, res.data.token);
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка сервера');
        }
        setLoading(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>
                <h2>{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>
                <p className="modal-subtitle">
                    {mode === 'login' ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
                </p>

                <form onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <div className="form-group">
                            <label>Имя пользователя</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="username"
                                value={formData.username}
                                onChange={handleChange}
                                autoComplete="username"
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                        />
                    </div>

                    {error && <div className="form-error">{error}</div>}

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </form>

                <p className="modal-switch">
                    {mode === 'login' ? (
                        <>Нет аккаунта? <button onClick={() => onSwitch('register')}>Зарегистрироваться</button></>
                    ) : (
                        <>Уже есть аккаунт? <button onClick={() => onSwitch('login')}>Войти</button></>
                    )}
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
