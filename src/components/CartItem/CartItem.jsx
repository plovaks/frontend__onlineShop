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
        // Получаем введенное значение
        let rawValue = e.target.value;
        
        // Удаляем всё, кроме цифр (оставляем только 0-9)
        let cleanValue = rawValue.replace(/\D/g, '');
        
        // Если после очистки пустая строка - ставим 1
        if (cleanValue === '') {
            cleanValue = '1';
        }
        
        // Преобразуем в число
        let newValue = parseInt(cleanValue, 10);
        
        // Проверка на NaN (на всякий случай)
        if (isNaN(newValue)) {
            newValue = 1;
        }
        
        // Ограничиваем минимальное значение
        if (newValue < 1) {
            newValue = 1;
        }
        
        // Опционально: максимальное значение (например, 999)
        if (newValue > 999) {
            newValue = 999;
        }
        
        setInputValue(newValue);
        addToCart(product, newValue);
    };

    const handleInputBlur = () => {
        if (inputValue !== value) {
            addToCart(product, inputValue);
        }
    };

    // Запрещаем вставку текста
    const handlePaste = (e) => {
        e.preventDefault();
        return false;
    };

    // Запрещаем ввод нецифровых символов с клавиатуры
    const handleKeyDown = (e) => {
        // Разрешаем клавиши управления
        const allowedKeys = [
            'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 
            'Home', 'End'
        ];
        
        if (allowedKeys.includes(e.key)) {
            return;
        }
        
        // Разрешаем цифры
        if (/^[0-9]$/.test(e.key)) {
            return;
        }
        
        
        e.preventDefault();
    };

    return (
        <div className="cartItem">
            <img 
                src={product.img} 
                alt={name} 
                className="cart__image"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
            />
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
                    type="text" 
                    className="stepper__input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onPaste={handlePaste}
                    onKeyDown={handleKeyDown}
                    inputMode="numeric"
                    pattern="\d*"
                    placeholder="1"
                />
                
                <button className="cartItem__btn--plus" onClick={handlePlus}>
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