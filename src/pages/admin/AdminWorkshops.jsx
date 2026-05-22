import { useState, useEffect } from 'react';
import { workshopsApi } from '../../api/services';
import { Plus, Trash2, X, BookOpen, Users, Clock, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const EMPTY = {
  title: '',
  instructor: '',
  date: '',
  duration: '',
  level: 'BEGINNER',
  description: '',
  totalSeats: '',
};

export default function AdminWorkshops() {
  const [workshops, setWorkshops] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const res = await workshopsApi.getAll();
      const raw = res.data?.data ?? res.data?.content ?? res.data;
      setWorkshops(Array.isArray(raw) ? raw : []);
    } catch (err) {
      console.error('Failed to fetch workshops', err);
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkshops(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal(true); };

  const save = async () => {
    if (!form.title || !form.instructor || !form.date) {
      toast.error('Please fill required fields (Title, Instructor, Date).');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        totalSeats: form.totalSeats ? Number(form.totalSeats) : undefined,
      };
      await workshopsApi.create(payload);
      toast.success('Workshop created successfully.');
      setModal(false);
      fetchWorkshops();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create workshop.');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this workshop?')) return;
    try {
      await workshopsApi.delete(id);
      toast.success('Workshop deleted.');
      fetchWorkshops();
    } catch (err) {
      toast.error('Failed to delete workshop.');
    }
  };

  const levelColor = {
    BEGINNER: 'bg-emerald-100 text-emerald-700',
    INTERMEDIATE: 'bg-amber-100 text-amber-700',
    ADVANCED: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 w-full min-w-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Workshops</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage club workshops.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors"
        >
          <Plus size={15} /> Add Workshop
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-14 flex justify-center items-center">
            <Loader2 className="animate-spin text-blue-600" size={24} />
          </div>
        ) : workshops.length === 0 ? (
          <div className="text-center py-14 space-y-2">
            <BookOpen size={36} className="text-gray-300 mx-auto" />
            <p className="text-gray-400 text-sm">No workshops yet. Add one above.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {workshops.map(w => (
              <div key={w.id} className="flex items-start gap-4 p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${levelColor[w.level] || 'bg-gray-100 text-gray-600'}`}>
                      {w.level}
                    </span>
                    <h4 className="font-semibold text-gray-800 text-sm truncate">{w.title}</h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-1">
                    {w.instructor && (
                      <span className="flex items-center gap-1">
                        <BookOpen size={10} /> {w.instructor}
                      </span>
                    )}
                    {w.date && (
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {w.date}
                      </span>
                    )}
                    {w.totalSeats && (
                      <span className="flex items-center gap-1">
                        <Users size={10} /> {w.totalSeats} seats
                      </span>
                    )}
                  </div>
                  {w.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{w.description}</p>
                  )}
                </div>
                <button
                  onClick={() => del(w.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Workshop Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-heading text-lg font-bold text-gray-900">Add Workshop</h3>
              <button onClick={() => setModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { id: 'title', label: 'Title *', type: 'text' },
                { id: 'instructor', label: 'Instructor *', type: 'text' },
                { id: 'date', label: 'Date *', type: 'text', placeholder: 'e.g. Apr 8–10' },
                { id: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 3 Days' },
                { id: 'totalSeats', label: 'Total Seats', type: 'number', placeholder: 'e.g. 25' },
              ].map(f => (
                <div key={f.id}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder || ''}
                    value={form[f.id]}
                    onChange={e => set(f.id, e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Level</label>
                <select
                  value={form.level}
                  onChange={e => set('level', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                >
                  {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(l => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 resize-none transition bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setModal(false)}
                  disabled={saving}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex-1 flex justify-center py-2.5 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
