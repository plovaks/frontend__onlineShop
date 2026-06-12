import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import './AdminPanel.css';
import editIcon from "../../assets/icons/edit.svg"
import deleteIcon from "../../assets/icons/delete.svg"

const SERVER_URL = 'https://power-store-plovaks.amvera.io';

export default function AdminPanel() {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    
    // Состояния для формы добавления товара
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '',
        model: '',
        price: '',
        type: '',
        brand: '',
        in_stock: 0
    });
    const [specs, setSpecs] = useState([]);
    const [newSpec, setNewSpec] = useState({ name: '', value: '', unit: '' });
    const [images, setImages] = useState([]);
    const [newImageUrl, setNewImageUrl] = useState('');

    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${SERVER_URL}${url}`;
    };

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'orders') {
            fetchOrders();
        } else if (activeTab === 'products') {
            fetchProducts();
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

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            } else {
                setMessage('Ошибка загрузки товаров');
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

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const method = editingProduct ? 'PUT' : 'POST';
        const url = editingProduct 
            ? `${import.meta.env.VITE_API_URL}/api/admin/products/${editingProduct.id}`
            : `${import.meta.env.VITE_API_URL}/api/admin/products`;
        
        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...productForm,
                    price: parseFloat(productForm.price),
                    in_stock: parseInt(productForm.in_stock) || 0,
                    specs,
                    images
                })
            });
            if (res.ok) {
                setMessage(editingProduct ? 'Товар обновлён' : 'Товар добавлен');
                setShowProductForm(false);
                setEditingProduct(null);
                setProductForm({ name: '', model: '', price: '', type: '', brand: '', in_stock: 0 });
                setSpecs([]);
                setImages([]);
                fetchProducts();
            } else {
                const error = await res.json();
                setMessage(error.error || 'Ошибка');
            }
        } catch (err) {
            setMessage('Ошибка соединения');
        }
    };

    const deleteProduct = async (productId) => {
        if (!confirm('Удалить товар?')) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${productId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setMessage('Товар удалён');
                fetchProducts();
            } else {
                setMessage('Ошибка удаления');
            }
        } catch (err) {
            setMessage('Ошибка соединения');
        }
    };

    const addSpec = () => {
        if (newSpec.name && newSpec.value) {
            setSpecs([...specs, { ...newSpec }]);
            setNewSpec({ name: '', value: '', unit: '' });
        }
    };

    const removeSpec = (index) => {
        setSpecs(specs.filter((_, i) => i !== index));
    };

    const addImage = () => {
        if (newImageUrl) {
            setImages([...images, { url: newImageUrl, is_main: images.length === 0, sort_order: images.length }]);
            setNewImageUrl('');
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
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
                <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
                    Товары
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
            
            {activeTab === 'products' && (
                <div className="admin-products">
                    <button className="admin-add-btn" onClick={() => {
                        setEditingProduct(null);
                        setProductForm({ name: '', model: '', price: '', type: '', brand: '', in_stock: 0 });
                        setSpecs([]);
                        setImages([]);
                        setShowProductForm(true);
                    }}>
                        + Добавить товар
                    </button>
                    
                    {showProductForm && (
                        <div className="admin-product-form">
                            <h3>{editingProduct ? 'Редактировать товар' : 'Новый товар'}</h3>
                            <form onSubmit={handleProductSubmit}>
                                <div className="form-row">
                                    <input type="text" placeholder="Название *" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required />
                                    <input type="text" placeholder="Модель" value={productForm.model} onChange={e => setProductForm({...productForm, model: e.target.value})} />
                                    <input type="number" placeholder="Цена *" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required />
                                </div>
                                <div className="form-row">
                                    <input type="text" placeholder="Тип" value={productForm.type} onChange={e => setProductForm({...productForm, type: e.target.value})} />
                                    <input type="text" placeholder="Бренд" value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} />
                                    <input 
                                        type="number" 
                                        placeholder="Количество на складе" 
                                        value={productForm.in_stock} 
                                        onChange={e => setProductForm({...productForm, in_stock: parseInt(e.target.value) || 0})} 
                                        min="0"
                                    />
                                </div>
                                
                                <h4>Характеристики</h4>
                                <div className="specs-section">
                                    {specs.map((spec, i) => (
                                        <div key={i} className="spec-item">
                                            <span>{spec.name}: {spec.value} {spec.unit}</span>
                                            <button type="button" onClick={() => removeSpec(i)}>✕</button>
                                        </div>
                                    ))}
                                    <div className="add-spec">
                                        <input type="text" placeholder="Название (ёмкость, напряжение...)" value={newSpec.name} onChange={e => setNewSpec({...newSpec, name: e.target.value})} />
                                        <input type="text" placeholder="Значение" value={newSpec.value} onChange={e => setNewSpec({...newSpec, value: e.target.value})} />
                                        <input type="text" placeholder="Ед. изм. (мАч, В...)" value={newSpec.unit} onChange={e => setNewSpec({...newSpec, unit: e.target.value})} />
                                        <button type="button" onClick={addSpec}>+</button>
                                    </div>
                                </div>
                                
                                <h4>Изображения</h4>
                                <div className="images-section">
                                    {images.map((img, i) => (
                                        <div key={i} className="image-item">
                                            <img 
                                                src={getImageUrl(img.url)} 
                                                alt={`product ${i}`} 
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                            />
                                            <button type="button" onClick={() => removeImage(i)}>✕</button>
                                        </div>
                                    ))}
                                    <div className="add-image">
                                        <input type="text" placeholder="URL изображения" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} />
                                        <button type="button" onClick={addImage}>+</button>
                                    </div>
                                </div>
                                
                                <div className="form-actions">
                                    <button type="submit">{editingProduct ? 'Сохранить' : 'Добавить'}</button>
                                    <button type="button" onClick={() => { setShowProductForm(false); setEditingProduct(null); }}>Отмена</button>
                                </div>
                            </form>
                        </div>
                    )}
                    
                    <div className="products-list">
                        {products.map(product => (
                            <div key={product.id} className="admin-product-card">
                                <div className="product-image">
                                    {product.images?.[0] && (
                                        <img 
                                            src={getImageUrl(product.images[0].url)} 
                                            alt={product.name} 
                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                        />
                                    )}
                                </div>
                                <div className="product-info">
                                    <h4>{product.name}</h4>
                                    <p>{product.model || '—'}</p>
                                    <p className="product-price">{product.price} ₽</p>
                                    <p className={product.in_stock > 0 ? 'in-stock' : 'out-stock'}>
                                        {product.in_stock > 0 ? `В наличии: ${product.in_stock} шт.` : 'Нет в наличии'}
                                    </p>
                                </div>
                                <div className="product-actions">
                                    <button className="edit-btn" onClick={() => {
                                        setEditingProduct(product);
                                        setProductForm({
                                            name: product.name,
                                            model: product.model || '',
                                            price: product.price,
                                            type: product.type || '',
                                            brand: product.brand || '',
                                            in_stock: product.in_stock || 0
                                        });
                                        setSpecs(product.specs || []);
                                        setImages(product.images || []);
                                        setShowProductForm(true);
                                    }}>{editIcon}</button>
                                    <button className="delete-btn" onClick={() => deleteProduct(product.id)}>{deleteIcon}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}