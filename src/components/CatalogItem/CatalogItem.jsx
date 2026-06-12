import React from "react";
import "./CatalogItem.css";
import cartIcon from "../../assets/icons/whiteCart.svg";
import { useCart } from "../CartContext";

export default function CatalogItem({
  id,
  img,
  name,
  capcity,
  voltage,
  resistance,
  price,
  stock,
}) {
  
  const { addToCart, cart } = useCart();
  const isInCart = cart.some(item => item.id === id);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!stock || stock <= 0) {
      console.log("Товар отсутствует на складе");
      return;
    }

    const productToAdd = {
        id,
        img,
        name,
        price,
        capacity: capcity,    
        voltage: voltage,      
        resistance: resistance,
        stock: stock
    };
    
    console.log("Добавляем товар:", productToAdd);
    addToCart(productToAdd, 1);
  };

  return (
    <>
      {/* Десктоп */}
      <div className="item">
        <img src={img} alt="" className="item__img" />

        <p className="item__name">{name}</p>

        <p className="item__capacity">{capcity}</p>

        <p className="item__voltage">{voltage}</p>

        <p className="item__resistance">{resistance}</p>

        <p className="item__price">{Math.round(price)} ₽</p>

        

        {!stock || stock <= 0 ? (
          <button className="item__cart--btn disabled" disabled>
            Нет в наличии
          </button>
        ) : isInCart ? (
          <div className="item__added">
            В корзине
          </div>
        ) : (
          <button
            className="item__cart--btn"
            onClick={handleAddToCart}
          >
            <img src={cartIcon} alt="cart" />
          </button>
        )}
      </div>

      {/* Мобильная карточка */}
      <div className="item__mobile">
        <div className="item__mobile--main">
          <img src={img} alt="item" className="item__img" />

          <div>
            <p className="item__name">{name}</p>

            <div className="item__mobile--characteristics">
              <p>Емкость: {capcity} мАч</p>
              <p>Напряжение: {voltage} В</p>
              <p>Сопротивление: {resistance} мОм</p>
              <p className={stock > 0 ? 'in-stock' : 'out-stock'}>
                {stock > 0 ? `В наличии: ${stock} шт.` : 'Нет в наличии'}
              </p>
            </div>
          </div>
        </div>

        <div className="item__mobile-footer">
          <p className="item__price">
            {Math.round(price)} ₽
          </p>

          {!stock || stock <= 0 ? (
            <button className="item__cart--btn disabled" disabled>
              Нет в наличии
            </button>
          ) : isInCart ? (
            <div className="item__added">
              В корзине
            </div>
          ) : (
            <button
              className="item__cart--btn"
              onClick={handleAddToCart}
            >
              <img src={cartIcon} alt="" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}