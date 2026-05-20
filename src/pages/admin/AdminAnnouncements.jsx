import { useState, useEffect } from 'react';
import { announcementsApi } from '../../api/services';
import { Plus, Pencil, Trash2, X, Bell, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const EMPTY = { title: '', body: '', priority: 'MEDIUM' };
const priorityStyle = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-gray-100 text-gray-600',
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  LOW: 'bg-gray-100 text-gray-600',
};

export default function AdminAnnouncements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const toast = useToast();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await announcementsApi.getAll();
      const raw = res.data?.data ?? res.data?.content ?? res.data;
      setItems(Array.isArray(raw) ? raw : []);
    } catch (err) {
      console.error('Failed to fetch announcements', err);
      toast.error('Failed to load announcements.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const openAdd = () => {
    setForm(EMPTY);
    setModal({ type: 'add' });
  };

  const openEdit = (a) => {
    setForm({
      title: a.title || '',
      body: a.body || '',
      priority: a.priority || 'MEDIUM',
    });
    setModal({ type: 'edit', data: a });
  };

  const save = async () => {
    if (!form.title || !form.body) {
      toast.error('Please fill required fields (Title and Message).');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        body: form.body,
        priority: form.priority.toUpperCase(),
      };
      if (modal.type === 'add') {
        await announcementsApi.create(payload);
        toast.success('Announcement posted successfully.');
      } else {
        await announcementsApi.update(modal.data.id, payload);
        toast.success('Announcement updated successfully.');
      }
      setModal(null);
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save announcement.');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await announcementsApi.delete(id);
      toast.success('Announcement deleted.');
      fetchAnnouncements();
    } catch (err) {
      toast.error('Failed to delete announcement.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 w-full min-w-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500 text-sm mt-1">Post and manage club announcements.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors"
        >
          <Plus size={14} /> New Announcement
        </button>
      </div>

      {loading ? (
        <div className="text-center py-14 flex justify-center items-center">
          <Loader2 className="animate-spin text-blue-600" size={24} />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-14 space-y-2 bg-white rounded-xl border border-gray-100">
          <Bell size={36} className="text-gray-300 mx-auto" />
          <p className="text-gray-400 text-sm">No announcements yet. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bell size={15} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge text-xs uppercase ${priorityStyle[a.priority] || 'bg-gray-100 text-gray-600'}`}>
                          {a.priority}
                        </span>
                        <span className="text-xs text-gray-400">
                          {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : (a.date || '')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 text-sm">{a.title}</h3>
                      <p className="text-gray-500 text-sm mt-1 leading-relaxed">{a.body}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEdit(a)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => del(a.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
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
                {modal.type === 'add' ? 'New' : 'Edit'} Announcement
              </h3>
              <button
                onClick={() => setModal(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title</label>
                <input
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Priority</label>
                <select
                  value={form.priority}
                  onChange={e => set('priority', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition"
                >
                  {['HIGH', 'MEDIUM', 'LOW'].map(p => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message</label>
                <textarea
                  rows={4}
                  value={form.body}
                  onChange={e => set('body', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 resize-none transition"
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
                  {saving ? <Loader2 size={18} className="animate-spin" /> : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
