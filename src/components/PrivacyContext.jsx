import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

export function PrivacyContext({ children }) {
  const [consentGiven, setConsentGiven] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFullPolicy, setShowFullPolicy] = useState(false); // для развернутой политики
  const [isVKApp, setIsVKApp] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkVKEnvironment = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const hasVKParams = urlParams.has('vk_user_id') || 
                           urlParams.has('vk_app_id') ||
                           urlParams.has('vk_access_token_settings');
        
        if (hasVKParams) {
          setIsVKApp(true);
          const hasConsented = localStorage.getItem('privacyConsent');
          if (!hasConsented) {
            setShowModal(true);
          } else {
            setConsentGiven(true);
          }
        } else {
          setIsVKApp(false);
          setConsentGiven(true);
        }
      } catch (error) {
        setIsVKApp(false);
        setConsentGiven(true);
      } finally {
        setChecking(false);
      }
    };

    checkVKEnvironment();
  }, []);

  const handleAccept = () => {
    localStorage.setItem('privacyConsent', 'true');
    setConsentGiven(true);
    setShowModal(false);
    setShowFullPolicy(false);
    
    if (isVKApp) {
      try {
        bridge.send('VKWebAppStorageSet', {
          key: 'privacyConsent',
          value: 'true'
        });
      } catch (err) {
        console.log('Ошибка сохранения:', err);
      }
    }
  };

  const handleDecline = () => {
    if (isVKApp) {
      bridge.send('VKWebAppClose', { status: 'success' });
    }
  };

  if (checking) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Загрузка...</div>;
  }

  // Показываем полный текст политики
  if (showFullPolicy) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        zIndex: 10000,
        overflow: 'auto',
        padding: '20px'
      }}>
        <button 
          onClick={() => setShowFullPolicy(false)}
          style={{
            position: 'sticky',
            top: '10px',
            float: 'right',
            padding: '8px 16px',
            backgroundColor: '#5579F6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ✕ 
        </button>
        
        <h1>Политика конфиденциальности</h1>
        <p>Дата вступления в силу: 23.05.2026</p>
        
        <h2>1. Какие данные мы собираем</h2>
        <ul>
          <li>Имя, фамилия, ID пользователя VK</li>
          <li>Номер телефона (при авторизации)</li>
          <li>Email (при наличии)</li>
          <li>История заказов и содержимое корзины</li>
        </ul>
        
        <h2>2. Как мы используем данные</h2>
        <ul>
          <li>Для идентификации пользователя</li>
          <li>Для обработки и доставки заказов</li>
          <li>Для улучшения работы сервиса</li>
        </ul>
        
        <h2>3. Передача данных третьим лицам</h2>
        <p>Мы не передаём ваши персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством РФ.</p>
        
        <h2>4. Хранение данных</h2>
        <p>Все данные хранятся на территории РФ в соответствии с 152-ФЗ.</p>
        
       
        
        <h2>5. Контакты</h2>
        <p>По вопросам конфиденциальности: powerstore.batteryshop@gmail.com</p>
        
        <button 
          onClick={() => setShowFullPolicy(false)}
          style={{
            display: 'block',
            margin: '20px auto',
            padding: '12px 24px',
            backgroundColor: '#5579F6',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Вернуться к согласию
        </button>
      </div>
    );
  }

  // Модальное окно с краткой политикой и ссылкой на полную
  if (isVKApp && !consentGiven && showModal) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '400px',
          width: '100%',
          padding: '28px 24px',
          boxShadow: '0 20px 35px -8px rgba(0,0,0,0.3)',
          maxHeight: '80vh',
          overflow: 'auto'
        }}>
          <h2 style={{
            margin: '0 0 12px 0',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1a1a1a'
          }}>
            Политика конфиденциальности
          </h2>
          
          <p style={{
            margin: '16px 0',
            lineHeight: '1.5',
            color: '#4a4a4a',
            fontSize: '14px'
          }}>
            Продолжая использовать наше приложение, вы соглашаетесь с{' '}
            <button 
              onClick={() => setShowFullPolicy(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#5579F6',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                padding: 0
              }}
            >
              Политикой конфиденциальности
            </button>
            , которая описывает сбор и обработку следующих данных:
          </p>
          
          <ul style={{
            margin: '12px 0',
            paddingLeft: '20px',
            color: '#4a4a4a',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            <li>Данные профиля VK (имя, id)</li>
            <li>Номер телефона (при авторизации)</li>
            <li>История заказов</li>
            <li>Данные корзины</li>
          </ul>
          
          <div style={{
            marginTop: '28px',
            display: 'flex',
            gap: '12px'
          }}>
            <button 
              onClick={handleAccept}
              style={{
                flex: 1,
                padding: '12px 20px',
                backgroundColor: '#5579F6',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Принимаю
            </button>
            <button 
              onClick={handleDecline}
              style={{
                flex: 1,
                padding: '12px 20px',
                backgroundColor: 'transparent',
                color: '#5579F6',
                border: '2px solid #5579F6',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Не принимаю
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}