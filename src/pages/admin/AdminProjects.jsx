import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, FolderKanban, Loader2 } from 'lucide-react';
import { projectsApi } from '../../api/services';
import { useToast } from '../../context/ToastContext';

const EMPTY = { title: '', team: '', category: 'Robotics', year: new Date().getFullYear().toString(), description: '', tech: [], techStack: [], achievement: '' };

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [techInput, setTechInput] = useState('');
  const toast = useToast();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await projectsApi.getAll();
      const data = res.data?.data || res.data?.content || res.data;
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAdd = () => {
    setForm(EMPTY);
    setTechInput('');
    setModal({ type: 'add' });
  };

  const openEdit = (p) => {
    setForm(p);
    const list = p.techStack || p.tech || [];
    setTechInput(list.join(', '));
    setModal({ type: 'edit', data: p });
  };

  const save = async () => {
    if (!form.title || !form.team || !form.description) {
      toast.error('Please fill required fields (Title, Team, Description)');
      return;
    }
    setSaving(true);
    try {
      const techArr = techInput.split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        title: form.title,
        team: form.team,
        category: form.category,
        year: form.year,
        description: form.description,
        achievement: form.achievement,
        tech: techArr,
        techStack: techArr,
      };

      if (modal.type === 'add') {
        await projectsApi.create(payload);
        toast.success('Project added successfully');
      } else {
        await projectsApi.update(modal.data.id, payload);
        toast.success('Project updated successfully');
      }
      setModal(null);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await projectsApi.delete(id);
      toast.success('Project deleted');
      fetchProjects();
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 w-full min-w-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the project showcase.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors"
        >
          <Plus size={14} /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 flex justify-center items-center">
          <Loader2 className="animate-spin text-blue-600" size={24} />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 space-y-2">
          <FolderKanban size={36} className="text-gray-300 mx-auto" />
          <p className="text-gray-400 text-sm">No projects created yet. Add one above.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {items.map(p => {
              const techList = p.techStack || p.tech || [];
              return (
                <div key={p.id} className="flex items-start gap-4 p-4 hover:bg-gray-50/50">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FolderKanban size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-semibold text-gray-800 text-sm">{p.title}</h4>
                      <span className="badge bg-blue-100 text-blue-700 text-xs">{p.category}</span>
                      <span className="text-xs text-gray-400">{p.year}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{p.team} · {p.achievement}</p>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {techList.map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => del(p.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="font-heading text-lg font-bold text-gray-900">
                {modal.type === 'add' ? 'Add' : 'Edit'} Project
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
                { id: 'title', label: 'Project Title', type: 'text' },
                { id: 'team', label: 'Team Name', type: 'text' },
                { id: 'year', label: 'Year', type: 'text' },
                { id: 'achievement', label: 'Achievement', type: 'text' },
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
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={e => set('category', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition"
                >
                  {['Robotics', 'IoT', 'AI / ML', 'Telecom', 'Embedded + AI'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tech Stack (comma-separated)</label>
                <input
                  value={techInput}
                  onChange={e => setTechInput(e.target.value)}
                  placeholder="e.g., Arduino, Python, ROS"
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={form.description || ''}
                  onChange={e => set('description', e.target.value)}
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
