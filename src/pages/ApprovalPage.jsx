import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { getCached, setCached } from "../services/cache";

const ApprovalsPage = () => {
  const { userRole } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [savingCommentId, setSavingCommentId] = useState(null);
  const [comments, setComments] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 5;

  const loadRequests = async (isInitial = true) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const from = (page - 1) * itemsPerPage;
      const to = page * itemsPerPage - 1;
      const cacheKey = `requests_page_${page}_role_${userRole}`;

      // Проверяем кэш
      if (isInitial) {
        const cached = getCached(cacheKey, 30000);
        if (cached) {
          setRequests(cached.data);
          setTotalCount(cached.totalCount);
          setHasMore(cached.hasMore);
          setLoading(false);
          return;
        }
      }

      let query = supabase
        .from("requests")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (userRole === "employee") {
        const { data: userData } = await supabase
          .from("users")
          .select("id")
          .eq("email", (await supabase.auth.getUser()).data.user?.email)
          .maybeSingle();
        if (userData) {
          query = query.eq("user_id", userData.id);
        }
      }

      const { data, error, count } = await query;

      if (error) throw error;

      const resultData = data || [];
      const resultHasMore = data?.length === itemsPerPage;

      // Сохраняем в кэш
      if (isInitial) {
        setCached(cacheKey, {
          data: resultData,
          totalCount: count || 0,
          hasMore: resultHasMore,
        });
      }

      if (isInitial) {
        setRequests(resultData);
      } else {
        setRequests((prev) => [...prev, ...resultData]);
      }

      setTotalCount(count || 0);
      setHasMore(resultHasMore);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    loadRequests(true);
  }, []);

  useEffect(() => {
    if (page > 1) {
      loadRequests(false);
    }
  }, [page]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from("requests")
        .update({ status })
        .eq("id", id);
      if (error) throw error;

      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status } : req)),
      );
    } catch (err) {
      console.error("Ошибка обновления:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const saveComment = async (id, comment) => {
    if (!comment || comment.trim() === "") return;
    setSavingCommentId(id);
    try {
      const { error } = await supabase
        .from("requests")
        .update({ comment })
        .eq("id", id);
      if (error) throw error;

      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, comment } : req)),
      );
      setComments((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Ошибка сохранения комментария:", err);
    } finally {
      setSavingCommentId(null);
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

  const canEdit = userRole === "manager" || userRole === "admin";

  if (loading) {
    return (
      <div className="approvals-page">
        <div className="container">
          <div className="approvals-header">
            <h1 className="approvals-header__title">Лента согласований</h1>
            <p className="approvals-header__subtitle">
              ФКП Авангард · Федеральное казённое предприятие
            </p>
          </div>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка заявок...</p>
          </div>
        </div>
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
          {totalCount > 0 && (
            <p className="total-count">Всего заявок: {totalCount}</p>
          )}
        </div>

        {requests.length === 0 ? (
          <div className="empty-list">Нет активных заявок</div>
        ) : (
          <>
            <div className="approvals-list">
              {requests.map((request) => (
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
                          rows="2"
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
                          disabled={savingCommentId === request.id}
                        >
                          {savingCommentId === request.id
                            ? "Сохранение..."
                            : "Сохранить"}
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
                        className="approval-card__btn approval-card__btn--approved"
                        onClick={() => updateStatus(request.id, "approved")}
                        disabled={updatingId === request.id}
                      >
                        Одобрено
                      </button>
                      <button
                        className="approval-card__btn approval-card__btn--pending"
                        onClick={() => updateStatus(request.id, "pending")}
                        disabled={updatingId === request.id}
                      >
                        На рассмотрении
                      </button>
                      <button
                        className="approval-card__btn approval-card__btn--rejected"
                        onClick={() => updateStatus(request.id, "rejected")}
                        disabled={updatingId === request.id}
                      >
                        Отклонить
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="load-more-container">
                <button
                  className="load-more-btn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Загрузка..." : "Загрузить ещё"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ApprovalsPage;
