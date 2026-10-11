import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import Admin from '@/pages/Admin';
import AdminLogin from '@/pages/AdminLogin';
import { ToastContainer } from '@/components/Toast';
import { LanguageProvider } from '@/components/LanguageContext';
import { MaintenanceProvider } from '@/components/MaintenanceProvider';

function ProtectedAdmin() {
  const token = sessionStorage.getItem('__adm_token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Admin />;
}

export default function App() {
  return (
    <MaintenanceProvider>
    <LanguageProvider>
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdmin />} />
      </Routes>
    </BrowserRouter>
    </LanguageProvider>
    </MaintenanceProvider>
  );
}
