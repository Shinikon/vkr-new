import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Сообщение отправлено!");
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">
      <Header />


      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">

            <div className="contact-left">
              <div className="contact-left__hero">
                <h1 className="contact-left__title">НА СВЯЗИ</h1>
                <p className="contact-left__subtitle">24/7</p>
                <p className="contact-left__text">
                  Свяжитесь с нами удобным для вас способом. Мы всегда рады
                  ответить на ваши вопросы.
                </p>
              </div>

              <div className="contact-left__info">
                <div className="contact-left__row">
                  <div className="contact-left__item">
                    <h3 className="contact-left__item-title">Приёмная</h3>
                    <p className="contact-left__item-phone">
                      +7 (3473) 25-18-93
                    </p>
                    <p className="contact-left__item-email">
                      fkpavangard-buh@mail.ru
                    </p>
                  </div>
                  <div className="contact-left__item">
                    <h3 className="contact-left__item-title">ОТДЕЛ ПРОДАЖ</h3>
                    <p className="contact-left__item-phone">
                      +7 (3473) 21-56-38
                    </p>
                    <p className="contact-left__item-email">
                      fkpavangard-ppo@mail.ru
                    </p>
                  </div>
                </div>

                <div className="contact-left__requisites">
                  <h3 className="contact-left__requisites-title">Реквизиты</h3>
                  <div className="contact-left__requisites-row">
                    <div className="contact-left__requisites-item">
                      <p className="contact-left__requisites-label">ИНН/КПП</p>
                      <p className="contact-left__requisites-value">
                        0268005588
                      </p>
                    </div>
                    <div className="contact-left__requisites-item">
                      <p className="contact-left__requisites-label">ОГРН</p>
                      <p className="contact-left__requisites-value">
                        1020202089115
                      </p>
                    </div>
                    <div className="contact-left__requisites-item">
                      <p className="contact-left__requisites-label">БИК</p>
                      <p className="contact-left__requisites-value">
                        042202803
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="contact-right">
              <h2 className="contact-right__title">Отправить сообщение</h2>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form__field">
                  <label className="contact-form__label">Ваше имя</label>
                  <input
                    type="text"
                    name="name"
                    className="contact-form__input"
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="contact-form__field">
                  <label className="contact-form__label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="contact-form__input"
                    placeholder="ivan@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="contact-form__field">
                  <label className="contact-form__label">Телефон</label>
                  <input
                    type="tel"
                    name="phone"
                    className="contact-form__input"
                    placeholder="+7 (___) ___-__-__"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="contact-form__field">
                  <label className="contact-form__label">Сообщение</label>
                  <textarea
                    name="message"
                    className="contact-form__textarea"
                    placeholder="Ваше сообщение"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="contact-form__button">
                  Отправить сообщение
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
