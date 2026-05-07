import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollAnimation from "../components/ScrollAnimation";
import ban2 from "../assets/img/zavod.png";

const AboutPage = () => {
  return (
    <div className="page about-page">
      <ScrollAnimation />
      <Header />


      <section
        className="about-header"
        style={{ backgroundImage: `url(${ban2})` }}
      >
        <div className="container">
          <div className="about-header__content">
            <h1 className="about-header__title">О заводе</h1>
            <p className="about-header__subtitle">
              История и развитие ФКП Авангард
            </p>
          </div>
        </div>
      </section>

      <section className="about-description animate-on-scroll">
        <div className="container">
          <p className="description-text">
            Федеральное казённое предприятие «Авангард» — одно из ведущих
            предприятий оборонно-промышленного комплекса России с богатой
            историей и современным производством.
          </p>
          <p className="description-text">
            Основной в 1961 году, завод «Авангард» изначально специализировался
            на производстве специального оборудования и компонентов для нужд
            оборонной промышленности. За более чем 65 лет работы предприятие
            прошло путь от небольшого производственного цеха до современного
            высокотехнологичного комплекса.
          </p>
          <p className="description-text">
            Сегодня ФКП «Авангард» производит широкий спектр продукции: от
            прецизионных механических узлов и электротехнического оборудования
            до сложных электронных систем управления. Наша продукция
            используется в авиационной, космической, судостроительной и других
            отраслях промышленности.
          </p>
          <div className="stats-block">
            <p className="stats-text">
              На предприятии работает более 500 высококвалифицированных
              специалистов, включая инженеров-конструкторов, технологов и
              квалифицированных рабочих.
            </p>
          </div>
        </div>
      </section>

      <section className="values animate-on-scroll">
        <div className="container">
          <h2 className="section-title">Наши ценности</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-card__icon">
                <div className="icon-placeholder"></div>
              </div>
              <h3 className="value-title">Качество</h3>
              <p className="value-text">
                Строгий контроль на каждом этапе производства
              </p>
            </div>
            <div className="value-card">
              <div className="value-card__icon">
                <div className="icon-placeholder"></div>
              </div>
              <h3 className="value-title">Инновации</h3>
              <p className="value-text">
                Постоянное совершенствование технологий и процессов
              </p>
            </div>
            <div className="value-card">
              <div className="value-card__icon">
                <div className="icon-placeholder"></div>
              </div>
              <h3 className="value-title">Надёжность</h3>
              <p className="value-text">
                Гарантия качества и своевременная поставка
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="history animate-on-scroll">
        <div className="container">
          <h2 className="section-title">История развития</h2>
          <div className="history-timeline">
            <div className="timeline-line"></div>

            <div className="history-item">
              <div className="timeline-dot"></div>
              <div className="history-year">1943</div>
              <h3 className="history-title">Основание завода</h3>
              <p className="history-description">
                ФКП «Авангард» был основан как предприятие
                оборонно-промышленного комплекса
              </p>
            </div>

            <div className="history-item">
              <div className="timeline-dot"></div>
              <div className="history-year">1964</div>
              <h3 className="history-title">Смена названия</h3>
              <p className="history-description">
                Предприятие получило название «Авангард»
              </p>
            </div>

            <div className="history-item">
              <div className="timeline-dot"></div>
              <div className="history-year">2006</div>
              <h3 className="history-title">Получение статуса</h3>
              <p className="history-description">
                Авангард получил статус федерального казённого предприятия
              </p>
            </div>

            <div className="history-item">
              <div className="timeline-dot"></div>
              <div className="history-year">2023</div>
              <h3 className="history-title">Переданы госкорпорации «Ростех»</h3>
              <p className="history-description">
                В январе 2023 года правительство России включило «Авангард» в
                перечень предприятий, которые планировали приватизировать. 100 %
                акций «Авангарда» были переданы госкорпорации «Ростех».
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="production animate-on-scroll">
        <div className="container">
          <h2 className="section-title">Современное производство</h2>
          <div className="production-wrapper">
            <div className="production-image-placeholder">
              <div className="placeholder-content">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z"
                    stroke="#1a3e6f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>Изображение завода</p>
              </div>
            </div>
            <div className="production-content">
              <h3 className="production-subtitle">
                Высокотехнологичное оборудование
              </h3>
              <p className="production-text">
                Наше предприятие оснащено современным высокоточным
                оборудованием, что позволяет производить продукцию мирового
                уровня. Система контроля качества на каждом этапе производства
                гарантирует соответствие продукции всем требованиям и
                стандартам.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
