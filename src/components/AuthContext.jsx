import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Проверка, истёк ли токен
function isTokenExpired(token) {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
}

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

        // Если есть сохранённый access token и он не истёк — используем сразу
        if (savedUser && savedToken && !isTokenExpired(savedToken)) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
            setLoading(false);
            return;
        }

        // Если access token истёк или отсутствует, но есть refresh — обновляем
        if (savedUser && refreshToken) {
            fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            })
                .then(res => {
                    if (!res.ok) throw new Error('Refresh failed');
                    return res.json();
                })
                .then(data => {
                    if (data.token) {
                        setUser(JSON.parse(savedUser));
                        setToken(data.token);
                        localStorage.setItem('token', data.token);
                    } else {
                        throw new Error('No token in response');
                    }
                })
                .catch(() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    setUser(null);
                    setToken(null);
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