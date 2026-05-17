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
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Ошибка загрузки заявок:", error);
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Ошибка загрузки пользователей:", error);
    } else {
      setUsers(data || []);
    }
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

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: newUser.email,
      password: password,
      options: {
        data: { full_name: newUser.full_name },
      },
    });

    if (authError) {
      if (authError.message.includes("rate limit")) {
        setMessage("Достигнут лимит запросов. Попробуйте позже.");
      } else {
        setMessage(`Ошибка: ${authError.message}`);
      }
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    if (authData.user) {
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role,
        },
      ]);

      if (insertError) {
        setMessage(`Ошибка: ${insertError.message}`);
      } else {
        setMessage(
          `Пользователь ${newUser.email} добавлен! Пароль: ${password}`,
        );
        setNewUser({ email: "", full_name: "", role: "employee" });
        loadUsers();
      }
    }
    setTimeout(() => setMessage(""), 5000);
  };

  const updateUserRole = async (id, newRole) => {
    const { error } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", id);
    if (!error) {
      setMessage("Роль пользователя изменена");
      loadUsers();
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const updateRequestStatus = async (id, status) => {
    const { error } = await supabase
      .from("requests")
      .update({ status })
      .eq("id", id);
    if (!error) {
      setMessage("Статус заявки изменён");
      loadRequests();
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteRequest = async (id) => {
    if (window.confirm("Удалить заявку?")) {
      await supabase.from("requests").delete().eq("id", id);
      loadRequests();
      setMessage("Заявка удалена");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const getStatusClass = (status) => {
    if (status === "approved") return "status-approved";
    if (status === "rejected") return "status-rejected";
    return "status-pending";
  };

  const getStatusText = (status) => {
    if (status === "approved") return "Одобрено";
    if (status === "rejected") return "Отклонено";
    return "На рассмотрении";
  };

  const getPriorityClass = (priority) => {
    if (priority === "Высокий") return "priority-high";
    if (priority === "Средний") return "priority-medium";
    return "priority-low";
  };

  const getRoleClass = (role) => {
    if (role === "admin") return "role-admin";
    if (role === "manager") return "role-manager";
    return "role-employee";
  };

  const getRoleText = (role) => {
    if (role === "admin") return "Администратор";
    if (role === "manager") return "Менеджер";
    return "Сотрудник";
  };

  const stats = {
    total: requests.length,
    approved: requests.filter((r) => r.status === "approved").length,
    pending: requests.filter((r) => r.status === "pending").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  if (loading) {
    return <div className="loading-container">Загрузка...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="container">
        <h1>Панель управления</h1>
        {message && <div className="admin-message">{message}</div>}

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
            Добавить
          </button>
        </div>

        {activeTab === "requests" && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Заявитель</th>
                  <th>Тема</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td className="request-id">{req.request_id}</td>
                    <td>{req.name}</td>
                    <td>{req.title}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(req.status)}`}
                      >
                        {getStatusText(req.status)}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <select
                        onChange={(e) =>
                          updateRequestStatus(req.id, e.target.value)
                        }
                        value={req.status}
                      >
                        <option value="pending">На рассмотрении</option>
                        <option value="approved">Одобрено</option>
                        <option value="rejected">Отклонено</option>
                      </select>
                      <button
                        onClick={() => deleteRequest(req.id)}
                        className="delete-btn"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
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
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{u.full_name}</td>
                    <td>
                      <span className={`role-badge ${getRoleClass(u.role)}`}>
                        {getRoleText(u.role)}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <select
                        onChange={(e) => updateUserRole(u.id, e.target.value)}
                        value={u.role}
                      >
                        <option value="employee">Сотрудник</option>
                        <option value="manager">Менеджер</option>
                        <option value="admin">Админ</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "add-user" && (
          <form onSubmit={addUser} className="add-user-form">
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="ФИО"
              value={newUser.full_name}
              onChange={(e) =>
                setNewUser({ ...newUser, full_name: e.target.value })
              }
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="employee">Сотрудник</option>
              <option value="manager">Менеджер</option>
              <option value="admin">Администратор</option>
            </select>
            <button type="submit">Добавить пользователя</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
