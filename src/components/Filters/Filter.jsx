import React, { useState, useRef, useEffect } from "react";
import arrow from "../../assets/icons/filterArrow.svg";
import './Filter.css';

export default function Filter({ name, options, selectedOptions, onFilterChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const filterRef = useRef(null);

    // Закрытие при клике вне фильтра
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Закрытие при нажатии ESC
        const handleEsc = (event) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen]);

    return (
        <div className="filter__container" ref={filterRef}>
            <button className="filter__btn" onClick={() => setIsOpen(!isOpen)}>
                <p className="filter__name">{name}</p>
                <img 
                    src={arrow} 
                    alt="filter arrow" 
                    style={{ 
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: '0.3s' 
                    }}
                />
            </button>

            {isOpen && (
                <div className="filter__dropdown">
                    {options.length > 0 ? (
                        options.map((option, index) => (
                            <label key={index} className="filter__option">
                                <div>
                                    <input 
                                        className="filter__checkbox-real"
                                        type="checkbox" 
                                        checked={selectedOptions.includes(option)} 
                                        onChange={() => onFilterChange(option)}
                                    />
                                    <span className="filter__checkbox-custom"></span> 
                                </div>
                                <span>{option}</span>
                            </label>
                        ))
                    ) : (
                        <div className="filter__empty">Нет вариантов</div>
                    )}
                </div>
            )}
        </div>
    );
}