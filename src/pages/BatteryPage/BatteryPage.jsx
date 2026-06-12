import React, { useState, useEffect, useRef } from "react"; 
import { useParams, useNavigate } from "react-router-dom"; 
import './BatteryPage.css'
import AddToCart from "../../components/AddToCart/AddToCart";

export default function BatteryPage({ isModal }) {
    const { id } = useParams(); 
    const [product, setProduct] = useState(null);
    const [activeImg, setActiveImg] = useState("");
    const SERVER_URL = 'https://power-store-plovaks.amvera.io';
    const navigate = useNavigate();

    const imgArrRef = useRef(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/api/products/${id}`);
                if (!response.ok) throw new Error("Товар не найден");
                const data = await response.json();
                setProduct(data);
                if (data.images?.length > 0) {
                    setActiveImg(`${SERVER_URL}${data.images[0].url}`);
                }
            } catch (error) {
                console.error("Ошибка загрузки товара:", error);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (isModal) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isModal]); 

    useEffect(() => {
        const el = imgArrRef.current;
        if (!el) return;
        const checkArrows = () => {
            setShowLeft(el.scrollLeft > 4);
            setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
        };
        checkArrows();
        el.addEventListener('scroll', checkArrows);
        window.addEventListener('resize', checkArrows);
        return () => {
            el.removeEventListener('scroll', checkArrows);
            window.removeEventListener('resize', checkArrows);
        };
    }, [product]);

    const scroll = (dir) => {
        imgArrRef.current?.scrollBy({ left: dir * 80, behavior: 'smooth' });
    };

const handleClose = () => {
  navigate(-1);
};

   const handleOverlayClick = (e) => {
  if (e.target.classList.contains('battery__modal-overlay')) {
    handleClose();
  }
};

    if (!product) {
        return <div className="loading">Загрузка данных...</div>;
    }

    const content = (
        <div className="battery__container">
            {isModal && <button className="close-btn" onClick={handleClose}>×</button>}
            
            <div className="battery__buy">
                <div className="battery__specs">
                    <div className="battery__images">
                        <img 
                            src={activeImg} 
                            alt="battery main" 
                            className="battery__mainImg"
                        />
                        <div className="battery__imgArr-wrapper">
                            {showLeft && (
                                <button className="imgArr__btn imgArr__btn--left" onClick={() => scroll(-1)}>‹</button>
                            )}
                            <div className="battery__imgArr" ref={imgArrRef}>
                                {product.images?.map((img, index) => (
                                    <img 
                                        key={index}
                                        src={`${SERVER_URL}${img.url}`} 
                                        alt="extra" 
                                        className={`battery__optionalImg ${activeImg === `${SERVER_URL}${img.url}` ? 'active-thumb' : ''}`}
                                        onClick={() => setActiveImg(`${SERVER_URL}${img.url}`)}
                                    />
                                ))}
                            </div>
                            {showRight && (
                                <button className="imgArr__btn imgArr__btn--right" onClick={() => scroll(1)}>›</button>
                            )}
                        </div>
                    </div>

                    <div className="battery__info">
                        <h3 className="battery__title">{product.name} {product.model}</h3>
                        <div className="battery__desc">
                            Характеристики:
                            {product.specs.map((spec, index) => (
                                <p key={index} className="battery__spec">
                                    <span>{spec.name} :</span> {spec.value} {spec.unit}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="battery__order">
                    <AddToCart
                        product={product} 
                        price={Math.trunc(product.price)}
                        // salePrice={Math.trunc(product.price) - 10} 
                    />
                </div>
            </div>
        </div>
    );

    return isModal ? (
        <div className="battery__modal-overlay" onClick={handleOverlayClick}>
            <div className="battery__modal-content">
                {content}
            </div>
        </div>
    ) : content;
}