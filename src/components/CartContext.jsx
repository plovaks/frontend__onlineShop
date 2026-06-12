import { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const addToCart = (product, quantity) => {
        // Проверка наличия товара (используем stock)
        if (!product.stock || product.stock <= 0) {
            console.log("Товар отсутствует на складе");
            return;
        }
        
        // Нельзя добавить больше, чем есть в наличии
        if (quantity > product.stock) {
            console.log(`Недостаточно товара. В наличии: ${product.stock} шт.`);
            return;
        }

        setCart(prev => {
            const isExist = prev.find(item => item.id === product.id);
            if (isExist) {
                const newQuantity = isExist.quantity + quantity;
                if (newQuantity > product.stock) {
                    console.log(`Нельзя добавить больше ${product.stock} шт.`);
                    return prev;
                }
                return prev.map(item => 
                    item.id === product.id ? { ...item, quantity: newQuantity } : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const updateQuantity = (id, newQuantity, stock) => {
        if (newQuantity < 1) {
            removeFromCart(id);
            return;
        }
        if (newQuantity > stock) {
            console.log(`Недостаточно товара. В наличии: ${stock} шт.`);
            return;
        }
        setCart(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const clearCart = () => setCart([]);

    const uniqueCount = cart.length;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            updateQuantity,
            uniqueCount, 
            totalItems,
            clearCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);