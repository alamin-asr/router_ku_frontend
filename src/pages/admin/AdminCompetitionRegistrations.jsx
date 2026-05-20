import { useState, useEffect } from 'react';
import { Trophy, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { competitionsApi } from '../../api/services';
import { useToast } from '../../context/ToastContext';

export default function AdminCompetitionRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await competitionsApi.getAllRegistrations();
      const data = res.data?.data || res.data;
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Backend registrations endpoint failed/not found, falling back to local storage cache:', err);
      try {
        const stored = JSON.parse(localStorage.getItem('router_competition_registrations') || '[]');
        setRegistrations(stored);
      } catch {
        setRegistrations([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleRefresh = () => fetchRegistrations();

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this registration?')) return;
    
    // First, filter locally and in localStorage
    const updated = registrations.filter(r => r.id !== id);
    setRegistrations(updated);
    try {
      localStorage.setItem('router_competition_registrations', JSON.stringify(updated));
    } catch {}

    // Next, try to call backend deletion endpoint if one exists
    try {
      if (competitionsApi.deleteRegistration) {
        await competitionsApi.deleteRegistration(id);
      }
      toast.success('Registration deleted');
    } catch (err) {
      console.warn('Backend deletion failed/not implemented', err);
    }
  };

  const handleClearAll = () => {
    if (!window.confirm('Clear all competition registrations?')) return;
    setRegistrations([]);
    try {
      localStorage.removeItem('router_competition_registrations');
    } catch {}
    toast.success('Local cache cleared');
  };

  return (
    <div className="w-full min-w-0 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Competition Registrations</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {registrations.length} registration{registrations.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 shrink-0">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw size={15} /> Refresh
          </button>
          {registrations.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
            >
              <Trash2 size={15} /> Clear All
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-blue-700" size={32} />
        </div>
      ) : registrations.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-16 text-center">
          <Trophy size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No registrations yet.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Registrations will appear here once teams sign up for competitions.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[44rem]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Team Name</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Leader</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Competition</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registered At</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {registrations.map((reg, idx) => (
                  <tr key={reg.id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-gray-400 dark:text-gray-500 text-xs">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {reg.teamName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{reg.teamName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{reg.leaderName}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-semibold">
                        {reg.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold">
                        {reg.competitionTitle || reg.competitionName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                      {reg.registeredAt ? new Date(reg.registeredAt).toLocaleString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(reg.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
