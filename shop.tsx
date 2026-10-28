import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import '../styles.css'; // Убедитесь, что путь к стилям правильный

// Регистрируем маршрут /shop
export const Route = createFileRoute('/shop')({
  component: ShopComponent,
});

const backgroundEffects = [
  { id: 'none', name: 'Без эффекта', price: 0, img: 'default.jpg' },
  { id: 'aurora', name: 'Северное сияние', price: 500, img: 'aurora.jpg' },
  { id: 'matrix', name: 'Матрица (Дождь)', price: 600, img: 'matrix.jpg' },
  { id: 'stars', name: 'Звездное небо', price: 600, img: 'stars.jpg' },
  { id: 'underwater', name: 'Подводный мир', price: 700, img: 'underwater.jpg' },
  { id: 'foggy', name: 'Туманный лес', price: 700, img: 'foggy.jpg' },
  { id: 'stone', name: 'Каменная аллея', price: 700, img: 'stone.jpg' },
  { id: 'cats', name: 'Кошки и клубки', price: 700, img: 'cats.jpg' },
  { id: 'pumpkins', name: 'Тыквы', price: 700, img: 'pumpkins.jpg' },
  { id: 'creepy', name: 'Жуткая комната', price: 700, img: 'creepy.jpg' },
  { id: 'halloween', name: 'Хэллоуин', price: 700, img: 'halloween.jpg' },
  { id: 'redforest', name: 'Красный лес', price: 700, img: 'redforest.jpg' },
  { id: 'lanterns', name: 'Фонари', price: 700, img: 'lanterns.jpg' },
  { id: 'darktable', name: 'Темный стол', price: 700, img: 'darktable.jpg' },
  { id: 'cemetery', name: 'Кладбище', price: 700, img: 'cemetery.jpg' },
  { id: 'notebook', name: 'Коты и тетрадь', price: 700, img: 'notebook.jpg' }
];

const cardEffects = [
  { id: 'card1', name: 'Карта', price: 300, img: 'card1.jpg' },
  { id: 'card2', name: 'Карта', price: 400, img: 'card2.jpg' },
  { id: 'card3', name: 'Карта', price: 500, img: 'card3.jpg' },
  { id: 'card4', name: 'Карта', price: 200, img: 'card4.jpg' }
];

function ShopComponent() {
  const [activeBg, setActiveBg] = useState('none');
  const [xp, setXp] = useState(0); 

  // Функция формирования правильного пути к картинкам
  const getImageUrl = (filename: string) => {
    if (!filename) return '';
    // import.meta.env.BASE_URL автоматически подставит /mdk0401/
    return `${import.meta.env.BASE_URL}img/${filename}`;
  };

  const handleBuy = (price: number, id: string) => {
    if (xp >= price) {
      setXp(xp - price);
      setActiveBg(id);
      alert(`Успешно куплено за ${price} XP!`);
    } else {
      alert('Недостаточно XP!');
    }
  };

  return (
    <div className="app-container">
      {/* Шапка */}
      <header className="navbar">
        <div className="navbar-left">
          <button className="menu-btn">≡</button>
          <span className="portal-name">МДК Портал</span>
          <select className="group-select">
            <option>МДК 07.01 (ЧПУ)</option>
          </select>
        </div>
        <div className="navbar-right">
          <span className="xp-display">★ {xp} XP</span>
          <div className="user-profile">
            <img src={`${import.meta.env.BASE_URL}img/avatar.jpg`} alt="Avatar" className="avatar" onError={(e) => e.currentTarget.style.display = 'none'} />
            <span>Barbos</span>
          </div>
        </div>
      </header>

      {/* Основной контент магазина */}
      <main className="shop-page">
        <div className="blue-banner">
          <h2>🛒 Магазин</h2>
          <p>Баланс: ∞ (Преподаватель)</p>
        </div>

        <div className="section-header">
          <h2>Эффекты фона</h2>
        </div>
        
        <div className="grid-container">
          {backgroundEffects.map((bg) => (
            <div key={bg.id} className={`item-card ${activeBg === bg.id ? 'active-item' : ''}`}>
              <div className="preview-box">
                <img 
                  src={getImageUrl(bg.img)} 
                  alt={bg.name} 
                  className="preview-img"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                />
              </div>
              <h3 className="item-name">{bg.name}</h3>
              <button 
                className={`buy-btn ${activeBg === bg.id ? 'bought' : ''}`}
                onClick={() => handleBuy(bg.price, bg.id)}
              >
                {activeBg === bg.id ? '✔ Активно' : `Купить (${bg.price} XP)`}
              </button>
            </div>
          ))}
        </div>

        <div className="section-header">
          <h2>Эффекты карточек</h2>
        </div>
        <div className="grid-container">
          {cardEffects.map((card) => (
            <div key={card.id} className="item-card">
              <div className="preview-box">
                <img src={getImageUrl(card.img)} alt={card.name} className="preview-img" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <h3 className="item-name">{card.name}</h3>
              <button className="buy-btn" onClick={() => handleBuy(card.price, card.id)}>
                Купить ({card.price} XP)
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
