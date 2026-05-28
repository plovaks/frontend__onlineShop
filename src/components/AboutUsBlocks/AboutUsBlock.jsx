import React from "react";
import './AboutUsBlock.css'
export default function AboutUsBlock(props){
    return(
        <>
        <div className="aboutUs__container">
            <div className="aboutUs__imgBlock">
                <img src={props.img} alt="blok img" className="aboutUs__img"/>
                <p className="aboutUs__pros">{props.innerText}</p>
            </div>
            <p className="aboutUs__desc">{props.description}</p>
        </div>
        
        </>
        
    )
}

