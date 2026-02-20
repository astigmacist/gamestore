import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { checkout } from '../api';
import './CartDrawer.css';

const CartDrawer = ({ open, onClose }) => {
    const { user } = useAuth();
    const { items, totalPrice, updateQuantity, removeItem, loadCart } = useCart();
    const navigate = useNavigate();

    const [step, setStep] = useState('cart'); // 'cart' | 'payment'
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvc: '', name: '', type: 'visa' });

    const handleCheckout = async () => {
        if (step === 'cart') {
            setStep('payment');
            return;
        }

        setIsCheckoutLoading(true);
        try {
            await checkout();
            await loadCart();
            setStep('cart');
            onClose();
            alert('Оплата прошла успешно! Ключ активации отправлен на вашу почту.');
            navigate('/orders');
        } catch (err) {
            alert(err.response?.data?.error || 'Ошибка оформления заказа');
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    if (!open) return null;

    return (
        <>
            <div className="drawer-overlay" onClick={onClose} />
            <div className={`cart-drawer ${open ? 'open' : ''}`}>
                <div className="cart-drawer-header">
                    <h3>{step === 'cart' ? '🛒 Корзина' : '💳 Оплата'}</h3>
                    <button className="drawer-close" onClick={onClose}>✕</button>
                </div>

                <div className="cart-drawer-body">
                    {step === 'cart' ? (
                        items.length === 0 ? (
                            <div className="cart-empty">
                                <span className="empty-icon">🛒</span>
                                <p>Корзина пуста</p>
                                <span className="empty-sub">Добавьте игры из каталога</span>
                            </div>
                        ) : (
                            <div className="cart-items">
                                {items.map((item) => (
                                    <div key={item.id} className="cart-item">
                                        <img
                                            src={item.Game?.image_url}
                                            alt={item.Game?.title}
                                            className="cart-item-img"
                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop'; }}
                                        />
                                        <div className="cart-item-info">
                                            <span className="cart-item-title">{item.Game?.title}</span>
                                            <span className="cart-item-price">${item.Game?.price?.toFixed(2)}</span>
                                            <div className="cart-item-qty">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                            </div>
                                        </div>
                                        <button className="cart-item-remove" onClick={() => removeItem(item.id)}>🗑</button>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="payment-form">
                            <h3>Выберите способ оплаты</h3>
                            <div className="payment-methods">
                                {['visa', 'mastercard', 'mir'].map(type => (
                                    <div
                                        key={type}
                                        className={`method-icon ${cardInfo.type === type ? 'active' : ''}`}
                                        onClick={() => setCardInfo({ ...cardInfo, type })}
                                    >
                                        <img src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${type}.png`} alt={type} />
                                    </div>
                                ))}
                            </div>

                            <div className="card-mockup" data-type={cardInfo.type}>
                                <div className="card-inner">
                                    <div className="card-front">
                                        <div className="card-chip"></div>
                                        <div className="card-logo">
                                            <img src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${cardInfo.type}.png`} alt="" />
                                        </div>
                                        <div className="card-number-display">{cardInfo.number || '#### #### #### ####'}</div>
                                        <div className="card-bottom">
                                            <div className="card-holder">
                                                <small>HOLDER</small>
                                                <div>{cardInfo.name || 'FULL NAME'}</div>
                                            </div>
                                            <div className="card-expires">
                                                <small>EXPIRES</small>
                                                <div>{cardInfo.expiry || 'MM/YY'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Номер карты</label>
                                <input
                                    placeholder="#### #### #### ####"
                                    value={cardInfo.number}
                                    onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                                    maxLength="19"
                                />
                            </div>

                            <div className="input-group">
                                <label>Имя на карте</label>
                                <input
                                    placeholder="IVAN IVANOV"
                                    value={cardInfo.name}
                                    onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value.toUpperCase() })}
                                />
                            </div>

                            <div className="field-row">
                                <div className="input-group">
                                    <label>ММ/ГГ</label>
                                    <input
                                        placeholder="MM/YY"
                                        value={cardInfo.expiry}
                                        onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                                        maxLength="5"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>CVC</label>
                                    <input
                                        type="password"
                                        placeholder="***"
                                        value={cardInfo.cvc}
                                        onChange={(e) => setCardInfo({ ...cardInfo, cvc: e.target.value })}
                                        maxLength="3"
                                    />
                                </div>
                            </div>

                            <button className="btn-back" onClick={() => setStep('cart')}>← Назад в корзину</button>
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="cart-drawer-footer">
                        <div className="cart-total">
                            <span>Итого:</span>
                            <span className="total-price">${totalPrice.toFixed(2)}</span>
                        </div>
                        <button
                            className="btn-checkout"
                            disabled={isCheckoutLoading || (!user && step === 'cart')}
                            onClick={handleCheckout}
                        >
                            {!user ? 'Войдите для покупки' :
                                isCheckoutLoading ? 'Обработка...' :
                                    (step === 'cart' ? 'Перейти к оплате' : `Оплатить $${totalPrice.toFixed(2)}`)}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
