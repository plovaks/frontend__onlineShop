import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './DropdownMenu.css';

export default function DropdownMenu({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    // Закрытие при клике вне меню
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Закрытие при смене страницы
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    
    const childrenWithHandler = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                onClick: () => {
                    setIsOpen(false);
                }
            });
        }
        return child;
    });

    return (
        <div className="dropdown" ref={dropdownRef}>
            <div onClick={toggleMenu} className="dropdown__menu">
                Меню
            </div>

            {isOpen && (
                <div className="dropdown_items">
                    {childrenWithHandler}
                </div>
            )}
        </div>
    );
}