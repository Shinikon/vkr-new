import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

const ApprovalsPage = () => {
  const { userRole } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [comments, setComments] = useState({});
  const [savingComment, setSavingComment] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const { error } = await supabase
        .from("requests")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      await loadRequests();
    } catch (err) {
      console.error("Ошибка обновления:", err);
    } finally {
      setUpdating(null);
    }
  };

  const saveComment = async (id, comment) => {
    if (!comment || comment.trim() === "") return;
    setSavingComment(id);
    try {
      const { error } = await supabase
        .from("requests")
        .update({ comment })
        .eq("id", id);
      if (error) throw error;
      setComments((prev) => ({ ...prev, [id]: "" }));
      await loadRequests();
    } catch (err) {
      console.error("Ошибка сохранения комментария:", err);
    } finally {
      setSavingComment(null);
    }
  };

  const handleCommentChange = (id, value) => {
    setComments((prev) => ({ ...prev, [id]: value }));
  };

  const getPriorityClass = (priority) => {
    if (priority === "Высокий") return "priority-high";
    if (priority === "Средний") return "priority-medium";
    return "priority-low";
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка заявок...</p>
      </div>
    );
  }

  const canEdit = userRole === "manager" || userRole === "admin";

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
            <div className="empty-list">Нет активных заявок</div>
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

                  {request.comment && (
                    <div className="approval-card__saved-comment">
                      <strong>Комментарий:</strong>
                      <p>{request.comment}</p>
                    </div>
                  )}

                  {canEdit && (
                    <div className="approval-card__comment">
                      <textarea
                        className="approval-card__textarea"
                        placeholder="Введите комментарий к заявке..."
                        value={
                          comments[request.id] !== undefined
                            ? comments[request.id]
                            : request.comment || ""
                        }
                        onChange={(e) =>
                          handleCommentChange(request.id, e.target.value)
                        }
                        rows="3"
                      />
                      <button
                        className="comment-save-btn"
                        onClick={() =>
                          saveComment(
                            request.id,
                            comments[request.id] !== undefined
                              ? comments[request.id]
                              : request.comment || "",
                          )
                        }
                        disabled={savingComment === request.id}
                      >
                        {savingComment === request.id
                          ? "Сохранение..."
                          : "Сохранить комментарий"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="approval-card__status">
                  <span
                    className={`status-badge ${getStatusClass(request.status)}`}
                  >
                    {getStatusText(request.status)}
                  </span>
                </div>

                {canEdit && (
                  <div className="approval-card__actions">
                    <button
                      className={`approval-card__btn approval-card__btn--approved`}
                      onClick={() => updateStatus(request.id, "approved")}
                      disabled={updating === request.id}
                    >
                      Одобрено
                    </button>
                    <button
                      className={`approval-card__btn approval-card__btn--pending`}
                      onClick={() => updateStatus(request.id, "pending")}
                      disabled={updating === request.id}
                    >
                      На рассмотрении
                    </button>
                    <button
                      className={`approval-card__btn approval-card__btn--rejected`}
                      onClick={() => updateStatus(request.id, "rejected")}
                      disabled={updating === request.id}
                    >
                      Отклонить
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalsPage;
