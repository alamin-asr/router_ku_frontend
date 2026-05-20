import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Trophy, Loader2 } from 'lucide-react';
import { competitionsApi } from '../../api/services';
import { useToast } from '../../context/ToastContext';

const EMPTY = { title: '', date: '', teamSize: '2–4 members', categories: [], prize: '', deadline: '' };

export default function AdminCompetitions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [catInput, setCatInput] = useState('');
  const toast = useToast();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const res = await competitionsApi.getAll();
      const data = res.data?.data || res.data?.content || res.data;
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load competitions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const openAdd = () => {
    setForm(EMPTY);
    setCatInput('');
    setModal({ type: 'add' });
  };

  const openEdit = (c) => {
    setForm(c);
    setCatInput((c.categories || []).join(', '));
    setModal({ type: 'edit', data: c });
  };

  const save = async () => {
    if (!form.title || !form.date || !form.prize || !form.deadline) {
      toast.error('Please fill all required fields');
      return;
    }
    setSaving(true);
    try {
      const cats = catInput.split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        ...form,
        categories: cats,
      };

      if (modal.type === 'add') {
        await competitionsApi.create(payload);
        toast.success('Competition added successfully');
      } else {
        await competitionsApi.update(modal.data.id, payload);
        toast.success('Competition updated successfully');
      }
      setModal(null);
      fetchCompetitions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save competition');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this competition?')) return;
    try {
      await competitionsApi.delete(id);
      toast.success('Competition deleted successfully');
      fetchCompetitions();
    } catch (err) {
      toast.error('Failed to delete competition');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 w-full min-w-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Competitions</h1>
          <p className="text-gray-500 text-sm mt-1">Manage competition listings.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors"
        >
          <Plus size={14} /> Add Competition
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 flex justify-center items-center">
          <Loader2 className="animate-spin text-blue-600" size={24} />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 space-y-2">
          <Trophy size={36} className="text-gray-300 mx-auto" />
          <p className="text-gray-400 text-sm">No competitions posted yet. Add one above.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-blue-700 rounded-xl flex items-center justify-center">
                    <Trophy size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-gray-900">{c.title}</h3>
                    <p className="text-xs text-gray-400">{c.date} · {c.teamSize}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => openEdit(c)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => del(c.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(c.categories || []).map(cat => (
                  <span key={cat} className="badge bg-blue-50 text-blue-700 text-xs">
                    {cat}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="text-amber-700 font-medium">{c.prize}</span>
                <span>Deadline: {c.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-heading text-lg font-bold text-gray-900">
                {modal.type === 'add' ? 'Add' : 'Edit'} Competition
              </h3>
              <button
                onClick={() => setModal(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { id: 'title', label: 'Title', type: 'text' },
                { id: 'date', label: 'Date', type: 'text' },
                { id: 'teamSize', label: 'Team Size', type: 'text' },
                { id: 'prize', label: 'Prize', type: 'text' },
                { id: 'deadline', label: 'Deadline', type: 'text' },
              ].map(f => (
                <div key={f.id}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.id] || ''}
                    onChange={e => set(f.id, e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Categories (comma-separated)</label>
                <input
                  value={catInput}
                  onChange={e => setCatInput(e.target.value)}
                  placeholder="e.g., Line Follower, Maze Solver"
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setModal(null)}
                  disabled={saving}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex-1 flex justify-center items-center py-2.5 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors"
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
