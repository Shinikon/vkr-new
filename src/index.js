import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryClient";

const root = ReactDOM.createRoot(document.getElementById("root"));
/* root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
); */


root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
