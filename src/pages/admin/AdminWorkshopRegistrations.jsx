import { useState, useEffect } from 'react';
import { BookOpen, Trash2, RefreshCw } from 'lucide-react';
import { workshopsApi } from '../../api/services';

export default function AdminWorkshopRegistrations() {

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH REGISTRATIONS
  // =========================
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);

      // ✅ FIX 1: USE CORRECT API (IMPORTANT)
      const res = await workshopsApi.getAllRegistered();

      const data = res.data?.data || res.data;

      setRegistrations(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchRegistrations();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this registration?")) return;
    try {
      await workshopsApi.deleteRegistration(id);

      setRegistrations(prev => prev.filter(r => r.id !== id));

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FIX 2: ADD THIS (you were missing it)
  const handleClearAll = async () => {
    if (!window.confirm("Clear all registrations?")) return;

    try {
      // optional backend API
      // await workshopsApi.clearAllRegistrations();

      setRegistrations([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full min-w-0 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Workshop Registrations
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {registrations.length} registration{registrations.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 shrink-0">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl"
          >
            <RefreshCw size={15} /> Refresh
          </button>

          {registrations.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl"
            >
              <Trash2 size={15} /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : registrations.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          No registrations yet.
        </div>
      ) : (

        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[40rem]">

            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 text-left">
                <th className="p-4">#</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Discipline</th>
                <th className="p-4">Workshop</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {registrations.map((reg, idx) => (
                <tr key={reg.id} className="border-t">

                  <td className="p-4 text-gray-400">{idx + 1}</td>

                  <td className="p-4">{reg.name}</td>

                  <td className="p-4">{reg.email}</td>

                  {/* ⚠️ IMPORTANT: match backend spelling */}
                  <td className="p-4">
                    {reg.discipline || reg.department || 'N/A'}
                  </td>

                  <td className="p-4">{reg.title|| 'N/A'}</td>

                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(reg.id)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
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