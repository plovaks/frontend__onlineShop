import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ruble from "../../assets/icons/ruble.svg";
import { useCart } from "../CartContext";
import './AddToCart.css';

export default function AddToCart({ product, price, salePrice }) {
    const { addToCart, updateQuantity, cart } = useCart();
    const navigate = useNavigate();
    
    const inCart = cart.find(item => item.id === product.id);
    const maxStock = product.stock || 0;
    const isOutOfStock = maxStock <= 0;
    
    const [isAdded, setIsAdded] = useState(!!inCart);
    const [count, setCount] = useState(inCart ? inCart.quantity : 1);

    useEffect(() => {
        if (inCart) {
            setCount(inCart.quantity);
            setIsAdded(true);
        } else {
            setIsAdded(false);
            setCount(1);
        }
    }, [inCart]);

    const handleAddClick = () => {
        if (isOutOfStock) {
            alert("Товар отсутствует на складе");
            return;
        }
        setIsAdded(true);
        addToCart(product, count);
    };

    const updateCount = (newCount) => {
        let val = Math.max(1, Number(newCount));
        if (val > maxStock && maxStock > 0) {
            val = maxStock;
        }
        setCount(val);
        if (isAdded && inCart) {
            updateQuantity(product.id, val, maxStock);
        } else if (isAdded && !inCart) {
            addToCart(product, val);
        }
    };

    const handleInputChange = (e) => {
        let value = e.target.value;
        value = value.replace(/\D/g, '');
        
        if (value === "") {
            setCount("");
        } else {
            updateCount(parseInt(value, 10));
        }
    };

    const goToCart = () => {
        navigate('/cart');
    };

    // Если товара нет в наличии 
    if (isOutOfStock) {
        return (
            <div className="purchase__container">
                <p className="purchase__price">
                    {price} <img src={ruble} alt="ruble" />
                </p>
                <p className="out-of-stock-message" style={{ color: '#dc2626', fontSize: '14px', fontWeight: '500' }}>
                    Нет в наличии
                </p>
                <button 
                    className="btn purchase__addToCart" 
                    disabled={true}
                    style={{ opacity: 0.5, cursor: 'not-allowed', backgroundColor: '#ccc' }}
                >
                    Добавить в корзину
                </button>
            </div>
        );
    }

    if (!isAdded) {
        return (
            <div className="purchase__container">
                <p className="purchase__price">
                    {price} <img src={ruble} alt="ruble" />
                </p>
                <button 
                    className="btn purchase__addToCart" 
                    onClick={handleAddClick}
                >
                    Добавить в корзину
                </button>
            </div>
        );
    }

    return (
        <div className="purchase__container">
            <p className="purchase__price">
                {price} <img src={ruble} alt="ruble" />
            </p>
            {salePrice && (
                <p className="purchase__sales">{salePrice}р/шт при покупке от 100шт</p>
            )}
            <p className="in-stock-message" style={{ color: '#10b981', fontSize: '12px', marginTop: '4px' }}>
                В наличии: {maxStock} шт.
            </p>
            <div className="counter__wrapper">
                <button className="btn purchase__inCart" onClick={goToCart}>
                    В корзине 
                </button>
                <div className="purchase__counter">
                    <button 
                        className="counter__btn" 
                        onClick={() => updateCount(count - 1)}
                        disabled={count <= 1}
                    >
                        -
                    </button>
                    <input
                        type="text"
                        value={count}
                        onChange={handleInputChange}
                        onBlur={() => { if (!count) updateCount(1); }}
                        inputMode="numeric"
                    />
                    <button 
                        className="counter__btn" 
                        onClick={() => updateCount(count + 1)}
                        disabled={count >= maxStock}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}