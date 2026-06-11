import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        const hasConsent = localStorage.getItem('privacyConsent');
        if (!hasConsent) {
            setLoading(false);
            return;
        }

        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');

        //Если есть сохранённый access token используем его сразу
        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
            setLoading(false);
            return;
        }

        //Если access token нет, но есть refresh — обновляем
        if (savedUser && refreshToken) {
            fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.token) {
                        setUser(JSON.parse(savedUser));
                        setToken(data.token);
                        localStorage.setItem('token', data.token);
                    } else {
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                    }
                })
                .catch(() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    function login(userData, accessToken, refreshToken) {
        setUser(userData);
        setToken(accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    function logout() {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}