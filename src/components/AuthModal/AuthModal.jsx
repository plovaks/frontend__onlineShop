import { useState } from "react"
import { useAuth } from "../AuthContext";
import {useNavigate} from 'react-router-dom'
import './AuthModal.css'

export default function AuthModal({onClose}){
    const [isActive, setIsActive] = useState('login');
    const {login} = useAuth();
    const [fullName, setFullName] = useState('');
    const [pswd, setPswd] = useState('');
    const [confirmPswd, setConfirmPswd] = useState(''); // Добавляем подтверждение пароля
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    

    // Функция валидации email (проверяет формат, но не существование)
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Функция валидации ФИО (только буквы, пробелы и дефисы)
    const isValidFullName = (name) => {
        const nameRegex = /^[A-Za-zА-Яа-я\s\-]{2,50}$/;
        return nameRegex.test(name.trim());
    };

    // Функция валидации пароля (минимум 6 символов, хотя бы одна цифра и буква)
    const isValidPassword = (password) => {
        return password.length >= 6;
    };

    const handleActiveAction = (tab) => {
        setIsActive(tab);
        setError('');
        // Очищаем поля при переключении
        setFullName('');
        setEmail('');
        setPswd('');
        setConfirmPswd('');
    }

    function handleRegisterSubmit(e) {
        e.preventDefault();
        setError('');

        // Валидация ФИО
        if (!fullName.trim()) {
            setError('Введите ваше ФИО');
            return;
        }
        if (!isValidFullName(fullName)) {
            setError('ФИО должно содержать только буквы, пробелы и дефисы (2-50 символов)');
            return;
        }

        // Валидация email
        if (!email.trim()) {
            setError('Введите email');
            return;
        }
        if (!isValidEmail(email)) {
            setError('Введите корректный email');
            return;
        }

        // Валидация пароля
        if (!pswd) {
            setError('Введите пароль');
            return;
        }
        if (!isValidPassword(pswd)) {
            setError('Пароль должен содержать минимум 6 символов');
            return;
        }

        // Проверка совпадения паролей
        if (pswd !== confirmPswd) {
            setError('Пароли не совпадают');
            return;
        }

        const registerUser = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ full_name: fullName.trim(), email, password: pswd })
                })
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error);
                    return;
                }
                login(data.customer, data.token, data.refreshToken);
                onClose();
                navigate('/profile');
            } catch (err) {
                setError('Ошибка соединения с сервером');
            }
        }
        registerUser();
    }

    function handleLoginSubmit(e) {
        e.preventDefault();
        setError('');

        // Валидация email
        if (!email.trim()) {
            setError('Введите email');
            return;
        }
        if (!isValidEmail(email)) {
            setError('Введите корректный email');
            return;
        }

        // Валидация пароля
        if (!pswd) {
            setError('Введите пароль');
            return;
        }

        const loginUser = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password: pswd })
                })
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error);
                    return;
                }
                login(data.customer, data.token, data.refreshToken);
                onClose();
                navigate('/profile')
            } catch (err) {
                setError('Ошибка соединения с сервером');
            }
        }
        loginUser();
    }

    return(
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>{isActive === 'login' ? 'Вход' : 'Регистрация'}</h2>

                {error && <p className="modal__error">{error}</p>}

                {isActive === 'register' && (
                    <>
                        <form className="form__register" onSubmit={handleRegisterSubmit}>
                            <label htmlFor="full_name">
                                ФИО
                                <input 
                                    type="text" 
                                    id="full_name" 
                                    value={fullName} 
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Иванов Иван Иванович"
                                    autoComplete="name"
                                />
                            </label>
                            <label htmlFor="email">
                                Почта
                                <input 
                                    type="email" 
                                    id="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@mail.com"
                                    autoComplete="email"
                                />
                            </label>
                            <label htmlFor="pswd">
                                Пароль
                                <input 
                                    type="password" 
                                    id="pswd" 
                                    value={pswd} 
                                    onChange={(e) => setPswd(e.target.value)}
                                    placeholder="минимум 6 символов"
                                    autoComplete="new-password"
                                />
                            </label>
                            <label htmlFor="confirmPswd">
                                Подтверждение пароля
                                <input 
                                    type="password" 
                                    id="confirmPswd" 
                                    value={confirmPswd} 
                                    onChange={(e) => setConfirmPswd(e.target.value)}
                                    placeholder="повторите пароль"
                                    autoComplete="new-password"
                                />
                            </label>
                            <button type="submit">Зарегистрироваться</button>
                        </form>
                        <div className="modal__switch">Уже есть аккаунт?
                            <button type="button" onClick={() => handleActiveAction('login')}>Войти</button>
                        </div>
                    </>
                )}

                {isActive === 'login' && (
                    <>
                        <form className="form__login" onSubmit={handleLoginSubmit}>
                            <label htmlFor="email">
                                Почта
                                <input 
                                    type="email" 
                                    id="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@mail.com"
                                    autoComplete="email"
                                />
                            </label>
                            <label htmlFor="pswd">
                                Пароль
                                <input 
                                    type="password" 
                                    id="pswd" 
                                    value={pswd} 
                                    onChange={(e) => setPswd(e.target.value)}
                                    placeholder="введите пароль"
                                    autoComplete="current-password"
                                />
                            </label>
                            <button type="submit">Войти в аккаунт</button>
                        </form>
                        <div className="modal__switch">Нет аккаунта?
                            <button type="button" onClick={() => handleActiveAction('register')}>Зарегистрироваться</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}