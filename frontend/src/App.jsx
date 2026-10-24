import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Modules from './pages/Modules';
import UserProfile from './pages/UserProfile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Перенаправляем со стартовой страницы сразу на логин */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}