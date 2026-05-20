import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';

function ScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById('scroll-progress');
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const pct = scrollTop / (scrollHeight - clientHeight) * 100;
      if (bar) bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return <div id="scroll-progress" />;
}

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

function RouteShell({ children }) {
  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<RouteShell><HomePage /></RouteShell>} />
        <Route path="/login" element={<RouteShell><LoginPage /></RouteShell>} />
        <Route path="/register" element={<RouteShell><RegisterPage /></RouteShell>} />
        <Route path="/complete-profile" element={<ProtectedRoute><RouteShell><CompleteProfilePage /></RouteShell></ProtectedRoute>} />
        <Route path="/dashboard/*" element={<ProtectedRoute><RouteShell><DashboardPage /></RouteShell></ProtectedRoute>} />
        <Route path="/admin/*" element={<ProtectedRoute adminOnly><RouteShell><AdminPage /></RouteShell></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollProgress />
            <AnimatedRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
