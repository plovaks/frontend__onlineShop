import React from "react";
import logo from "../../assets/images/logo.svg";
import profile from "../../assets/icons/profile.svg";
import cart from "../../assets/icons/cart.svg";
import search from "../../assets/icons/search.svg";
import DropdownMenu from "../DropdownMenu/DropdownMenu.jsx";
import AuthModal from "../AuthModal/AuthModal.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useCart } from "../CartContext.jsx";
import { useAuth } from "../AuthContext.jsx";
import { useState, useEffect } from "react";
import "./Header.css";

export default function Header({ className, needsVKPadding }) {
    const { uniqueCount } = useCart();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user, logout } = useAuth(); // ← убрали token
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loadingAdmin, setLoadingAdmin] = useState(true);

    const showDropdown = location.pathname === "/cart" || location.pathname === "/profile";

    const [isVK, setIsVK] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkVK = () => {
            const inVK =
                window.location.search.includes("vk_access_token") ||
                window.location.href.includes("vk.com") ||
                window.location.href.includes("vk\\.com");
            setIsVK(inVK);

            setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
        };

        checkVK();
    }, []);

    // Проверка прав администратора (с использованием куки)
    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!user) {
                setIsAdmin(false);
                setLoadingAdmin(false);
                return;
            }

            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/customer/me`, {
                    credentials: "include", // ← отправляем куки автоматически
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log("is_admin:", data.is_admin);
                    setIsAdmin(data.is_admin || false);
                } else {
                    setIsAdmin(false);
                }
            } catch (err) {
                console.error("Ошибка проверки прав администратора:", err);
                setIsAdmin(false);
            } finally {
                setLoadingAdmin(false);
            }
        };

        checkAdminStatus();
    }, [user]); // ← только user, token не нужен

    const headerStyle = needsVKPadding ? { paddingTop: "44px" } : {};

    const handleProfileClick = () => {
        if (user) {
            navigate("/profile");
        } else {
            setIsModalOpen(true);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleLogoClick = (e) => {
        if (location.pathname === "/") {
            e.preventDefault();
            scrollToTop();
        } else {
            setTimeout(() => {
                scrollToTop();
            }, 100);
        }
    };

    return (
        <header className={className} style={headerStyle}>
            <Link to="/" className="header__logo" onClick={handleLogoClick}>
                <img className="header__logo--img" src={logo} alt="logo" />
                <div className="header__logo--text">
                    <p className="header__logo--name">Power</p>
                    <p className="header__logo--name">Store</p>
                </div>
                {showDropdown && <div className="header__dropdown">Вернуться на главную</div>}
            </Link>
            <div className="header__container">
                <input type="text" placeholder="18700" />
                <img src={search} alt="search icon" className="icon header__search--icon" />
            </div>

            <nav className="header__menu">
                <ul>
                    <li>
                        <Link
                            to="/"
                            onClick={() => {
                                if (location.pathname === "/") {
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }
                            }}
                        >
                            Главная
                        </Link>
                    </li>
                    <li className="dropdown-container">
                        <DropdownMenu>
                            <HashLink smooth to="/#about">О нас</HashLink>
                            <HashLink smooth to="/#catalog">Каталог</HashLink>
                            <Link to="/cart">Корзина</Link>
                            {!loadingAdmin && isAdmin && <Link to="/admin">Админ</Link>}
                        </DropdownMenu>
                    </li>
                </ul>
                <div className="nav__user-actions">
                    {user ? (
                        <div className="user-menu">
                            <div
                                className="profile__image"
                                onClick={() => handleProfileClick()}
                                role="button"
                                tabIndex={0}
                            >
                                {user.full_name?.charAt(0).toUpperCase() ||
                                    user.email?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    ) : (
                        <button className="header__profile-btn" onClick={() => handleProfileClick()}>
                            <img className="icon header__icon--profile" src={profile} alt="profile icon" />
                        </button>
                    )}

                    <Link to="/cart" className="header__cart-link">
                        <button className="header__cart-btn">
                            {uniqueCount > 0 && (
                                <span className="cart-badge-container">{uniqueCount}</span>
                            )}
                            <img className="icon header__icon--cart" src={cart} alt="cart icon" />
                        </button>
                    </Link>
                </div>
            </nav>
            {isModalOpen && <AuthModal onClose={() => setIsModalOpen(false)} />}
        </header>
    );
}