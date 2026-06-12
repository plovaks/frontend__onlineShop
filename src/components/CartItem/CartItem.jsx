import React from "react";
import { useCart } from "../CartContext";
import "./CartItem.css";
import deleteIcon from "../../assets/icons/delete.svg";

export default function CartItem({ product }) {
    const { updateQuantity, removeFromCart } = useCart();
    
    const handleDecrease = () => {
        const newQuantity = product.quantity - 1;
        if (newQuantity >= 1) {
            updateQuantity(product.id, newQuantity, product.stock);
        } else {
            removeFromCart(product.id);
        }
    };
    
    const handleIncrease = () => {
        const newQuantity = product.quantity + 1;
        if (newQuantity <= product.stock) {
            updateQuantity(product.id, newQuantity, product.stock);
        } else {
            alert(`Недостаточно товара. В наличии: ${product.stock} шт.`);
        }
    };
    
    const handleRemove = () => {
        removeFromCart(product.id);
    };
    
    const handleQuantityChange = (e) => {
        let newQuantity = parseInt(e.target.value);
        if (isNaN(newQuantity)) newQuantity = 1;
        if (newQuantity < 1) {
            removeFromCart(product.id);
        } else if (newQuantity <= product.stock) {
            updateQuantity(product.id, newQuantity, product.stock);
        } else {
            alert(`Недостаточно товара. В наличии: ${product.stock} шт.`);
        }
    };
    
    const itemTotal = product.price * product.quantity;
    
    return (
        <div className="cart-item">
            <div className="cart-item__info">
                <img 
                    src={product.images?.[0]?.url ? `${import.meta.env.VITE_API_URL}${product.images[0].url}` : product.img} 
                    alt={product.name} 
                    className="cart-item__img"
                />
                <div className="cart-item__details">
                    <p className="cart-item__name">{product.name}</p>
                    <p className="cart-item__specs">
                        {product.capacity && `Емкость: ${product.capacity} мАч`}
                        {product.voltage && ` | Напряжение: ${product.voltage} В`}
                        {product.resistance && ` | Сопротивление: ${product.resistance} мОм`}
                    </p>
                    <p className="cart-item__stock">
                        {product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Нет в наличии'}
                    </p>
                </div>
            </div>
            
            <div className="cart-item__controls">
                <div className="cart-item__quantity">
                    <button 
                        className="cart-item__qty-btn" 
                        onClick={handleDecrease}
                        disabled={product.quantity <= 1}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        className="cart-item__qty-input"
                        value={product.quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        max={product.stock}
                    />
                    <button 
                        className="cart-item__qty-btn" 
                        onClick={handleIncrease}
                        disabled={product.quantity >= product.stock}
                    >
                        +
                    </button>
                </div>
                
                <p className="cart-item__price">{itemTotal} ₽</p>
                
                <button className="cart-item__delete" onClick={handleRemove}>
                    <img src={deleteIcon} alt="Удалить" />
                </button>
            </div>
        </div>
    );
}