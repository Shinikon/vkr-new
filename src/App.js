import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsPage from "./pages/ProductsPage";
import ContactsPage from "./pages/ContactsPage";
import AuthPage from "./pages/AuthPage";
import ApprovalsPage from "./pages/ApprovalPage";
import CreateRequestPage from "./pages/CreateRequestPage";

const App = () => {
  return (
    <BrowserRouter basename="/vkr">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/approvals" element={<ApprovalsPage />} />
        <Route path="/request" element={<CreateRequestPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
