import React from "react";
import './Order.css'
import rubleBlue from "../../assets/icons/rubleBlue.svg"
export default function Order({orderName, orderPrice}){
    return(
        <div className="order">
            <p className="order__name">{orderName}</p>
            <p className="order__price">
                {orderPrice}
                <img src={rubleBlue} alt="ruble icon" />
            </p>
        </div>
    )
}