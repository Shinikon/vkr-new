
export const requestsDB = {

  activeRequests: [
    {
      id: "№10243",
      title: "Замена картриджей в бухгалтерии",
      status: "На рассмотрении",
      date: "Сегодня, 9:12",
      createdAt: "2026-04-29T09:12:00",
    },
    {
      id: "№10212",
      title: "Выдача новой спецодежды (Ц-2)",
      status: "Одобрено",
      date: "12.04.2026",
      createdAt: "2026-04-12T00:00:00",
    },
    {
      id: "№10198",
      title: "Ремонт вентиляции в цехе №3",
      status: "На рассмотрении",
      date: "11.04.2026",
      createdAt: "2026-04-11T00:00:00",
    },
    {
      id: "№10185",
      title: "Закупка канцтоваров",
      status: "Одобрено",
      date: "10.04.2026",
      createdAt: "2026-04-10T00:00:00",
    },
    {
      id: "№10172",
      title: "Настройка программного обеспечения",
      status: "На рассмотрении",
      date: "08.04.2026",
      createdAt: "2026-04-08T00:00:00",
    },
    {
      id: "№10165",
      title: "Замена освещения в коридоре",
      status: "Отклонено",
      date: "05.04.2026",
      createdAt: "2026-04-05T00:00:00",
    },
  ],


  getAllRequests: function () {
    return this.activeRequests;
  },


  addRequest: function (request) {
    const newId = this.generateId();
    const newRequest = {
      id: newId,
      ...request,
      date: this.formatDate(new Date()),
      createdAt: new Date().toISOString(),
    };
    this.activeRequests.unshift(newRequest);
    return newRequest;
  },


  generateId: function () {
    const lastId = this.activeRequests[0]?.id || "№10200";
    const num = parseInt(lastId.replace("№", "")) + 1;
    return `№${num}`;
  },


  formatDate: function (date) {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `Сегодня, ${hours}:${minutes}`;
    }
    return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`;
  },
};


export const priorities = [
  { value: "Высокий", label: "Высокий" },
  { value: "Средний", label: "Средний" },
  { value: "Низкий", label: "Низкий" },
];


export const statuses = {
  approved: { value: "Одобрено", className: "status-approved" },
  pending: { value: "На рассмотрении", className: "status-pending" },
  rejected: { value: "Отклонено", className: "status-rejected" },
};
