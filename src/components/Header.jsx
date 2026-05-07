import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/components/header.module.scss";
import logo from "../assets/img/logo.png"; 

const Header = () => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.header__inner}>
          <div className={styles.logo}>
            <Link to="/" className={styles.logo__link}>
              <div className={styles.logo__image}>
                <img src={logo} alt="ФКП Авангард" />
              </div>
              <div className={styles.logo__text}>
                <div className={styles.logo__title}>ФКП Авангард</div>
                <div className={styles.logo__subtitle}>
                  Федеральное казённое предприятие
                </div>
              </div>
            </Link>
          </div>
          <nav className={styles.nav}>
            <Link
              to="/"
              className={`${styles.nav__link} ${location.pathname === "/" ? styles["nav__link--active"] : ""}`}
            >
              Главная
            </Link>
            <Link
              to="/about"
              className={`${styles.nav__link} ${location.pathname === "/about" ? styles["nav__link--active"] : ""}`}
            >
              О Заводе
            </Link>
            <Link
              to="/products"
              className={`${styles.nav__link} ${location.pathname === "/products" ? styles["nav__link--active"] : ""}`}
            >
              Продукция
            </Link>
            <Link
              to="/contacts"
              className={`${styles.nav__link} ${location.pathname === "/contacts" ? styles["nav__link--active"] : ""}`}
            >
              Контакты
            </Link>
          </nav>

          <div className={styles.employee}>
            <Link to="/auth" className={styles.employee__link}>
              Для сотрудников
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
