import { useState } from "react"
import { useAuth } from "../AuthContext";
import { useNavigate } from 'react-router-dom'
import './AuthModal.css'

export default function AuthModal({ onClose }) {
    const [isActive, setIsActive] = useState('login');
    const { login, register } = useAuth(); // ← добавили register
    const [fullName, setFullName] = useState('');
    const [pswd, setPswd] = useState('');
    const [confirmPswd, setConfirmPswd] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidFullName = (name) => {
        const nameRegex = /^[A-Za-zА-Яа-я\s\-]{2,50}$/;
        return nameRegex.test(name.trim());
    };

    const isValidPassword = (password) => {
        return password.length >= 6;
    };

    const handleActiveAction = (tab) => {
        setIsActive(tab);
        setError('');
        setFullName('');
        setEmail('');
        setPswd('');
        setConfirmPswd('');
    }

    async function handleRegisterSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!fullName.trim()) {
            setError('Введите ваше ФИО');
            setLoading(false);
            return;
        }
        if (!isValidFullName(fullName)) {
            setError('ФИО должно содержать только буквы, пробелы и дефисы (2-50 символов)');
            setLoading(false);
            return;
        }
        if (!email.trim()) {
            setError('Введите email');
            setLoading(false);
            return;
        }
        if (!isValidEmail(email)) {
            setError('Введите корректный email');
            setLoading(false);
            return;
        }
        if (!pswd) {
            setError('Введите пароль');
            setLoading(false);
            return;
        }
        if (!isValidPassword(pswd)) {
            setError('Пароль должен содержать минимум 6 символов');
            setLoading(false);
            return;
        }
        if (pswd !== confirmPswd) {
            setError('Пароли не совпадают');
            setLoading(false);
            return;
        }

        try {
            const result = await register(fullName.trim(), email, pswd);
            if (result.success) {
                onClose();
                navigate('/profile');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Ошибка соединения с сервером');
        } finally {
            setLoading(false);
        }
    }

    async function handleLoginSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email.trim()) {
            setError('Введите email');
            setLoading(false);
            return;
        }
        if (!isValidEmail(email)) {
            setError('Введите корректный email');
            setLoading(false);
            return;
        }
        if (!pswd) {
            setError('Введите пароль');
            setLoading(false);
            return;
        }

        try {
            const result = await login(email, pswd);
            if (result.success) {
                onClose();
                navigate('/profile');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Ошибка соединения с сервером');
        } finally {
            setLoading(false);
        }
    }

    return (
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
                            <button type="submit" disabled={loading}>
                                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                            </button>
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
                            <button type="submit" disabled={loading}>
                                {loading ? 'Вход...' : 'Войти в аккаунт'}
                            </button>
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