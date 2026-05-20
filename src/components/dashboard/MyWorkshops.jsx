import { BookOpen, Calendar, Clock, CheckCircle } from 'lucide-react';
import { workshopsApi } from '../../api/services';
import { useState, useEffect } from 'react';

export default function MyWorkshops() {

  // =========================
  // STATES
  // =========================

  const [myWorkshops, setMyWorkshops] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH USER REGISTRATIONS
  // =========================

  useEffect(() => {

    fetchMyRegistrations();

  }, []);

  const fetchMyRegistrations = async () => {

    try {

      const res = await workshopsApi.getMyRegistrations();

      const data = res.data?.data || res.data;

      setMyWorkshops(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // LEVEL COLORS
  // =========================

  const levelColors = {
    BEGINNER:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',

    INTERMEDIATE:
      'bg-amber-100 text-amber-700',

    ADVANCED:
      'bg-red-100 text-red-700'
  };

  // =========================
  // UI
  // =========================

  return (

    <div className="max-w-3xl mx-auto w-full min-w-0">

      <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-6">
        My Workshops
      </h1>

      {/* =========================
          LOADING
      ========================= */}

      {loading ? (

        <div className="text-center py-16 text-gray-400">
          Loading...
        </div>

      ) : myWorkshops.length === 0 ? (

        <div className="text-center py-16 text-gray-400">

          <BookOpen
            size={40}
            className="mx-auto mb-3 opacity-30"
          />

          No workshop registrations yet.

        </div>

      ) : (

        <div className="space-y-4">

          {myWorkshops.map(w => (

            <div
              key={w.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5"
            >

              <div className="flex items-start justify-between gap-4">

                <div>

                  <div className="flex items-center gap-2 mb-1">

                    <span
                      className={`badge text-xs ${levelColors[w.level]}`}
                    >
                      {w.level}
                    </span>

                    <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs flex items-center gap-1">

                      <CheckCircle size={10} />

                      {w.status}

                    </span>

                  </div>

                  <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white">
                    {w.title}
                  </h3>

                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">

                    <span className="flex items-center gap-1.5">
                      <BookOpen
                        size={13}
                        className="text-blue-500"
                      />
                      {w.instructor}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Calendar
                        size={13}
                        className="text-blue-500"
                      />
                      {w.dateLabel}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock
                        size={13}
                        className="text-blue-500"
                      />
                      {w.duration}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}