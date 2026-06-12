import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ruble from "../../assets/icons/ruble.svg";
import { useCart } from "../CartContext";
import './AddToCart.css';

export default function AddToCart({ product, price, salePrice }) {
    const { addToCart, updateQuantity, cart } = useCart();
    const navigate = useNavigate();
    
    const inCart = cart.find(item => item.id === product.id);
    
    const [isAdded, setIsAdded] = useState(!!inCart);
    const [count, setCount] = useState(inCart ? inCart.quantity : 1);
    const maxStock = product.stock || 0;

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
        setIsAdded(true);
        addToCart(product, count);
    };

    const updateCount = (newCount) => {
        let val = Math.max(1, Number(newCount));
        if (val > maxStock && maxStock > 0) {
            alert(`Недостаточно товара. В наличии: ${maxStock} шт.`);
            val = maxStock;
        }
        setCount(val);
        if (isAdded && inCart) {
            // Используем updateQuantity для изменения количества
            updateQuantity(product.id, val, maxStock);
        } else if (isAdded && !inCart) {
            // Если товар только что добавили, но его ещё нет в корзине
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

    if (!isAdded) {
        return (
            <div className="purchase__container">
                <p className="purchase__price">
                    {price} <img src={ruble} alt="ruble" />
                </p>
                <button 
                    className="btn purchase__addToCart" 
                    onClick={handleAddClick} 
                    disabled={count >= maxStock && maxStock > 0}
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
                        disabled={count >= maxStock && maxStock > 0}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}