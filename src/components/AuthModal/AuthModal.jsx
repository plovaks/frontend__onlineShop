import { useState } from "react"
import { useAuth } from "../AuthContext";
import {useNavigate} from 'react-router-dom'
import './AuthModal.css'


export default function AuthModal({onClose}){
    const [isActive, setIsActive] = useState('login');
    const {login} = useAuth();
    const [fullName, setFullName] = useState('');
    const [pswd, setPswd] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleActiveAction = (tab) => {
        setIsActive(tab);
        setError('');
    }

    function handleRegisterSubmit(e) {
        e.preventDefault();

        const registerUser = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ full_name: fullName, email, password: pswd })
                })
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error);
                    return;
                }
                login(data.customer, data.token, data.refreshToken);
                onClose();
            } catch (err) {
                setError('Ошибка соединения с сервером');
            }
        }
        registerUser();
    }

    function handleLoginSubmit(e) {
        e.preventDefault();

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
                                <input type="text" id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)}/>
                            </label>
                            <label htmlFor="email">
                                Почта
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </label>
                            <label htmlFor="pswd">
                                Пароль
                                <input type="password" id="pswd" value={pswd} onChange={(e) => setPswd(e.target.value)}/>
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
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </label>
                            <label htmlFor="pswd">
                                Пароль
                                <input type="password" id="pswd" value={pswd} onChange={(e) => setPswd(e.target.value)}/>
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
