import { createContext, useState, useContext, useEffect } from 'react';
const AuthContext = createContext();
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    useEffect(() => {
        const hasConsent = localStorage.getItem('privacyConsent');
        if (!hasConsent) return; 
        const savedUser = localStorage.getItem('user');
        const refreshToken = localStorage.getItem('refreshToken');
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
                } else {
                    
                    localStorage.removeItem('user');
                    localStorage.removeItem('refreshToken');
                }
            })
            .catch(() => {
                localStorage.removeItem('user');
                localStorage.removeItem('refreshToken');
            });
        }
    }, []);

    function login(userData, accessToken, refreshToken) {
        setUser(userData);
        setToken(accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('refreshToken', refreshToken);
    }

    function logout() {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}