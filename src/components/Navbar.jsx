import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown, LogOut, LayoutDashboard, Shield, Sun, Moon, Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { announcementsApi } from '../api/services';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Activities', href: '#activities' },
  { label: 'Events', href: '#events' },
  { label: 'Workshops', href: '#workshops' },
  { label: 'Competitions', href: '#competitions' },
  { label: 'Projects', href: '#projects' },
  { label: 'Team', href: '#team' },
];

const SEARCH_DATA = [
  /* ... (kept same for brevity in this replacement block, but would ideally be imported or handled similarly) */
  { title: 'Arduino Workshop', type: 'Workshop', href: '#workshops' },
  { title: 'ROS2 & Robotics Workshop', type: 'Workshop', href: '#workshops' },
  { title: '5G Networks Workshop', type: 'Workshop', href: '#workshops' },
  { title: 'ROUTER Robo-Rumble 2025', type: 'Competition', href: '#competitions' },
  { title: 'ECE Innovation Showcase', type: 'Competition', href: '#competitions' },
  { title: 'Line Follower Robot', type: 'Project', href: '#projects' },
  { title: 'Smart Campus Energy Monitor', type: 'Project', href: '#projects' },
  { title: 'AI Traffic Flow Predictor', type: 'Project', href: '#projects' },
  { title: 'National Robotics Championship', type: 'Event', href: '#events' },
  { title: 'IoT & Smart Systems Workshop', type: 'Event', href: '#events' },
  { title: 'Join ROUTER', type: 'Page', href: '#join' },
  { title: 'Meet the Team', type: 'Page', href: '#team' },
];

const typeColors = {
  Workshop: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  Competition: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  Project: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
  Event: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  Page: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
};

const priorityDot = { high: 'bg-red-500', medium: 'bg-amber-500', low: 'bg-blue-500' };

