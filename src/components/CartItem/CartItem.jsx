import React, { useState, useEffect } from "react";
import { useCart } from "../CartContext";
import bin from "../../assets/icons/bin.svg";
import plusIcon from "../../assets/icons/plus.svg";
import minusIcon from "../../assets/icons/minus.svg";
import rubleBlue from "../../assets/icons/rubleBlue.svg";
import "./CartItem.css";

export default function CartItem({ product, img, name, capacity, voltage, resistance, value, price }) {
    const { updateQuantity, removeFromCart } = useCart();
    const [inputValue, setInputValue] = useState(value);
    const maxStock = product.stock || 0;

    // Синхронизация локального состояния с пропсом value
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleMinus = () => {
        if (value > 1) {
            const newValue = value - 1;
            updateQuantity(product.id, newValue, maxStock);
        } else {
            removeFromCart(product.id);
        }
    };

    const handlePlus = () => {
        const newValue = value + 1;
        if (newValue <= maxStock) {
            updateQuantity(product.id, newValue, maxStock);
        } else {
            alert(`Недостаточно товара. В наличии: ${maxStock} шт.`);
        }
    };

    const handleInputChange = (e) => {
        let rawValue = e.target.value;
        let cleanValue = rawValue.replace(/\D/g, '');
        
        if (cleanValue === '') {
            updateQuantity(product.id, 1, maxStock);
            return;
        }
        
        let newValue = parseInt(cleanValue, 10);
        if (isNaN(newValue)) newValue = 1;
        if (newValue < 1) newValue = 1;
        
        if (newValue > maxStock && maxStock > 0) {
            alert(`Недостаточно товара. В наличии: ${maxStock} шт.`);
            newValue = maxStock;
        }
        
        updateQuantity(product.id, newValue, maxStock);
    };

    const handlePaste = (e) => {
        e.preventDefault();
    };

    const handleKeyDown = (e) => {
        const allowedKeys = [
            'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 
            'Home', 'End'
        ];
        
        if (allowedKeys.includes(e.key)) return;
        if (/^[0-9]$/.test(e.key)) return;
        
        e.preventDefault();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.target.blur();
        }
    };

    return (
        <div className="cartItem">
            <img 
                src={img || product.img || ''}  
                alt={name} 
                className="cart__image"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
            />
            <div className="cartItem__info">
                <h4 className="cartItem__title">{product.name || name}</h4>
                <p className="cartItem__desc">
                    <span>{product.capacity || capacity} мАч, </span>
                    <span>{product.voltage || voltage} В, </span>
                    <span>{product.resistance || resistance} мОм</span>
                </p>
                {maxStock > 0 && (
                    <p className="cartItem__stock" style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        В наличии: {maxStock} шт.
                    </p>
                )}
            </div>
           
            <div className="cartItem__stepper">
                <button 
                    className="cartItem__btn--minus" 
                    onClick={handleMinus} 
                    disabled={value <= 1}
                >
                    <img src={minusIcon} alt="minus" />
                </button>
                
                <input 
                    type="text" 
                    className="stepper__input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onPaste={handlePaste}
                    onKeyDown={handleKeyDown}
                    onKeyPress={handleKeyPress}
                    inputMode="numeric"
                    pattern="\d*"
                    placeholder="1"
                />
                
                <button 
                    className="cartItem__btn--plus" 
                    onClick={handlePlus} 
                    disabled={value >= maxStock && maxStock > 0}
                >
                    <img src={plusIcon} alt="plus" />
                </button>
            </div>
            
            <p className="cartItem__price">
                {price * value} 
                <img src={rubleBlue} alt="ruble icon" />
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