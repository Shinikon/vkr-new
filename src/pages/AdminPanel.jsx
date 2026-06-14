import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [message, setMessage] = useState("");
  const [requestsPage, setRequestsPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [hasMoreRequests, setHasMoreRequests] = useState(true);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 15;

  const [newUser, setNewUser] = useState({
    email: "",
    full_name: "",
    role: "employee",
    password: "",
  });

  const loadRequests = async (isInitial = true) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const from = (requestsPage - 1) * itemsPerPage;
      const to = requestsPage * itemsPerPage - 1;

      const { data, error, count } = await supabase
        .from("requests")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (isInitial) {
        setRequests(data || []);
      } else {
        setRequests((prev) => [...prev, ...(data || [])]);
      }

      setTotalCount(count || 0);
      setHasMoreRequests(data?.length === itemsPerPage);
    } catch (err) {
      console.error("Ошибка загрузки заявок:", err);
      setMessage("Ошибка загрузки заявок");
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const loadUsers = async (isInitial = true) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const from = (usersPage - 1) * itemsPerPage;
      const to = usersPage * itemsPerPage - 1;

      const { data, error, count } = await supabase
        .from("users")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (isInitial) {
        setUsers(data || []);
      } else {
        setUsers((prev) => [...prev, ...(data || [])]);
      }

      setHasMoreUsers(data?.length === itemsPerPage);
    } catch (err) {
      console.error("Ошибка загрузки пользователей:", err);
      setMessage("Ошибка загрузки пользователей");
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    if (activeTab === "requests") {
      loadRequests(true);
    } else if (activeTab === "users") {
      loadUsers(true);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "requests" && requestsPage > 1) {
      loadRequests(false);
    } else if (activeTab === "users" && usersPage > 1) {
      loadUsers(false);
    }
  }, [requestsPage, usersPage, activeTab]);

  const loadMoreRequests = () => {
    if (!loadingMore && hasMoreRequests) {
      setRequestsPage((prev) => prev + 1);
    }
  };

  const loadMoreUsers = () => {
    if (!loadingMore && hasMoreUsers) {
      setUsersPage((prev) => prev + 1);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();

    if (!newUser.email || !newUser.full_name || !newUser.password) {
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

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: { full_name: newUser.full_name },
        },
      });

      if (authError) {
        if (authError.message.includes("rate limit")) {
          setMessage("Слишком много попыток. Подождите минуту.");
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
            `Пользователь ${newUser.email} добавлен! Пароль: ${newUser.password}`,
          );
          setNewUser({
            email: "",
            full_name: "",
            role: "employee",
            password: "",
          });
          setUsersPage(1);
          loadUsers(true);
        }
      }
    } catch (err) {
      setMessage(`Ошибка: ${err.message}`);
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
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)),
      );
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteUser = async (id, email) => {
    if (window.confirm(`Удалить пользователя ${email}?`)) {
      const { error } = await supabase.from("users").delete().eq("id", id);
      if (!error) {
        setMessage(`Пользователь ${email} удалён`);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      }
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const updateRequestStatus = async (id, status) => {
    const { error } = await supabase
      .from("requests")
      .update({ status })
      .eq("id", id);
    if (!error) {
      setMessage("Статус заявки изменён");
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      );
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteRequest = async (id) => {
    if (window.confirm("Удалить заявку?")) {
      const { error } = await supabase.from("requests").delete().eq("id", id);
      if (!error) {
        setMessage("Заявка удалена");
        setRequests((prev) => prev.filter((r) => r.id !== id));
      }
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
    total: totalCount,
    approved: requests.filter((r) => r.status === "approved").length,
    pending: requests.filter((r) => r.status === "pending").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  if (loading && activeTab !== "add-user") {
    return (
      <div className="admin-panel">
        <div className="container">
          <div className="admin-header">
            <h1>Панель управления</h1>
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Загрузка...</p>
            </div>
          </div>
        </div>
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
            onClick={() => {
              setActiveTab("requests");
              setRequestsPage(1);
            }}
          >
            Заявки ({totalCount})
          </button>
          <button
            className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("users");
              setUsersPage(1);
            }}
          >
            Пользователи
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
                  <th>№</th>
                  <th>Заявитель</th>
                  <th>Тема</th>
                  <th>Приоритет</th>
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
                        className={`priority-badge ${getPriorityClass(req.priority)}`}
                      >
                        {req.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(req.status)}`}
                      >
                        {getStatusText(req.status)}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <select
                        value={req.status}
                        onChange={(e) =>
                          updateRequestStatus(req.id, e.target.value)
                        }
                        className="status-select"
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

            {hasMoreRequests && (
              <div className="load-more-container">
                <button
                  onClick={loadMoreRequests}
                  className="load-more-btn"
                  disabled={loadingMore}
                >
                  {loadingMore ? "Загрузка..." : "Загрузить ещё"}
                </button>
              </div>
            )}
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
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value)}
                        className="role-select"
                      >
                        <option value="employee">Сотрудник</option>
                        <option value="manager">Менеджер</option>
                        <option value="admin">Администратор</option>
                      </select>
                      <button
                        onClick={() => deleteUser(u.id, u.email)}
                        className="delete-btn"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {hasMoreUsers && (
              <div className="load-more-container">
                <button
                  onClick={loadMoreUsers}
                  className="load-more-btn"
                  disabled={loadingMore}
                >
                  {loadingMore ? "Загрузка..." : "Загрузить ещё"}
                </button>
              </div>
            )}
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
                <label className="form-label">Пароль</label>
                <input
                  type="password"
                  className="form-input"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder="придумайте пароль"
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
              После добавления пользователь может войти с указанным email и
              паролем
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
