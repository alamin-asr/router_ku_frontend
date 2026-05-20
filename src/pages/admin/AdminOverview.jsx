import { useApi } from '../../hooks/useApi';
import { adminApi, workshopsApi, eventsApi } from '../../api/services';
import { Users, BookOpen, Trophy, Calendar, FolderKanban, Bell, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminOverview() {
  const { data: stats, loading: sLoading } = useApi(() => adminApi.getStats());
  const { data: workshops } = useApi(() => workshopsApi.getAll());
  const { data: upcoming } = useApi(() => eventsApi.getUpcoming());
  const { data: membersData } = useApi(() => adminApi.getMembers({ size: 5 }));
  const members = Array.isArray(membersData) ? membersData : (membersData?.content || []);

  const statCards = stats ? [
    { label: 'Total Members', value: stats.totalMembers, icon: Users, color: 'text-blue-700', bg: 'bg-blue-50', path: '/admin/members' },
    { label: 'Events', value: stats.totalEvents, icon: Calendar, color: 'text-emerald-700', bg: 'bg-emerald-50', path: '/admin/events' },
    { label: 'Workshops', value: stats.totalWorkshops, icon: BookOpen, color: 'text-violet-700', bg: 'bg-violet-50', path: '/admin/workshops' },
    { label: 'Competitions', value: stats.totalCompetitions, icon: Trophy, color: 'text-amber-700', bg: 'bg-amber-50', path: '/admin/competitions' },
    { label: 'Projects', value: stats.totalProjects, icon: FolderKanban, color: 'text-rose-700', bg: 'bg-rose-50', path: '/admin/projects' },
    { label: 'Announcements', value: stats.totalAnnouncements, icon: Bell, color: 'text-cyan-700', bg: 'bg-cyan-50', path: '/admin/announcements' },
  ] : [];

  if (sLoading) return <div className="flex items-center justify-center h-64"><Loader2 size={32} className="animate-spin text-blue-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 w-full min-w-0">
      <div><h1 className="font-heading text-2xl font-bold text-gray-900">Admin Overview</h1><p className="text-gray-500 text-sm mt-1">Manage all ROUTER club content.</p></div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, path }) => (
          <Link key={label} to={path} className="bg-white rounded-xl border border-gray-100 p-4 card-hover text-center group">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform`}>
              <Icon size={18} className={color} />
            </div>
            <div className={`font-heading text-lg sm:text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-gray-400 font-medium mt-0.5 leading-tight">{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-bold text-gray-900">Recent Members</h3>
            <Link to="/admin/members" className="text-xs text-blue-600 font-medium hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {(members || []).map(u => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{u.name?.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{u.name}</div>
                  <div className="text-xs text-gray-400 truncate">{u.email}</div>
                </div>
                <span className={`badge text-xs ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-bold text-gray-900">Workshop Registrations</h3>
            <Link to="/admin/workshops" className="text-xs text-blue-600 font-medium hover:underline">Manage →</Link>
          </div>
          <div className="space-y-3">
            {(workshops || []).map(w => {
              const pct = Math.round((w.registeredCount / w.totalSeats) * 100);
              return (
                <div key={w.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium truncate pr-2">{w.title}</span>
                    <span className="text-gray-500 flex-shrink-0">{w.registeredCount}/{w.totalSeats}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-bold text-gray-900">Upcoming Events</h3>
          <Link to="/admin/events" className="text-xs text-blue-600 font-medium hover:underline">Manage →</Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {(upcoming || []).map(e => (
            <div key={e.id} className="p-3 bg-gray-50 rounded-xl">
              <span className="badge bg-blue-100 text-blue-700 text-xs mb-2">{e.category}</span>
              <div className="font-medium text-gray-800 text-sm">{e.title}</div>
              <div className="text-xs text-gray-400 mt-1">{e.dateLabel}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
