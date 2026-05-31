import React from "react";
import { HashLink } from "react-router-hash-link";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import arrow from "../../assets/icons/arrowRight.svg"
import centralImg from "../../assets/images/main-page-central.svg"
import leftRed from "../../assets/images/main-page-leftRed.png"
import leftYellow from "../../assets/images/main-page-leftYellow.png"
import rightRed from "../../assets/images/main-page-rightRed.png"
import rightYellow from "../../assets/images/main-page-rightYellow.png"
import Header from "../../components/Header/Header";
import './HomePage.css'



const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};


export default function HomePage(){
    const [isVK, setIsVK] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef(null);
    const isMobileOrientation = useMediaQuery('(max-width: 768px)');
    // Parallax эффект для центральной батарейки
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });
    
    const centralScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);
    
    useEffect(() => {
        const checkVK = () => {
            const inVK = window.location.search.includes('vk_access_token') || 
                        window.location.href.includes('vk.com') ||
                        navigator.userAgent.includes('VK');
            setIsVK(inVK);
            setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
        };
        checkVK();
    }, []);
    
    const needsVKPadding = isVK && isMobile;
   

    return(
        <main 
            ref={containerRef}
            className={needsVKPadding ? "homePage-vk": "homePage"} 
            id='home'
        >
            <Header needsVKPadding={needsVKPadding} />
            
            <div className="main-page-container">
                <div className="main-page">
                    <div className="main-page__content">
                        {/* Анимированный заголовок */}
                        <motion.h1 
                            className="main-page__title"
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ 
                                opacity: 1, 
                                y: 0,
                                textShadow: [
                                    "0 0 0px rgba(255,255,255,0)",
                                    "0 0 20px rgba(255,255,255,0.8)",
                                    "0 0 0px rgba(255,255,255,0)"
                                ],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{ 
                                duration: 0.8,
                                ease: "easeOut",
                                textShadow: {
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                },
                                scale: {
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }
                            }}
                        >
                            POWER STORE
                        </motion.h1>
                        
                        <div className="main-page__text">
                            <h4 className="main-page__text--advantage">
                                Высококачественные 
                            </h4>
                            <h4 className="main-page__text--advantage">аккумуляторы</h4>
                        </div>
                        
                        <div className="main-page__info">
                            <p className="main-page__desc">Магазин аккумуляторных батарей и портативных электростанций</p>
                            
                            <div className="main-page__btnSection">
                                <HashLink smooth to="/#catalog">
                                    <button className="btn main-page__btn--buy">
                                        К покупкам
                                    </button>
                                </HashLink>
                                
                                <p className="main-page__sales">скидки при покупке от 3 штук</p>
                            </div>
                        </div>
                        
                        <div className="main-page__images">
                            {/* Увеличенная центральная батарейка с анимацией */}
                            <motion.img 
                                className="main-page__image--centered" 
                                src={centralImg} 
                                alt="central batteries"
                                style={{ scale: centralScale }}
                                {...(!isMobileOrientation && {
                                    animate: { y: [0, -10, 0] },
                                    transition: { 
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        ease: "easeInOut"
                                    }
                                })}
                            />
                            
                            <img 
                                className="main-page__image__leftRed" 
                                src={leftRed} 
                                alt="left red battery"
                            />
                            
                            <img 
                                className="main-page__image__leftYellow" 
                                src={leftYellow} 
                                alt="left yellow battery"
                            />
                            
                            <img 
                                className="main-page__image__rightRed" 
                                src={rightRed} 
                                alt="right red battery"
                            />
                            
                            <img 
                                className="main-page__image__rightYellow" 
                                src={rightYellow} 
                                alt="right yellow battery"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}