import React from "react";
import { Link } from "react-router-dom";
import ban1 from "../assets/img/ифт1.png";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollAnimation from "../components/ScrollAnimation";
import equipment from "../assets/img/equipment-icon.svg";
import quality from "../assets/img/quality-icon.svg";
import team from "../assets/img/team-icon.svg";

const HomePage = () => {
  return (
    <div className="about-page">
      <ScrollAnimation />
      <Header />

      <div className="hero-section">
        <div className="container">
          <div className="hero-section__inner">

            <div className="hero-section__content">
              <h1 className="hero-section__title">
                ФКП Авангард -
                <span className="hero-section__title-bold">Лидер</span>
                <br />
                промышленного производства
              </h1>
              <p className="hero-section__subtitle">
                Более 30 лет мы производим высококачественную продукцию для
                различных отраслей промышленности
              </p>
              <div className="hero-section__buttons">
                <button className="hero-section__btn hero-section__btn--outline">
                  О предприятии
                </button>
                <button className="hero-section__btn hero-section__btn--primary">
                  Наша продукция
                </button>
              </div>
            </div>


            <div className="hero-section__image">
              <img src={ban1} alt="ФКП Авангард" />

              <div className="hero-section__founded">
                <span className="hero-section__founded-year">1943</span>
                <span className="hero-section__founded-label">
                  Год основания
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="advantages-section">
        <div className="container">
          <h2 className="advantages-section__title">Наши преимущества</h2>
          <p className="advantages-section__subtitle">
            ФКП Авангард - это надёжный партнер с проверенной репутацией
          </p>

          <div className="advantages-grid">
            <div className="advantage-card">
              <div className="advantage-card__icon">
                <img src={quality} alt="Качество" />
              </div>
              <h3 className="advantage-card__title">Качество</h3>
              <p className="advantage-card__text">
                Продукция соответствует всем российским и международным
                стандартам
              </p>
            </div>

            <div className="advantage-card">
              <div className="advantage-card__icon">
                <img src={equipment} alt="Современное оборудование" />
              </div>
              <h3 className="advantage-card__title">
                Современное оборудование
              </h3>
              <p className="advantage-card__text">
                Использование новейших технологий в производстве
              </p>
            </div>

            <div className="advantage-card">
              <div className="advantage-card__icon">
                <img src={team} alt="Опытная команда" />
              </div>
              <h3 className="advantage-card__title">Опытная команда</h3>
              <p className="advantage-card__text">
                Высококвалифицированные специалисты с многолетним стажем
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="stats-section">
        <div className="container">
          <div className="stats-section__inner">
            <div className="stats-section__content">
              <h2 className="stats-section__title">Производство в цифрах</h2>
              <p className="stats-section__text">
                Производим и поставляем продукцию оборонно-промышленного
                комплекса для нужд авиационной, космической и судостроительной
                отраслей.
              </p>
            </div>

            <div className="stats-section__numbers">
              <div className="stats-grid">
                <div className="stat-cell">
                  <div className="stat-cell__number">300+</div>
                  <div className="stat-cell__label">ВИДОВ ПРОДУКЦИИ</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-cell__number">50+</div>
                  <div className="stat-cell__label">ПАТЕНТОВ</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-cell__number">80+</div>
                  <div className="stat-cell__label">ЛЕТ РАБОТЫ</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-cell__number">1.5K</div>
                  <div className="stat-cell__label">СОТРУДНИКОВ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
