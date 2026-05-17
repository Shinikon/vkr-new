import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

const CreateRequestPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    workshop: "",
    position: "",
    priority: "Средний",
    deadline: "",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("email", user?.email)
      .single();

    const newId = `№${Date.now().toString().slice(-6)}`;
    const nameParts = formData.name.split(" ");
    const initials = nameParts
      .map((part) => part[0])
      .join("")
      .toUpperCase();

    const requestData = {
      request_id: newId,
      user_id: userData?.id,
      name: formData.name,
      initials: initials || "??",
      workshop: formData.workshop,
      position: formData.position,
      priority: formData.priority,
      deadline: formData.deadline,
      title: formData.title,
      description: formData.description,
      status: "pending",
    };

    const { error } = await supabase.from("requests").insert([requestData]);

    if (error) {
      setMessage(`Ошибка: ${error.message}`);
    } else {
      setMessage(`Заявка ${newId} успешно создана!`);
      setFormData({
        name: "",
        workshop: "",
        position: "",
        priority: "Средний",
        deadline: "",
        title: "",
        description: "",
      });
      setTimeout(() => {
        navigate("/approvals");
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="create-request-page">
      <div className="create-request-container">
        <div className="create-request-form">
          <h2 className="form-title">Новая заявка</h2>

          {message && (
            <div
              className={
                message.startsWith("Ошибка")
                  ? "error-message"
                  : "success-message"
              }
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">ФИО заявителя</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Иванов Иван Иванович"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Цех</label>
                <input
                  type="text"
                  name="workshop"
                  className="form-input"
                  placeholder="Цех №2"
                  value={formData.workshop}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Должность</label>
                <input
                  type="text"
                  name="position"
                  className="form-input"
                  placeholder="Технолог"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>
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
                  <option>Высокий</option>
                  <option>Средний</option>
                  <option>Низкий</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Срок</label>
                <input
                  type="date"
                  name="deadline"
                  className="form-input"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Тема запроса</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="Краткое описание"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Описание</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Подробное описание..."
                rows="5"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Отправка..." : "Отправить в систему"}
            </button>
          </form>
        </div>

        <div className="create-request-list">
          <h3 className="list-title">Активные обращения</h3>
          <div className="requests-table">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-title">Тема/статус</div>
              <div className="col-date">Обновлено</div>
            </div>
            <div className="table-body">
              <div className="table-row">
                <div className="col-id">№10243</div>
                <div className="col-title">
                  <span className="request-title">
                    Замена картриджей в бухгалтерии
                  </span>
                  <span className="request-status status-pending">
                    На рассмотрении
                  </span>
                </div>
                <div className="col-date">Сегодня, 9:12</div>
              </div>
              <div className="table-row">
                <div className="col-id">№10212</div>
                <div className="col-title">
                  <span className="request-title">
                    Выдача новой спецодежды (Ц-2)
                  </span>
                  <span className="request-status status-approved">
                    Одобрено
                  </span>
                </div>
                <div className="col-date">12.04.2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRequestPage;
