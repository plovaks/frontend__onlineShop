import React, { useState } from "react";
import { useCart } from "../CartContext";
import bin from "../../assets/icons/bin.svg";
import plusIcon from "../../assets/icons/plus.svg";
import minusIcon from "../../assets/icons/minus.svg";
import rubleBlue from "../../assets/icons/rubleBlue.svg";
import "./CartItem.css";

export default function CartItem({ product, img, name, capacity, voltage, resistance, value, price }) {
    console.log("CartItem получил product:", product);
    const { addToCart, removeFromCart } = useCart();
    const [inputValue, setInputValue] = useState(value);

    const handleMinus = () => {
        if (value > 1) {
            const newValue = value - 1;
            addToCart(product, newValue);
            setInputValue(newValue);
        } else {
            removeFromCart(product.id);
        }
    };

    const handlePlus = () => {
        const newValue = value + 1;
        addToCart(product, newValue);
        setInputValue(newValue);
    };

    const handleInputChange = (e) => {
        let newValue = parseInt(e.target.value);
        
       
        if (isNaN(newValue)) {
            newValue = 1;
        }
        
        
        if (newValue < 1) {
            newValue = 1;
        }
        
        setInputValue(newValue);
        addToCart(product, newValue);
    };

    const handleInputBlur = () => {
        if (inputValue !== value) {
            addToCart(product, inputValue);
        }
    };

    return (
        <div className="cartItem">
            <img src={product.img} alt={name} className="cart__image"/>
            <div className="cartItem__info">
                <h4 className="cartItem__title">{product.name}</h4>
                <p className="cartItem__desc">
                    <span>{product.capacity} мАч, </span>
                    <span>{product.voltage} В, </span>
                    <span>{product.resistance} мОм</span>
                </p>
            </div>
           
            <div className="cartItem__stepper">
                <button className="cartItem__btn--minus" onClick={handleMinus}>
                    <img src={minusIcon} alt="minus" />
                </button>
                
                <input 
                    type="number" 
                    className="stepper__input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    min="1"
                />
                
                <button className="cartItem__btn--plus" onClick={handlePlus}>
                    <img src={plusIcon} alt="plus" />
                </button>
            </div>
            
            <p className="cartItem__price">
                {price * value} 
                <img src={rubleBlue} alt="ruble icon " />
            </p>
            
            <button 
                className="cartItem__bin-btn" 
                onClick={() => removeFromCart(product.id)}
            >
                <img src={bin} alt="bin icon" />
            </button>
        </div>
    );
}