// pages/ApprovalsPage.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ApprovalsPage = () => {
  const [requests, setRequests] = useState([
    {
      id: "#12390",
      name: "Иванов Иван",
      initials: "ИИ",
      workshop: "Цех №2",
      position: "Технолог",
      priority: "Средний",
      deadline: "25.04.2026",
      title: "Заявка на плановый ремонт вентиляционной системы",
      description:
        "В узле синтеза периодически качает давление. Требуется осмотр фильтров и замена датчиков #402",
      comment: "",
      status: "pending",
    },
    {
      id: "#12670",
      name: "Иванова Мария",
      initials: "ИМ",
      workshop: "Цех №5",
      position: "Инженер",
      priority: "Высокий",
      deadline: "27.04.2026",
      title: "Закупка лабораторных реагентов для анализа качества смол",
      description:
        "Остатки компонентов синтеза Э-24 упали ниже критической отметки. Текущий склад заблокирован СБ. Требуется внеплановая закупка 500кг отвердителя по спецканалу",
      comment: "",
      status: "pending",
    },
  ]);

  const [comments, setComments] = useState({});

  const handleCommentChange = (id, value) => {
    setComments({
      ...comments,
      [id]: value,
    });
  };

  const updateStatus = (id, newStatus) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req,
      ),
    );
  };

  const getPriorityClass = (priority) => {
    if (priority === "Высокий") return "priority-high";
    if (priority === "Средний") return "priority-medium";
    return "priority-low";
  };

  return (
    <div className="approvals-page">
      <Header />

      <section className="approvals-section">
        <div className="container">
          <div className="approvals-header">
            <h1 className="approvals-header__title">Лента согласований</h1>
            <p className="approvals-header__subtitle">
              ФКП Авангард · Федеральное казённое предприятие
            </p>
          </div>

          <div className="approvals-list">
            {requests.map((request) => (
              <div key={request.id} className="approval-card">
                <div className="approval-card__header">
                  <div className="approval-card__user">
                    <div className="approval-card__avatar">
                      {request.initials}
                    </div>
                    <div className="approval-card__user-info">
                      <h3 className="approval-card__name">{request.name}</h3>
                      <p className="approval-card__position">
                        {request.workshop}, {request.position}
                      </p>
                    </div>
                  </div>
                  <div className="approval-card__meta">
                    <span
                      className={`approval-card__priority ${getPriorityClass(
                        request.priority,
                      )}`}
                    >
                      Приоритет: {request.priority}
                    </span>
                    <span className="approval-card__deadline">
                      Срок: {request.deadline}
                    </span>
                    <span className="approval-card__id">{request.id}</span>
                  </div>
                </div>

                <div className="approval-card__body">
                  <h4 className="approval-card__title">{request.title}</h4>
                  <p className="approval-card__description">
                    {request.description}
                  </p>
                  <div className="approval-card__comment">
                    <textarea
                      className="approval-card__textarea"
                      placeholder="Комментарий для сотрудника..."
                      value={comments[request.id] || ""}
                      onChange={(e) =>
                        handleCommentChange(request.id, e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="approval-card__actions">
                  <button
                    className={`approval-card__btn approval-card__btn--approved ${
                      request.status === "approved"
                        ? "approval-card__btn--active"
                        : ""
                    }`}
                    onClick={() => updateStatus(request.id, "approved")}
                  >
                    Одобрено
                  </button>
                  <button
                    className={`approval-card__btn approval-card__btn--pending ${
                      request.status === "pending"
                        ? "approval-card__btn--active"
                        : ""
                    }`}
                    onClick={() => updateStatus(request.id, "pending")}
                  >
                    На рассмотрении
                  </button>
                  <button
                    className={`approval-card__btn approval-card__btn--rejected ${
                      request.status === "rejected"
                        ? "approval-card__btn--active"
                        : ""
                    }`}
                    onClick={() => updateStatus(request.id, "rejected")}
                  >
                    Отклонить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ApprovalsPage;
