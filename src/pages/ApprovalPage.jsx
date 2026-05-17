import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

const ApprovalsPage = () => {
  const { user, userRole } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [comments, setComments] = useState({});

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);

    let query = supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (userRole === "employee") {
      const { data: currentUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", user?.email)
        .single();
      if (currentUser) {
        query = query.eq("user_id", currentUser.id);
      }
    }

    const { data } = await query;
    setRequests(data || []);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    setUpdating(id);
    await supabase.from("requests").update({ status }).eq("id", id);
    await loadRequests();
    setUpdating(null);
  };

  const handleCommentChange = (id, value) => {
    setComments((prev) => ({ ...prev, [id]: value }));
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка заявок...</p>
      </div>
    );
  }

  return (
    <div className="approvals-page">
      <div className="container">
        <div className="approvals-header">
          <h1 className="approvals-header__title">Лента согласований</h1>
          <p className="approvals-header__subtitle">
            ФКП Авангард · Федеральное казённое предприятие
          </p>
        </div>

        <div className="approvals-list">
          {requests.length === 0 ? (
            <div className="approval-card">
              <p style={{ textAlign: "center", padding: "20px" }}>
                Нет активных заявок
              </p>
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="approval-card">
                <div className="approval-card__header">
                  <div className="approval-card__user">
                    <div className="approval-card__avatar">
                      {request.initials || "??"}
                    </div>
                    <div className="approval-card__user-info">
                      <h3>{request.name}</h3>
                      <p>
                        {request.workshop}, {request.position}
                      </p>
                    </div>
                  </div>
                  <div className="approval-card__meta">
                    <span
                      className={`approval-card__priority ${getPriorityClass(request.priority)}`}
                    >
                      Приоритет: {request.priority}
                    </span>
                    <span className="approval-card__deadline">
                      Срок: {request.deadline}
                    </span>
                    <span className="approval-card__id">
                      {request.request_id}
                    </span>
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
                      rows="2"
                    />
                  </div>
                </div>

                <div className="approval-card__status">
                  <span
                    className={`status-badge ${getStatusClass(request.status)}`}
                  >
                    {getStatusText(request.status)}
                  </span>
                </div>

                <div className="approval-card__actions">
                  <button
                    className={`approval-card__btn approval-card__btn--approved ${request.status === "approved" ? "approval-card__btn--active" : ""}`}
                    onClick={() => updateStatus(request.id, "approved")}
                    disabled={updating === request.id}
                  >
                    Одобрено
                  </button>
                  <button
                    className={`approval-card__btn approval-card__btn--pending ${request.status === "pending" ? "approval-card__btn--active" : ""}`}
                    onClick={() => updateStatus(request.id, "pending")}
                    disabled={updating === request.id}
                  >
                    На рассмотрении
                  </button>
                  <button
                    className={`approval-card__btn approval-card__btn--rejected ${request.status === "rejected" ? "approval-card__btn--active" : ""}`}
                    onClick={() => updateStatus(request.id, "rejected")}
                    disabled={updating === request.id}
                  >
                    Отклонить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalsPage;
