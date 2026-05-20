import { useState, useEffect } from 'react';
import { Bell, X, ChevronDown, ChevronUp, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { announcementsApi } from '../api/services';

const STORAGE_KEY = 'router_announcements';
const SEEN_KEY = 'router_announcements_seen';

const priorityStyles = {
  high: { border: 'border-red-500/30', dot: 'bg-red-500', badge: 'bg-red-500/15 text-red-600 dark:text-red-400', label: 'Urgent' },
  medium: { border: 'border-amber-500/30', dot: 'bg-amber-500', badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400', label: 'Notice' },
  low: { border: 'border-blue-500/30', dot: 'bg-blue-500', badge: 'bg-blue-500/15 text-blue-600 dark:text-blue-400', label: 'Info' },
};

export default function AnnouncementsBanner() {
  const [items, setItems] = useState([]);
  const [seenIds, setSeenIds] = useState(new Set());
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        const res = await announcementsApi.getAll();
        const data = res.data?.data || res.data?.content || res.data;
        if (Array.isArray(data)) {
          setItems(data);
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
        } else {
          throw new Error('Not array');
        }
      } catch (err) {
        console.warn('Failed to fetch announcements, reading from cache:', err);
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          setItems(stored ? JSON.parse(stored) : []);
        } catch {
          setItems([]);
        }
      }

      try {
        const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]');
        setSeenIds(new Set(seen));
      } catch {}
    };

    load();
  }, []);

  const visible = items.filter(a => !dismissed.has(a.id));
  const newCount = visible.filter(a => !seenIds.has(a.id)).length;

  const markAllSeen = () => {
    const allIds = items.map(a => a.id);
    setSeenIds(new Set(allIds));
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(allIds)); } catch {}
  };

  const dismiss = (id) => {
    setDismissed(prev => new Set([...prev, id]));
  };

  const toggleExpand = () => {
    setExpanded(e => !e);
    if (!expanded) markAllSeen();
  };

  if (visible.length === 0) return null;

  const topItem = visible[0];
  const topStyle = priorityStyles[topItem.priority] || priorityStyles.low;

  return (
    <div className="w-full bg-slate-900 dark:bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Collapsed strip — always visible */}
        <button
          onClick={toggleExpand}
          className="w-full flex items-center gap-3 py-3 group"
        >
          {/* Icon + label */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <Megaphone size={16} className="text-blue-400" />
              {newCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-black text-white animate-pulse">
                  {newCount > 9 ? '9+' : newCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">
              Announcements
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-slate-700 flex-shrink-0" />

          {/* Latest announcement preview */}
          <div className="flex-1 flex items-center gap-2 min-w-0 text-left">
            {!seenIds.has(topItem.id) && (
              <span className="flex-shrink-0 px-1.5 py-0.5 bg-red-500 rounded text-[9px] font-black text-white uppercase tracking-widest">
                NEW
              </span>
            )}
            <span className={`text-xs font-semibold truncate ${topStyle.badge.split(' ').find(c => c.startsWith('text-')) || 'text-blue-400'}`}>
              {topItem.title}
            </span>
            {visible.length > 1 && (
              <span className="flex-shrink-0 text-[10px] text-slate-500 font-bold hidden sm:block">
                +{visible.length - 1} more
              </span>
            )}
          </div>

          {/* Expand toggle */}
          <div className="flex-shrink-0 text-slate-500 group-hover:text-slate-300 transition-colors">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {/* Expanded panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pb-4 space-y-2 border-t border-slate-800 pt-3">
                {visible.map(a => {
                  const st = priorityStyles[a.priority] || priorityStyles.low;
                  const isNew = !seenIds.has(a.id);
                  return (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className={`flex items-start gap-3 p-3 rounded-xl border ${st.border} bg-slate-800/50 group/item`}
                    >
                      <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${st.dot} ${isNew ? 'animate-pulse' : 'opacity-50'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          {isNew && (
                            <span className="px-1.5 py-0.5 bg-red-500 rounded text-[9px] font-black text-white uppercase">NEW</span>
                          )}
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${st.badge}`}>
                            {st.label}
                          </span>
                          <span className="text-[9px] text-slate-500 font-bold">{a.date}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-200 mb-0.5">{a.title}</p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{a.body}</p>
                      </div>
                      <button
                        onClick={() => dismiss(a.id)}
                        className="flex-shrink-0 p-1 text-slate-600 hover:text-slate-300 transition-colors opacity-0 group-hover/item:opacity-100"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
