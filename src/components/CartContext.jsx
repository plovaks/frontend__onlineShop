import {createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cart, setCart] = useState([]);

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const addToCart = (product, quantity) => {
        setCart(prev => {
            const isExsist = prev.find(item => item.id === product.id);
            if(isExsist){
                return prev.map(item => item.id === product.id ? { ...item, quantity } : item);
            }
            return [...prev, { ...product, quantity }];
        })
    }

    const clearCart = () => setCart([]);

    const uniqueCount = cart.length;

    return(
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, uniqueCount, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext);