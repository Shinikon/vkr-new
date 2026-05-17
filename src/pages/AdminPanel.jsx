import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [newUser, setNewUser] = useState({
    email: "",
    full_name: "",
    role: "employee",
  });

  useEffect(() => {
    if (activeTab === "requests") {
      loadRequests();
    } else if (activeTab === "users") {
      loadUsers();
    }
  }, [activeTab]);

  const loadRequests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setRequests(data);
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from("users").select("*");
    if (data) setUsers(data);
    setLoading(false);
  };

  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const addUser = async (e) => {
    e.preventDefault();

    if (!newUser.email || !newUser.full_name) {
      setMessage("Заполните все поля");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const { data: existing } = await supabase
      .from("users")
      .select("email")
      .eq("email", newUser.email)
      .maybeSingle();

    if (existing) {
      setMessage(`Пользователь с email ${newUser.email} уже существует`);
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const password = generateRandomPassword();

    const { error } = await supabase.from("users").insert([
      {
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
      },
    ]);

    if (error) {
      setMessage(`Ошибка: ${error.message}`);
    } else {
      setMessage(`Пользователь ${newUser.email} добавлен! Пароль: ${password}`);
      setNewUser({ email: "", full_name: "", role: "employee" });
      loadUsers();
    }
    setTimeout(() => setMessage(""), 5000);
  };

  const updateUserRole = async (id, newRole) => {
    await supabase.from("users").update({ role: newRole }).eq("id", id);
    setMessage("Роль пользователя изменена");
    loadUsers();
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteUser = async (id, email) => {
    if (window.confirm(`Удалить пользователя ${email}?`)) {
      await supabase.from("users").delete().eq("id", id);
      setMessage(`Пользователь ${email} удалён`);
      loadUsers();
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const updateRequestStatus = async (id, status) => {
    await supabase.from("requests").update({ status }).eq("id", id);
    setMessage("Статус заявки изменён");
    loadRequests();
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteRequest = async (id) => {
    if (window.confirm("Удалить эту заявку?")) {
      await supabase.from("requests").delete().eq("id", id);
      setMessage("Заявка удалена");
      loadRequests();
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Одобрено";
      case "rejected":
        return "Отклонено";
      default:
        return "На рассмотрении";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Высокий":
        return "priority-high";
      case "Средний":
        return "priority-medium";
      default:
        return "priority-low";
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case "admin":
        return "role-admin";
      case "manager":
        return "role-manager";
      default:
        return "role-employee";
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "admin":
        return "Администратор";
      case "manager":
        return "Менеджер";
      default:
        return "Сотрудник";
    }
  };

  const stats = {
    total: requests.length,
    approved: requests.filter((r) => r.status === "approved").length,
    pending: requests.filter((r) => r.status === "pending").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="container">
        <div className="admin-header">
          <h1>Панель управления</h1>
          <p className="admin-subtitle">
            Управление заявками и пользователями системы
          </p>
        </div>

        {message && (
          <div
            className={`admin-message ${message.includes("Ошибка") ? "error" : ""}`}
          >
            {message}
          </div>
        )}

        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Всего заявок</div>
          </div>
          <div className="stat-card stat-approved">
            <div className="stat-value">{stats.approved}</div>
            <div className="stat-label">Одобрено</div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">На рассмотрении</div>
          </div>
          <div className="stat-card stat-rejected">
            <div className="stat-value">{stats.rejected}</div>
            <div className="stat-label">Отклонено</div>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            Заявки ({requests.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Пользователи ({users.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "add-user" ? "active" : ""}`}
            onClick={() => setActiveTab("add-user")}
          >
            Добавить пользователя
          </button>
        </div>

        {activeTab === "requests" && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Номер</th>
                  <th>Заявитель</th>
                  <th>Тема</th>
                  <th>Приоритет</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-row">
                      Нет заявок
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.id}>
                      <td className="request-id">{request.request_id}</td>
                      <td>{request.name}</td>
                      <td>{request.title}</td>
                      <td>
                        <span
                          className={`priority-badge ${getPriorityClass(request.priority)}`}
                        >
                          {request.priority}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${getStatusClass(request.status)}`}
                        >
                          {getStatusText(request.status)}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <select
                          value={request.status}
                          onChange={(e) =>
                            updateRequestStatus(request.id, e.target.value)
                          }
                          className="status-select"
                        >
                          <option value="pending">На рассмотрении</option>
                          <option value="approved">Одобрено</option>
                          <option value="rejected">Отклонено</option>
                        </select>
                        <button
                          onClick={() => deleteRequest(request.id)}
                          className="delete-btn"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "users" && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>ФИО</th>
                  <th>Роль</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-row">
                      Нет пользователей
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.full_name}</td>
                      <td>
                        <span
                          className={`role-badge ${getRoleClass(user.role)}`}
                        >
                          {getRoleText(user.role)}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            updateUserRole(user.id, e.target.value)
                          }
                          className="role-select"
                        >
                          <option value="employee">Сотрудник</option>
                          <option value="manager">Менеджер</option>
                          <option value="admin">Администратор</option>
                        </select>
                        <button
                          onClick={() => deleteUser(user.id, user.email)}
                          className="delete-btn"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "add-user" && (
          <div className="add-user-section">
            <form onSubmit={addUser} className="add-user-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="user@avangard.ru"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">ФИО</label>
                <input
                  type="text"
                  className="form-input"
                  value={newUser.full_name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, full_name: e.target.value })
                  }
                  placeholder="Иванов Иван Иванович"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Роль</label>
                <select
                  className="form-select"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="employee">Сотрудник</option>
                  <option value="manager">Менеджер</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
              <button type="submit" className="submit-btn">
                Добавить пользователя
              </button>
            </form>
            <p
              className="info-text"
              style={{
                textAlign: "center",
                marginTop: "16px",
                fontSize: "12px",
                color: "#666",
              }}
            >
              При добавлении пользователя генерируется случайный пароль, который
              отображается в сообщении.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
