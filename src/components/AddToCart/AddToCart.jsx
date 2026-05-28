import React, { useState, useEffect } from "react";
import ruble from "../../assets/icons/ruble.svg";
import { useCart } from "../CartContext";
import './AddToCart.css';

export default function AddToCart({ product, price, salePrice }) {
    const { addToCart, cart } = useCart();
    
    const inCart = cart.find(item => item.id === product.id);
    
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
        setIsAdded(true);
        addToCart(product, count); 
    };

    const updateCount = (newCount) => {
        const val = Math.max(1, Number(newCount));
        setCount(val);
        if (isAdded) {
            addToCart(product, val); 
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value === "") {
            setCount("");
        } else {
            updateCount(value);
        }
    };

    if (!isAdded) {
        return (
            <div className="purchase__container">
                <p className="purchase__price">
                    {price} <img src={ruble} alt="ruble" />
                </p>
                <p className="purchase__sales">{salePrice}р/шт при покупке от 100шт</p>
                <button className="btn purchase__addToCart" onClick={handleAddClick}>
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
            <p className="purchase__sales">{salePrice}р/шт при покупке от 100шт</p>
            <div className="counter__wrapper">
                <button className="btn purchase__inCart">В корзине</button>
                <div className="purchase__counter">
                    <button className="counter__btn" onClick={() => updateCount(count - 1)}>-</button>
                    <input
                        type="number"
                        value={count}
                        onChange={handleInputChange}
                        onBlur={() => { if (!count) updateCount(1); }}
                    />
                    <button className="counter__btn" onClick={() => updateCount(count + 1)}>+</button>
                </div>
            </div>
        </div>
    );
}
