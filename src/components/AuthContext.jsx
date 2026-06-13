import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Проверка авторизации при загрузке
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/customer/me`, {
                    credentials: 'include'  // ← куки отправляются автоматически
                });
                
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Ошибка проверки авторизации:', err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        
        checkAuth();
    }, []);

    async function login(email, password) {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            
            if (res.ok) {
                const data = await res.json();
                setUser(data.customer);
                return { success: true };
            } else {
                const error = await res.json();
                return { success: false, error: error.error };
            }
        } catch (err) {
            return { success: false, error: 'Ошибка соединения' };
        }
    }

    async function register(full_name, email, password) {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ full_name, email, password })
            });
            
            if (res.ok) {
                const data = await res.json();
                setUser(data.customer);
                return { success: true };
            } else {
                const error = await res.json();
                return { success: false, error: error.error };
            }
        } catch (err) {
            return { success: false, error: 'Ошибка соединения' };
        }
    }

    async function logout() {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (err) {
            console.error('Ошибка при выходе:', err);
        } finally {
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}