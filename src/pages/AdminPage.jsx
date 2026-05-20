import { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LayoutDashboard, Users, Calendar, BookOpen, Trophy, FolderKanban, Bell, LogOut, Menu, Home, ClipboardList } from 'lucide-react';
import AdminOverview from './admin/AdminOverview';
import AdminMembers from './admin/AdminMembers';
import AdminEvents from './admin/AdminEvents';
import AdminWorkshops from './admin/AdminWorkshops';
import AdminCompetitions from './admin/AdminCompetitions';
import AdminProjects from './admin/AdminProjects';
import AdminAnnouncements from './admin/AdminAnnouncements';
import AdminWorkshopRegistrations from './admin/AdminWorkshopRegistrations';
import AdminCompetitionRegistrations from './admin/AdminCompetitionRegistrations';

const NAV = [
  { path:'/admin', label:'Overview', icon: LayoutDashboard, exact:true },
  { path:'/admin/members', label:'Members', icon: Users },
  { path:'/admin/events', label:'Events', icon: Calendar },
  { path:'/admin/workshops', label:'Workshops', icon: BookOpen },
  { path:'/admin/workshop-registrations', label:'Workshop Regs', icon: ClipboardList },
  { path:'/admin/competitions', label:'Competitions', icon: Trophy },
  { path:'/admin/competition-registrations', label:'Competition Regs', icon: ClipboardList },
  { path:'/admin/projects', label:'Projects', icon: FolderKanban },
  { path:'/admin/announcements', label:'Announcements', icon: Bell },
];

export default function AdminPage() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); toast.info('Signed out.'); navigate('/'); };

  const isActive = (path, exact) => exact ? location.pathname === path : location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex overflow-x-hidden">
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 max-w-[85vw] bg-gray-950 flex flex-col transition-transform duration-300 overflow-y-auto
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="p-5 border-b border-gray-800">
          <div className="font-heading text-xl font-bold text-white tracking-widest">ROUTER</div>
          <div className="text-xs text-gray-500 mt-0.5">Admin Panel</div>
        </div>
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{user?.name?.charAt(0)}</div>
            <div className="min-w-0">
              <div className="text-white text-sm font-medium truncate">{user?.name}</div>
              <div className="text-red-400 text-xs">Administrator</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(item => (
            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(item.path, item.exact)
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}>
              <item.icon size={16} /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800 space-y-0.5">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"><Home size={16} />Home</Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"><LogOut size={16} />Sign Out</button>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <div className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-gray-950 border-b border-gray-800 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg text-gray-400 hover:text-white"><Menu size={20} /></button>
          <span className="font-heading font-bold text-white">Admin</span>
          <div className="w-8" />
        </div>
        <main className="p-4 sm:p-6 lg:p-8 w-full min-w-0 max-w-full">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="workshops" element={<AdminWorkshops />} />
            <Route path="workshop-registrations" element={<AdminWorkshopRegistrations />} />
            <Route path="competitions" element={<AdminCompetitions />} />
            <Route path="competition-registrations" element={<AdminCompetitionRegistrations />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
