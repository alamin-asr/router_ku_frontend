import { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LayoutDashboard, BookOpen, Trophy, FolderKanban, Bell, LogOut, Menu, X, Home, Shield } from 'lucide-react';
import Profile from '../components/dashboard/Profile';
import MyWorkshops from '../components/dashboard/MyWorkshops';
import MyCompetitions from '../components/dashboard/MyCompetitions';
import DashboardProjects from '../components/dashboard/DashboardProjects';
import Announcements from '../components/dashboard/Announcements';

const NAV = [
  { path:'/dashboard', label:'Profile', icon: LayoutDashboard, exact:true },
  { path:'/dashboard/workshops', label:'My Workshops', icon: BookOpen },
  { path:'/dashboard/competitions', label:'My Competitions', icon: Trophy },
  { path:'/dashboard/projects', label:'Projects', icon: FolderKanban },
  { path:'/dashboard/announcements', label:'Announcements', icon: Bell },
];

export default function DashboardPage() {
  const { user, logout, isAdmin } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('Signed out. See you soon!');
    navigate('/');
  };

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path) && (exact || path !== '/dashboard' || location.pathname === '/dashboard');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex overflow-x-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col transition-transform duration-300 overflow-y-auto
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <Link to="/" className="font-heading text-xl font-bold text-blue-700 dark:text-blue-400 tracking-widest">ROUTER</Link>
          <p className="text-xs text-gray-400 mt-0.5">Member Dashboard</p>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-sm font-heading flex-shrink-0">
              {user?.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 dark:text-white text-sm truncate">{user?.name}</div>
              <div className="text-xs text-gray-400 truncate">{user?.email}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(item => (
            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(item.path, item.exact)
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}>
              <item.icon size={17} /> {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
          {isAdmin && (
            <Link to="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <Shield size={17} /> Admin Panel
            </Link>
          )}
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Home size={17} /> Home
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Menu size={20} />
          </button>
          <span className="font-heading font-bold text-blue-700 dark:text-blue-400">ROUTER</span>
          <div className="w-8" />
        </div>

        <main className="p-4 sm:p-6 lg:p-8 w-full min-w-0 max-w-full">
          <Routes>
            <Route index element={<Profile />} />
            <Route path="workshops" element={<MyWorkshops />} />
            <Route path="competitions" element={<MyCompetitions />} />
            <Route path="projects" element={<DashboardProjects />} />
            <Route path="announcements" element={<Announcements />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
