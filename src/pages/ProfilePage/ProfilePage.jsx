import { useEffect, useState } from 'react'
import { useAuth } from '../../components/AuthContext'
import { useNavigate } from 'react-router-dom'
import Header from "../../components/Header/Header.jsx"
import './ProfilePage.css'

export default function ProfilePage() {
    const { user, logout } = useAuth()  // ← убрали token
    const navigate = useNavigate()

    const [orders, setOrders] = useState([])
    const [ordersLoading, setOrdersLoading] = useState(true)
    const [editingField, setEditingField] = useState(null) 
    const [newName, setNewName] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [editError, setEditError] = useState('')
    const [expandedOrder, setExpandedOrder] = useState(null)

    useEffect(() => {
        if (!user) navigate('/')
    }, [user, navigate])

    useEffect(() => {
        if (!user) return
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/customer/orders`, {
                    credentials: 'include'
                })
                if (!res.ok) {
                    console.error('Ошибка загрузки заказов:', res.status)
                    return
                }
                const data = await res.json()
                console.log('Ответ сервера:', data)
                // Если пришёл объект, а не массив — оборачиваем
                const ordersData = Array.isArray(data) ? data : []
                setOrders(ordersData)
            } catch (err) {
                console.error('Ошибка загрузки заказов:', err)
            } finally {
                setOrdersLoading(false)
            }
        }
        fetchOrders()
    }, [user])

    async function handleUpdateName(e) {
        e.preventDefault()
        if (!newName.trim()) {
            setEditError('Имя не может быть пустым')
            return
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/customer/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ full_name: newName })
            })
            if (!res.ok) {
                const data = await res.json()
                setEditError(data.error || 'Ошибка обновления')
                return
            }
            window.location.reload()
        } catch (err) {
            setEditError('Ошибка соединения')
        }
    }

    async function handleUpdateEmail(e) {
        e.preventDefault()
        if (!newEmail.trim()) {
            setEditError('Email не может быть пустым')
            return
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(newEmail)) {
            setEditError('Введите корректный email')
            return
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/customer/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email: newEmail })
            })
            if (!res.ok) {
                const data = await res.json()
                setEditError(data.error || 'Ошибка обновления')
                return
            }
            window.location.reload()
        } catch (err) {
            setEditError('Ошибка соединения')
        }
    }

    function startEditName() {
        setEditingField('name')
        setNewName(user.full_name)
        setEditError('')
    }

    function startEditEmail() {
        setEditingField('email')
        setNewEmail(user.email)
        setEditError('')
    }

    function cancelEdit() {
        setEditingField(null)
        setEditError('')
    }

    function handleLogout() {
        logout()
        navigate('/')
    }

    function formatDate(dateStr) {
        if (!dateStr) return '—'
        return new Date(dateStr).toLocaleDateString('ru-RU', {
            day: 'numeric', month: 'long', year: 'numeric'
        })
    }

    if (!user) return null

    return (
        <>
            <Header/>
            <div className="profile">
                <div className="profile__container">

                    <div className="profile__card">
                        <div className="profile__avatar">
                            {user.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile__info">
                            <h1 className="profile__name">{user.full_name}</h1>
                            <p className="profile__email">{user.email}</p>
                            {user.created_at && (
                                <p className="profile__since">Клиент с {formatDate(user.created_at)}</p>
                            )}
                        </div>
                        <button className="profile__logout" onClick={handleLogout}>Выйти</button>
                    </div>

                    <div className="profile__section">
                        <div className="profile__section-header">
                            <h2>Личные данные</h2>
                        </div>

                        {editError && <p className="profile__error">{editError}</p>}

                        <div className="profile__data">
                            {/* Поле ФИО */}
                            <div className="profile__data-row">
                                <span className="profile__data-label">ФИО</span>
                                {editingField === 'name' ? (
                                    <div className="profile__edit-field">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="profile__input"
                                            autoFocus
                                        />
                                        <div className="profile__edit-actions">
                                            <button className="profile__save-btn" onClick={handleUpdateName}>
                                                Сохранить
                                            </button>
                                            <button className="profile__cancel-btn" onClick={cancelEdit}>
                                                Отмена
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <span className="profile__data-value">{user.full_name}</span>
                                        <button className="profile__inline-edit" onClick={startEditName}>
                                            Изменить
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Поле Email */}
                            <div className="profile__data-row">
                                <span className="profile__data-label">Email</span>
                                {editingField === 'email' ? (
                                    <div className="profile__edit-field">
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            className="profile__input"
                                            autoFocus
                                        />
                                        <div className="profile__edit-actions">
                                            <button className="profile__save-btn" onClick={handleUpdateEmail}>
                                                Сохранить
                                            </button>
                                            <button className="profile__cancel-btn" onClick={cancelEdit}>
                                                Отмена
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <span className="profile__data-value">{user.email}</span>
                                        <button className="profile__inline-edit" onClick={startEditEmail}>
                                            Изменить
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile__section">
                        <div className="profile__section-header">
                            <h2>История заказов</h2>
                        </div>

                        {ordersLoading ? (
                            <p className="profile__loading">Загрузка заказов...</p>
                        ) : orders.length === 0 ? (
                            <div className="profile__empty">
                                <p>У вас пока нет заказов</p>
                                <button className="profile__shop-btn" onClick={() => navigate('/catalog')}>
                                    Перейти в каталог
                                </button>
                            </div>
                        ) : (
                            <div className="profile__orders">
                                {orders.map(order => (
                                    <div key={order.id} className="profile__order">
                                        <div
                                            className="profile__order-header"
                                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                        >
                                            <div className="profile__order-left">
                                                <span className="profile__order-id">Заказ №{order.id}</span>
                                                <span className="profile__order-date">{formatDate(order.order_date)}</span>
                                            </div>
                                            <div className="profile__order-right">
                                                {order.total_amount && (
                                                    <span className="profile__order-total">
                                                        {Number(order.total_amount).toLocaleString('ru-RU')} ₽
                                                    </span>
                                                )}
                                                <span className="profile__order-arrow">
                                                    {expandedOrder === order.id ? '▲' : '▼'}
                                                </span>
                                            </div>
                                        </div>

                                        {expandedOrder === order.id && (
                                            <div className="profile__order-items">
                                                {order.items && order.items.length > 0 ? (
                                                    <>
                                                        <div className="profile__order-items-header">
                                                            <span>Товар</span>
                                                            <span>Кол-во</span>
                                                            <span>Цена</span>
                                                            <span>Сумма</span>
                                                        </div>
                                                        {order.items.map(item => (
                                                            <div key={item.id} className="profile__order-item">
                                                                <span className="profile__item-name">{item.name}</span>
                                                                <span className="profile__item-qty">{item.quantity} шт.</span>
                                                                <span className="profile__item-price">{Number(item.price).toLocaleString('ru-RU')} ₽</span>
                                                                <span className="profile__item-sum">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                                                            </div>
                                                        ))}
                                                        <div className="profile__order-summary">
                                                            Итого: <strong>{Number(order.total_amount).toLocaleString('ru-RU')} ₽</strong>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="profile__no-items">Нет данных о товарах</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    )
}