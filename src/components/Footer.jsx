import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/components/footer.module.scss";

const Footer = ({ variant = "main" }) => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const getActiveClass = (path) => {
    return location.pathname === path ? styles.active : "";
  };

  const renderCta = () => {
    if (variant === "contacts") return null;

    return (
      <div className={styles.footerCta}>
        <div className={styles.container}>
          <p className={styles.footerCta__text}>
            {variant === "main"
              ? "Готовы к сотрудничеству? Свяжитесь с нами сегодня"
              : "Есть вопросы? Напишите нам — ответим в течение дня"}
          </p>
          <Link
            to={variant === "main" ? "/contacts" : "/contacts#contact-form"}
            className={styles.footerCta__btn}
          >
            {variant === "main" ? "Связаться →" : "Написать →"}
          </Link>
        </div>
      </div>
    );
  };

  const renderMainVariant = () => (
    <div className={`${styles.footerGrid} ${styles.footerGrid4col}`}>
      <div>
        <p className={styles.footerLogo}>ФКП Авангард</p>
        <p className={styles.footerDesc}>
          Федеральное казённое предприятие с богатой историей и современным
          производством
        </p>

        <p className={styles.footerColTitle}>Контакты</p>
        <ul className={styles.footerContacts}>
          <li>
            <a href="tel:+73473251893">+7 (3473) 25-18-93</a> — приёмная
          </li>
          <li>
            <a href="tel:+73473215638">+7 (3473) 21-56-38</a> — продажи
          </li>
          <li>
            <a href="mailto:avangard2004@yandex.ru">avangard2004@yandex.ru</a>
          </li>
        </ul>

        <p className={styles.footerColTitle}>Режим работы</p>
        <p className={styles.footerHours}>
          Пн – Пт: 08:30 – 17:15 · Обед: 12:30 – 13:15
          <br />
          <span className={styles.weekend}>Сб – Вс: Выходной</span>
        </p>
      </div>

      <div>
        <p className={styles.footerColTitle}>Навигация</p>
        <ul className={styles.footerNav}>
          <li>
            <Link to="/" className={getActiveClass("/")}>
              Главная
            </Link>
          </li>
          <li>
            <Link to="/about" className={getActiveClass("/about")}>
              О заводе
            </Link>
          </li>
          <li>
            <Link to="/products" className={getActiveClass("/products")}>
              Продукция
            </Link>
          </li>
          <li>
            <Link to="/contacts" className={getActiveClass("/contacts")}>
              Контакты
            </Link>
          </li>
        </ul>
      </div>


      <div>
        <p className={styles.footerColTitle}>О предприятии</p>
        <ul className={styles.footerNav}>
          <li>
            <Link to="/about">История завода</Link>
          </li>
          <li>
            <Link to="/about#team">Руководство</Link>
          </li>
          <li>
            <Link to="/products">Продукция</Link>
          </li>
          <li>
            <Link to="/contacts#requisites">Реквизиты</Link>
          </li>
        </ul>
      </div>

      <div>
        <p className={styles.footerColTitle}>Как добраться</p>
        <div className={styles.footerMap}>
          <iframe
            src="https://yandex.ru/map-widget/v1/?ll=55.926%2C56.333&z=12&pt=55.926,56.333"
            title="Карта проезда"
            allowFullScreen
          />
        </div>
        <p className={styles.footerMapAddr}>
          Республика Башкортостан, г. Стерлитамак,
          <br />
          ул. Олега Кошевого, вл. 2
        </p>
      </div>
    </div>
  );

  const renderContactsVariant = () => (
    <div className={`${styles.footerGrid} ${styles.footerGridContacts}`}>

      <div>
        <p className={styles.footerLogo}>ФКП Авангард</p>
        <p className={styles.footerDesc}>
          Федеральное казённое предприятие. Стерлитамак, Башкортостан
        </p>

        <p className={styles.footerColTitle}>Реквизиты для связи</p>
        <ul className={styles.footerContacts}>
          <li>
            <a href="tel:+73473251893">+7 (3473) 25-18-93</a> — приёмная
          </li>
          <li>
            <a href="tel:+73473215638">+7 (3473) 21-56-38</a> — отдел продаж
          </li>
          <li>
            <a href="tel:+73473216414">+7 (3473) 21-64-14</a> — техподдержка
          </li>
          <li>
            <a href="mailto:avangard2004@yandex.ru">avangard2004@yandex.ru</a>
          </li>
        </ul>

        <p className={styles.footerColTitle}>Режим работы</p>
        <p className={styles.footerHours}>
          Пн – Пт: 08:30 – 17:15 · Обед: 12:30 – 13:15
          <br />
          <span className={styles.weekend}>Сб – Вс: Выходной</span>
        </p>
      </div>


      <div>
        <p className={styles.footerColTitle}>Навигация</p>
        <ul className={styles.footerNav}>
          <li>
            <Link to="/">Главная</Link>
          </li>
          <li>
            <Link to="/about">О заводе</Link>
          </li>
          <li>
            <Link to="/products">Продукция</Link>
          </li>
          <li>
            <Link to="/contacts" className={getActiveClass("/contacts")}>
              Контакты
            </Link>
          </li>
        </ul>
      </div>


      <div>
        <p className={styles.footerColTitle}>Как добраться</p>
        <div className={styles.footerMap}>
          <iframe
            src="https://yandex.ru/map-widget/v1/?ll=55.926%2C56.333&z=12&pt=55.926,56.333"
            title="Карта проезда"
            allowFullScreen
          />
        </div>
        <p className={styles.footerMapAddr}>
          ул. Олега Кошевого, вл. 2, г. Стерлитамак
        </p>
      </div>
    </div>
  );

  const renderOtherVariant = () => (
    <div className={`${styles.footerGrid} ${styles.footerGridOther}`}>

      <div>
        <p className={styles.footerLogo}>ФКП Авангард</p>
        <p className={styles.footerDesc}>
          Федеральное казённое предприятие с богатой историей и современным
          производством
        </p>
      </div>


      <div>
        <p className={styles.footerColTitle}>Навигация</p>
        <ul className={styles.footerNav}>
          <li>
            <Link to="/" className={getActiveClass("/")}>
              Главная
            </Link>
          </li>
          <li>
            <Link to="/about" className={getActiveClass("/about")}>
              О заводе
            </Link>
          </li>
          <li>
            <Link to="/products" className={getActiveClass("/products")}>
              Продукция
            </Link>
          </li>
          <li>
            <Link to="/contacts" className={getActiveClass("/contacts")}>
              Контакты
            </Link>
          </li>
        </ul>
      </div>


      <div>
        <p className={styles.footerColTitle}>Контакты</p>
        <ul className={styles.footerContacts}>
          <li>
            <a href="tel:+73473251893">+7 (3473) 25-18-93</a>
          </li>
          <li>
            <a href="mailto:avangard2004@yandex.ru">avangard2004@yandex.ru</a>
          </li>
          <li>г. Стерлитамак, Башкортостан</li>
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {renderCta()}
      <footer className={styles.footer}>
        <div className={styles.footerBody}>
          <div className={styles.container}>
            {variant === "main" && renderMainVariant()}
            {variant === "contacts" && renderContactsVariant()}
            {variant === "other" && renderOtherVariant()}
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.container}>
            <p className={styles.footerCopy}>
              {currentYear} ФКП Авангард. Все права защищены.
            </p>
            <Link to="/privacy" className={styles.footerPolicy}>
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
