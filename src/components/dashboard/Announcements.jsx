import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useAnnouncementsSocket } from '../../hooks/useWebSocket';
import { announcementsApi } from '../../api/services';

const priorityConfig = {
  HIGH:   { color:'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', dot:'bg-red-500', icon: AlertTriangle, text:'text-red-700 dark:text-red-400', badge:'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' },
  MEDIUM: { color:'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800', dot:'bg-amber-500', icon: Bell, text:'text-amber-700 dark:text-amber-400', badge:'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' },
  LOW:    { color:'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', dot:'bg-blue-400', icon: Info, text:'text-blue-700 dark:text-blue-400', badge:'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400' },
};

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await announcementsApi.getAll();
        const data = res.data?.data || res.data?.content || res.data;
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load announcements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  useAnnouncementsSocket((ann) => {
    setItems(prev => [{ ...ann, createdAt: new Date().toISOString() }, ...prev]);
  });

  return (
    <div className="max-w-3xl mx-auto space-y-4 w-full min-w-0">
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Real-time club updates. New announcements appear instantly.</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 flex justify-center items-center">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl">
          <p className="text-gray-400 dark:text-gray-500 text-sm">No announcements posted yet.</p>
        </div>
      ) : (
        items.map((ann) => {
          const cfg = priorityConfig[ann.priority?.toUpperCase()] || priorityConfig.MEDIUM;
          const Icon = cfg.icon;
          const isOpen = expanded === ann.id;
          return (
            <div key={ann.id} className={`rounded-xl border ${cfg.color} overflow-hidden transition-all duration-200`}>
              <button className="w-full flex items-start gap-3 p-4 text-left hover:opacity-90 transition-opacity"
                onClick={() => setExpanded(e => e === ann.id ? null : ann.id)}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-white/60 dark:bg-black/20`}>
                  <Icon size={14} className={cfg.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>{ann.priority}</span>
                    <span className="text-xs text-gray-400">{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{ann.title}</h3>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0 mt-1" />}
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40' : 'max-h-0'}`}>
                <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-14">{ann.body}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
