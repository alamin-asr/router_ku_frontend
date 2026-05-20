import { useState, useEffect } from 'react';
import { Trophy, Calendar, Users, Loader2 } from 'lucide-react';
import { competitionsApi } from '../../api/services';

export default function MyCompetitions() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const res = await competitionsApi.getMyRegistrations();
        const data = res.data?.data || res.data?.content || res.data;
        setRegistrations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  return (
    <div className="max-w-3xl mx-auto w-full min-w-0">
      <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-6">My Competitions</h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Trophy size={40} className="mx-auto mb-3 opacity-30" />
          No competition registrations yet.{' '}
          <a href="/#competitions" className="text-blue-600 hover:underline ml-1">
            Browse competitions &rarr;
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map(reg => (
            <div key={reg.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white">
                      {reg.competitionTitle || reg.competitionName}
                    </h3>
                    <p className="text-xs text-gray-400">Registered on {reg.registeredAt ? new Date(reg.registeredAt).toLocaleDateString() : '—'}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold">
                  {reg.category}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">Team Name</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{reg.teamName}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">Leader</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{reg.leaderName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