function NotificationBell({ scrolled, dark }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [seenIds, setSeenIds] = useState(new Set());
  const ref = useRef(null);

  const loadData = async () => {
    try {
      const res = await announcementsApi.getAll();
      const data = res.data?.data || res.data?.content || res.data;
      if (Array.isArray(data)) {
        setItems(data);
        try { localStorage.setItem('router_announcements', JSON.stringify(data)); } catch { }
      } else {
        throw new Error('Not array');
      }
    } catch (err) {
      try {
        const stored = localStorage.getItem('router_announcements');
        setItems(stored ? JSON.parse(stored) : []);
      } catch { setItems([]); }
    }
    try {
      const seen = JSON.parse(localStorage.getItem('router_announcements_seen') || '[]');
      setSeenIds(new Set(seen));
    } catch { }
  };

  useEffect(() => {
    loadData();
    const handler = () => {
      try {
        const stored = localStorage.getItem('router_announcements');
        if (stored) setItems(JSON.parse(stored));
        const seen = JSON.parse(localStorage.getItem('router_announcements_seen') || '[]');
        setSeenIds(new Set(seen));
      } catch { }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const newCount = items.filter(a => !seenIds.has(a.id)).length;

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      const allIds = items.map(a => a.id);
      setSeenIds(new Set(allIds));
      try { localStorage.setItem('router_announcements_seen', JSON.stringify(allIds)); } catch { }
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={handleToggle}
        className={`relative p-2.5 rounded-xl transition-all duration-300 border ${scrolled || dark
          ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500/50 hover:text-blue-500'
          : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
          }`}>
        <Bell size={18} />
        {newCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center animate-pulse">
            {newCount > 9 ? '9+' : newCount}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-3 w-80 max-w-[min(20rem,calc(100vw-2rem))] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Bell size={13} className="text-blue-600" />
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Announcements</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{items.length} total</span>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/50">
              {items.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-400">No announcements</div>
              ) : items.map(a => {
                const isNew = !seenIds.has(a.id);
                return (
                  <div key={a.id} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityDot[a.priority] || 'bg-blue-500'} ${isNew ? 'animate-pulse' : 'opacity-40'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          {isNew && <span className="px-1 py-px bg-red-500 text-white text-[8px] font-black rounded uppercase leading-tight">NEW</span>}
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{a.date}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">{a.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">{a.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    setResults(SEARCH_DATA.filter(d => d.title.toLowerCase().includes(q)).slice(0, 6));
  }, [query]);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const go = (href) => {
    setQuery(''); setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-2 bg-slate-800/20 dark:bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-800 dark:text-white/80 focus-within:bg-slate-800/30 dark:focus-within:bg-white/10 focus-within:border-blue-500/50 transition-all w-full lg:w-64 backdrop-blur-md">
        <Search size={16} className="flex-shrink-0 opacity-70" />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search something..."
          className="bg-transparent text-sm placeholder-slate-500 dark:placeholder-white/30 outline-none w-full"
        />
        {query && <button onClick={() => setQuery('')}><X size={14} className="opacity-60 hover:opacity-100" /></button>}
      </div>
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 left-0 right-0 sm:right-auto sm:w-80 max-w-[min(20rem,calc(100vw-2rem))] sm:max-w-none mx-auto sm:mx-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
          >
            {results.map((r, i) => (
              <button key={i} onClick={() => go(r.href)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{r.title}</div>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold ${typeColors[r.type]}`}>{r.type}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (href) => {
    setMobileOpen(false);
    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
    else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => { logout(); setUserOpen(false); navigate('/'); };

  return (
    <>
      <Link
        to="/"
        className="fixed top-2 left-3 sm:left-6 md:left-8 md:top-1 z-[60] hidden lg:flex items-center group overflow-hidden"
      >
        <div className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto max-w-[40vw] overflow-hidden">
          <img
            src={(scrolled && !dark) ? "/router2.png" : "/router4.png"}
            alt="ROUTER Logo"
            className="h-full w-auto max-w-full object-contain scale-125 transition-all duration-300 group-hover:scale-130"
          />
        </div>
      </Link>

      <nav className={`fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 w-[min(100%,calc(100vw-1rem))] sm:w-[95%] max-w-7xl z-50 transition-all duration-500 rounded-[2rem] border px-4 sm:px-6 ${scrolled
        ? 'py-2 px-6 glass dark:glass-dark shadow-2xl shadow-blue-500/10 border-blue-500/20'
        : 'py-4 px-6 bg-transparent border-transparent'
        }`}>
        <div className="flex items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/5 dark:bg-white/5 p-1.5 rounded-2xl backdrop-blur-sm border border-black/5 dark:border-white/5">
            {NAV_LINKS.map(l => (
              <button key={l.href} onClick={() => scrollTo(l.href)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${scrolled || dark
                  ? 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}>
                {l.label}
              </button>
            ))}
          </div>

          <Link
            to="/"
            className="lg:hidden flex items-center shrink-0 min-w-0 py-1"
            onClick={() => setMobileOpen(false)}
          >
            <div className="h-9 w-auto max-w-[8.5rem] overflow-hidden">
              <img
                src={(scrolled && !dark) ? "/router2.png" : "/router4.png"}
                alt="ROUTER"
                className="h-full w-auto max-w-full object-contain object-left"
              />
            </div>
          </Link>

          {/* Right controls */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <SearchBar />

            <NotificationBell scrolled={scrolled} dark={dark} />

            <button onClick={toggle}
              className={`p-2.5 rounded-xl transition-all duration-300 border ${scrolled || dark
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500/50 hover:text-blue-500'
                : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                }`}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setUserOpen(o => !o)}
                  className={`flex items-center gap-3 px-2 py-2 rounded-2xl transition-all duration-300 border ${scrolled || dark
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    : 'bg-white/10 border-white/10'
                    }`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/20">
                    {user.name?.charAt(0)}
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${userOpen ? 'rotate-180' : ''} ${scrolled || dark ? 'text-slate-600 dark:text-slate-400' : 'text-white'
                    }`} />
                </button>
                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-3 w-56 glass dark:glass-dark rounded-[2rem] shadow-2xl border border-blue-500/10 overflow-hidden p-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 mb-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      </div>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
                          <Shield size={16} className="text-red-500" /> Admin Panel
                        </Link>
                      )}
                      <Link to="/dashboard" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
                        <LayoutDashboard size={16} className="text-blue-600" /> Dashboard
                      </Link>
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors mt-1">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-2.5 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95">
                <User size={16} /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile controls */}
          <div className="lg:hidden flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
            <button onClick={toggle} className={`p-2 rounded-xl border ${scrolled || dark ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800' : 'bg-white/10 border-white/10 text-white'
              }`}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setMobileOpen(o => !o)} className={`p-2 rounded-xl border ${scrolled || dark ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800' : 'bg-white/10 border-white/10 text-white'
              }`}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 flex flex-col gap-3 max-h-[min(70vh,calc(100dvh-6rem))] overflow-y-auto overscroll-contain">
                <SearchBar />
                <div className="flex flex-col gap-1">
                  {NAV_LINKS.map(l => (
                    <button key={l.href} onClick={() => scrollTo(l.href)}
                      className="flex items-center px-4 py-3 rounded-2xl text-base font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                      {l.label}
                    </button>
                  ))}
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                {user ? (
                  <div className="flex flex-col gap-1">
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center px-4 py-3 rounded-2xl text-base font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">Dashboard</Link>
                    <button onClick={handleLogout} className="flex items-center px-4 py-3 rounded-2xl text-base font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">Sign Out</button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center bg-blue-600 text-white py-4 rounded-2xl font-bold">Sign In</Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
