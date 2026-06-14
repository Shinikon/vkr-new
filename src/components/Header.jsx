import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/components/header.module.scss";
import logo from "../assets/img/logo.png";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (!isAuthenticated) {
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

            {/* Бургер-кнопка для неавторизованных */}
            <button
              className={`${styles["burger-btn"]} ${isMenuOpen ? styles.open : ""}`}
              onClick={toggleMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`}>
              <Link to="/" className={styles.nav__link} onClick={closeMenu}>
                Главная
              </Link>
              <Link
                to="/about"
                className={styles.nav__link}
                onClick={closeMenu}
              >
                О Заводе
              </Link>
              <Link
                to="/products"
                className={styles.nav__link}
                onClick={closeMenu}
              >
                Продукция
              </Link>
              <Link
                to="/contacts"
                className={styles.nav__link}
                onClick={closeMenu}
              >
                Контакты
              </Link>
            </nav>

            <div className={styles.employee}>
              <Link to="/auth" className={styles.employee__link}>
                Для сотрудников
              </Link>
            </div>

            {isMenuOpen && (
              <div
                className={`${styles["menu-overlay"]} ${styles.open}`}
                onClick={closeMenu}
              ></div>
            )}
          </div>
        </div>
      </header>
    );
  }

  const canAccessApprovals = userRole === "manager" || userRole === "admin";
  const isAdmin = userRole === "admin";

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.header__inner}>
          <div className={styles.logo}>
            <Link
              to={canAccessApprovals ? "/approvals" : "/request"}
              className={styles.logo__link}
              onClick={closeMenu}
            >
              <div className={styles.logo__image}>
                <img src={logo} alt="ФКП Авангард" />
              </div>
              <div className={styles.logo__text}>
                <div className={styles.logo__title}>ФКП Авангард</div>
                <div className={styles.logo__subtitle}>Система заявок</div>
              </div>
            </Link>
          </div>

          {/* Бургер-кнопка для авторизованных */}
          <button
            className={`${styles["burger-btn"]} ${isMenuOpen ? styles.open : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`}>
            <Link
              to="/request"
              className={`${styles.nav__link} ${location.pathname === "/request" ? styles["nav__link--active"] : ""}`}
              onClick={closeMenu}
            >
              Создать заявку
            </Link>
            {canAccessApprovals && (
              <Link
                to="/approvals"
                className={`${styles.nav__link} ${location.pathname === "/approvals" ? styles["nav__link--active"] : ""}`}
                onClick={closeMenu}
              >
                Лента согласований
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`${styles.nav__link} ${location.pathname === "/admin" ? styles["nav__link--active"] : ""}`}
                onClick={closeMenu}
              >
                Админ-панель
              </Link>
            )}
          </nav>

          <div className={styles.employee}>
            <div className={styles.employee__profile}>
              <span className={styles.employee__name}>{user?.email}</span>
              <span className={styles.employee__role}>
                {isAdmin
                  ? "Администратор"
                  : canAccessApprovals
                    ? "Менеджер"
                    : "Сотрудник"}
              </span>
              <button
                onClick={handleLogout}
                className={styles.employee__logout}
              >
                Выйти
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div
              className={`${styles["menu-overlay"]} ${styles.open}`}
              onClick={closeMenu}
            ></div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
