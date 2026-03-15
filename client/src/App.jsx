import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import ItemDetail from "./pages/ItemDetail";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./component/ProtectedRoute";
import Layout from "./layouts/Layout";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes wrapped in Layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/report-lost" element={
          <ProtectedRoute>
            <Layout>
              <ReportLost />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/lost-items" element={
          <ProtectedRoute>
            <Layout>
              <LostItems />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/report-found" element={
          <ProtectedRoute>
            <Layout>
              <ReportFound />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/found-items" element={
          <ProtectedRoute>
            <Layout>
              <FoundItems />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/item/:id" element={
          <ProtectedRoute>
            <Layout>
              <ItemDetail />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Redirect empty path to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Wildcard 404 - could add a page later */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;