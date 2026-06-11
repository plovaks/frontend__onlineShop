import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext.jsx';
import './AdminPanel.css';

export default function AdminPanel() {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'orders') {
            fetchOrders();
        }
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                setMessage('Ошибка загрузки пользователей');
            }
        } catch (err) {
            setMessage('Ошибка соединения');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            } else {
                setMessage('Ошибка загрузки заказов');
            }
        } catch (err) {
            setMessage('Ошибка соединения');
        } finally {
            setLoading(false);
        }
    };

    const toggleAdmin = async (userId, currentIsAdmin) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/toggle-admin`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ is_admin: !currentIsAdmin })
            });
            if (res.ok) {
                setMessage('Права обновлены');
                fetchUsers();
            } else {
                const error = await res.json();
                setMessage(error.error || 'Ошибка');
            }
        } catch (err) {
            setMessage('Ошибка соединения');
        }
    };

    if (loading) {
        return <div className="admin-loading">Загрузка...</div>;
    }

    return (
        <div className="admin-panel">
            <h1>Админ-панель</h1>
            
            {message && <div className="admin-message">{message}</div>}
            
            <div className="admin-tabs">
                <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                    Пользователи
                </button>
                <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                    Заказы
                </button>
            </div>
            
            {activeTab === 'users' && (
                <div className="admin-users">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ФИО</th>
                                <th>Email</th>
                                <th>Дата регистрации</th>
                                <th>Админ</th>
                                <th>Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.full_name}</td>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td>{user.is_admin ? 'да' : 'нет'}</td>
                                    <td>
                                        <button 
                                            className="admin-btn-toggle"
                                            onClick={() => toggleAdmin(user.id, user.is_admin)}
                                        >
                                            {user.is_admin ? 'Снять права' : 'Назначить админа'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {activeTab === 'orders' && (
                <div className="admin-orders">
                    {orders.length === 0 ? (
                        <p>Заказов пока нет</p>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="admin-order-card">
                                <div className="admin-order-header">
                                    <span><strong>Заказ №{order.id}</strong></span>
                                    <span>{new Date(order.order_date).toLocaleDateString()}</span>
                                    <span>{order.full_name}</span>
                                    <span>{order.email}</span>
                                    <span className="admin-order-total">{order.total_amount} ₽</span>
                                </div>
                                <div className="admin-order-items">
                                    {order.items.map(item => (
                                        <div key={item.id} className="admin-order-item">
                                            <span>{item.name}</span>
                                            <span>{item.quantity} шт.</span>
                                            <span>{item.price} ₽</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}