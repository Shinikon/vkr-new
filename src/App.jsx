import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsPage from "./pages/ProductsPage";
import ContactsPage from "./pages/ContactsPage";
import AuthPage from "./pages/AuthPage";
import ApprovalsPage from "./pages/ApprovalPage";
import CreateRequestPage from "./pages/CreateRequestPage";
import AdminPanel from "./pages/AdminPanel";
import "./styles/App.scss";


const IndexRedirect = () => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <HomePage />;
  }

  if (userRole === "admin" || userRole === "manager") {
    return <Navigate to="/approvals" replace />;
  }

  return <Navigate to="/request" replace />;
};


const Layout = ({ children, hideFooter = false }) => {
  return (
    <div className="app">
      <Header />
      <main className="main">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>

      <Route
        path="/"
        element={
          <Layout>
            <IndexRedirect />
          </Layout>
        }
      />
      <Route
        path="/about"
        element={
          <Layout>
            <AboutPage />
          </Layout>
        }
      />
      <Route
        path="/products"
        element={
          <Layout>
            <ProductsPage />
          </Layout>
        }
      />
      <Route
        path="/contacts"
        element={
          <Layout>
            <ContactsPage />
          </Layout>
        }
      />
      <Route
        path="/auth"
        element={
          <Layout>
            <AuthPage />
          </Layout>
        }
      />


      <Route
        path="/request"
        element={
          <ProtectedRoute>
            <Layout hideFooter={true}>
              <CreateRequestPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/approvals"
        element={
          <ProtectedRoute allowedRoles={["manager", "admin"]}>
            <Layout hideFooter={true}>
              <ApprovalsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout hideFooter={true}>
              <AdminPanel />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
