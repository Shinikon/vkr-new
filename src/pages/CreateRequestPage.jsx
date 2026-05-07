import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { requestsDB, priorities } from "../data/requests";

const CreateRequestPage = () => {
  const [formData, setFormData] = useState({
    topic: "",
    priority: "Средний",
    date: "",
    description: "",
  });

  const [requests, setRequests] = useState(requestsDB.getAllRequests());

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRequest = requestsDB.addRequest({
      title: formData.topic,
      status: "На рассмотрении",
      priority: formData.priority,
      description: formData.description,
    });

    setRequests(requestsDB.getAllRequests());

    console.log("Заявка отправлена:", newRequest);
    alert(`Заявка ${newRequest.id} успешно отправлена!`);

    setFormData({
      topic: "",
      priority: "Средний",
      date: "",
      description: "",
    });
  };

  const getStatusClass = (status) => {
    if (status === "Одобрено") return "status-approved";
    if (status === "На рассмотрении") return "status-pending";
    if (status === "Отклонено") return "status-rejected";
    return "";
  };

  return (
    <div className="create-request-page">
      <Header />

      <div className="create-request-container">

        <div className="create-request-form">
          <h2 className="form-title">Новая заявка</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Тема запроса</label>
              <input
                type="text"
                name="topic"
                className="form-input"
                placeholder="Закупка химреагентов"
                value={formData.topic}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Приоритет</label>
                <select
                  name="priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  {priorities.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Срок</label>
                <input
                  type="text"
                  name="date"
                  className="form-input"
                  placeholder="ДД.ММ.ГГГГ"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Описание</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Подробности..."
                rows="4"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="submit-btn">
              Отправить в систему
            </button>
          </form>
        </div>

        <div className="create-request-list">
          <h2 className="list-title">Активные обращения</h2>

          <div className="requests-table">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-title">Тема/статус</div>
              <div className="col-date">Обновлено</div>
            </div>

            <div className="table-body">
              {requests.map((request, index) => (
                <div key={index} className="table-row">
                  <div className="col-id">{request.id}</div>
                  <div className="col-title">
                    <span className="request-title">{request.title}</span>
                    <span
                      className={`request-status ${getStatusClass(request.status)}`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <div className="col-date">{request.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateRequestPage;
