import React, { useState } from "react";
import CartItem from "../../components/CartItem/CartItem";
import Order from "../../components/Order/Order";
import { useCart } from "../../components/CartContext";
import { useAuth } from "../../components/AuthContext";
import AuthModal from "../../components/AuthModal/AuthModal";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./Cart.css";

export default function Cart() {
    const { cart, clearCart } = useCart();
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    async function handlePay() {
        if (!user) {
            setShowAuthModal(true);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const items = cart.map(item => ({
                product_id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }));

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items, total_amount: totalPrice })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Ошибка создания заказа');
                return;
            }

            setOrderId(data.order.id);
            setShowSuccess(true);
            clearCart();

        } catch (err) {
            setError('Ошибка соединения с сервером');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Header className="cart__header"/>

            <div className="cart__container">
                <h1 className="cart__title">КОРЗИНА</h1>
                <div className="cart__info">
                    <div className="cart__items">
                        {cart.length > 0 ? (
                            <>
                                <div className="cart__headlines">
                                    <span>Товар</span>
                                    <span>Количество</span>
                                    <span>Цена</span>
                                    <span></span>
                                </div>
                                {cart.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        product={item}
                                        img={item.images?.[0]?.url ? `${import.meta.env.VITE_API_URL}${item.images[0].url}` : ""}
                                        name={`${item.model} ${item.name}`}
                                        capacity={item.specs?.[0]?.value}
                                        voltage={item.specs?.[2]?.value}
                                        resistance={item.specs?.[1]?.value}
                                        value={item.quantity}
                                        price={item.price}
                                        
                                    />
                                ))}
                            </>
                        ) : (
                            <div className="cart__empty-container">
                                <p className="cart__empty">Корзина пуста</p>
                                <Link to='/#catalog'>
                                    <button className="cart__to-buy">К покупкам</button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="cart__total">
                        <p className="cart__goods">Товары ({cart.length})</p>
                        <div className="cart__orders">
                            {cart.map((item) => (
                                <Order
                                    key={item.id}
                                    orderName={item.name}
                                    orderPrice={item.price * item.quantity}
                                />
                            ))}
                        </div>
                        <div className="cart__sum-box">
                            <p className="cart__sum">Итого: {totalPrice} ₽</p>
                        </div>
                        {error && <p className="cart__error">{error}</p>}
                        <button
                            className="cart__pay"
                            disabled={cart.length === 0 || loading}
                            onClick={handlePay}
                        >
                            {loading ? 'Оформляем...' : 'Оформить'}
                        </button>
                        {!user && cart.length > 0 && (
                            <p className="cart__auth-hint">
                                Войдите в аккаунт чтобы оформить заказ
                            </p>
                        )}
                    </div>
                </div>
            </div>

            
            {showAuthModal && (
                <AuthModal onClose={() => setShowAuthModal(false)} />
            )}

            
            {showSuccess && (
                <div className="cart__qr-overlay" onClick={() => setShowSuccess(false)}>
                    <div className="cart__qr-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Заказ №{orderId} оформлен!</h2>
                        <p className="cart__qr-desc">
                            Информация о заказе отправлена на вашу почту.<br/>
                            С вами свяжутся для подтверждения заказа и уточнения деталей доставки.
                        </p>
                        <div className="cart__qr-actions">
                            <button
                                className="cart__qr-profile"
                                onClick={() => { setShowSuccess(false); navigate('/profile'); }}
                            >
                                Мои заказы
                            </button>
                            <button
                                className="cart__qr-close"
                                onClick={() => setShowSuccess(false)}
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}