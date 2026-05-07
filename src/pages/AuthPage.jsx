import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AuthPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", formData);
    alert("Вход выполнен!");
  };

  return (
    <div className="auth-page">
      <Header />

      <section className="auth-section">
        <div className="container">
          <div className="auth-card">
            <h1 className="auth-card__title">Вход для сотрудников</h1>
            <p className="auth-card__subtitle">
              Введите свои учётные данные для доступа к системе
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-form__field">
                <label className="auth-form__label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="auth-form__input"
                  placeholder="ivan@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-form__field">
                <label className="auth-form__label">Пароль</label>
                <input
                  type="password"
                  name="password"
                  className="auth-form__input"
                  placeholder=""
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="auth-form__button">
                Войти
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AuthPage;