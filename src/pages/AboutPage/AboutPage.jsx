import React from "react";
import "./AboutPage.css";
import aboutUs from "../../assets/images/aboutUs.png";
import tick from "../../assets/icons/tick.svg"
import sale from "../../assets/icons/sale.svg"
import people from "../../assets/icons/People.svg"

export default function AboutPage() {
  const advantages = [
    {
      id: "01",
      icon: tick,
      title: "Оригинальная продукция",
      desc: "Только оригинальные аккумуляторы с гарантией. Все проверено.",
      color: "blue"
    },
    {
      id: "02",
      icon: sale,
      title: "Опт и розница",
      desc: "Специальные условия для оптовиков и приятные цены для розничных покупателей.",
      color: "yellow"
    },
    {
      id: "03",
      icon: people,
      title: "Без посредников",
      desc: "Мы сами привозим товар - никаких посредников и скрытых наценок.",
      color: "blue"
    }
  ];

  return (
    <section className="about">

      <div className="about__wrapper">

        <h2 className="about__title">
          НАШИ ПРЕИМУЩЕСТВА
        </h2>

        <div className="about__grid">

          <div className="about__cards">

            {advantages.map(item => (
              <div className="advantage-card" key={item.id}>

                <div className={`advantage-icon ${item.color}`}>
                  <img src={item.icon} alt="icon"/>
                </div>

                <div className="advantage-content">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>

                <div className="advantage-number">
                  {item.id}
                </div>

              </div>
            ))}

          </div>

          <div className="about__image">

            <img
              src={aboutUs}
              alt="Аккумулятор"
            />

          </div>

        </div>

        <div className="about__dots"></div>

      </div>

    </section>
  );
}