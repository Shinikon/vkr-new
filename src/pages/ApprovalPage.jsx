import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

const ApprovalsPage = () => {
  const { userRole } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState({});
  const [savingCommentId, setSavingCommentId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const itemsPerPage = 15;

  // Запрос заявок с пагинацией
  const { data, isLoading, isFetchingNextPage } = useQuery({
    queryKey: ["requests", page],
    queryFn: async () => {
      const from = (page - 1) * itemsPerPage;
      const to = page * itemsPerPage - 1;

      const { data, error, count } = await supabase
        .from("requests")
        .select(
          "id, request_id, name, initials, workshop, position, priority, deadline, title, description, status, comment, created_at",
          { count: "exact" },
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return {
        data: data || [],
        totalCount: count || 0,
        hasMore: data?.length === itemsPerPage,
      };
    },
    staleTime: 30000,
  });

  const requests = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const hasMore = data?.hasMore || false;

  // Мутация обновления статуса
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { error } = await supabase
        .from("requests")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      return { id, status };
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["requests", page] });
      const previousRequests = queryClient.getQueryData(["requests", page]);
      queryClient.setQueryData(["requests", page], (old) => ({
        ...old,
        data:
          old?.data?.map((req) => (req.id === id ? { ...req, status } : req)) ||
          [],
      }));
      return { previousRequests };
    },
    onError: (err, variables, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(["requests", page], context.previousRequests);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["requests", page] });
      setUpdatingId(null);
    },
  });

  // Мутация сохранения комментария
  const saveCommentMutation = useMutation({
    mutationFn: async ({ id, comment }) => {
      const { error } = await supabase
        .from("requests")
        .update({ comment })
        .eq("id", id);
      if (error) throw error;
      return { id, comment };
    },
    onMutate: async ({ id, comment }) => {
      await queryClient.cancelQueries({ queryKey: ["requests", page] });
      queryClient.setQueryData(["requests", page], (old) => ({
        ...old,
        data:
          old?.data?.map((req) =>
            req.id === id ? { ...req, comment } : req,
          ) || [],
      }));
      setComments((prev) => ({ ...prev, [id]: "" }));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["requests", page] });
      setSavingCommentId(null);
    },
  });

  const handleUpdateStatus = (id, status) => {
    setUpdatingId(id);
    updateStatusMutation.mutate({ id, status });
  };

  const handleSaveComment = (id, comment) => {
    if (!comment || comment.trim() === "") return;
    setSavingCommentId(id);
    saveCommentMutation.mutate({ id, comment });
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

  if (isLoading) {
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
                            setComments((prev) => ({
                              ...prev,
                              [request.id]: e.target.value,
                            }))
                          }
                          rows="2"
                        />
                        <button
                          className="comment-save-btn"
                          onClick={() =>
                            handleSaveComment(
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
                        onClick={() =>
                          handleUpdateStatus(request.id, "approved")
                        }
                        disabled={updatingId === request.id}
                      >
                        Одобрено
                      </button>
                      <button
                        className="approval-card__btn approval-card__btn--pending"
                        onClick={() =>
                          handleUpdateStatus(request.id, "pending")
                        }
                        disabled={updatingId === request.id}
                      >
                        На рассмотрении
                      </button>
                      <button
                        className="approval-card__btn approval-card__btn--rejected"
                        onClick={() =>
                          handleUpdateStatus(request.id, "rejected")
                        }
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
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Загрузка..." : "Загрузить ещё"}
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
