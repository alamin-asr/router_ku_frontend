import { useState, useEffect } from 'react';
import { eventsApi } from '../../api/services';
import { Plus, Trash2, X, Calendar, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const EMPTY = { title: '', eventDate: '', location: '', description: '', category: 'Workshop' };

export default function AdminEvents() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [modal, setModal] = useState(null); // null | { tab }
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Catch exceptions silently and initialize to empty arrays if fetching fails
      try {
        const uRes = await eventsApi.getUpcoming();
        const raw = uRes.data.data !== undefined ? uRes.data.data : (uRes.data.content !== undefined ? uRes.data.content : uRes.data);
        setUpcoming(Array.isArray(raw) ? raw : []);
      } catch (err) {
        console.error("Failed to fetch upcoming events", err);
        setUpcoming([]);
      }
      try {
        const pRes = await eventsApi.getPast();
        const raw = pRes.data.data !== undefined ? pRes.data.data : (pRes.data.content !== undefined ? pRes.data.content : pRes.data);
        setPast(Array.isArray(raw) ? raw : []);
      } catch (err) {
        console.error("Failed to fetch past events", err);
        setPast([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAdd = (tab) => { setForm(EMPTY); setModal({ tab }); };

  const save = async () => {
    if (!form.title || !form.eventDate || !form.location) {
      toast.error('Please fill required fields (Title, Date, Location).');
      return;
    }

    setSaving(true);
    try {
      // Submit upper-cased category format natively preferred
      // Append time component for Spring's LocalDateTime deserializer if missing
      const payload = {
        ...form,
        eventDate: form.eventDate.includes('T') ? form.eventDate : `${form.eventDate}T00:00:00`,
        category: form.category.toUpperCase()
      };
      await eventsApi.create(payload);
      toast.success('Event successfully created.');
      setModal(null);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id, tab) => {
    if (!confirm('Delete this event?')) return;
    try {
      await eventsApi.delete(id);
      toast.success('Event deleted.');
      fetchEvents();
    } catch (err) {
      toast.error('Failed to delete event');
    }
  };

  const EventTable = ({ items, tab }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-gray-900 capitalize">{tab} Events ({items?.length || 0})</h3>
        <button onClick={() => openAdd(tab)} className="flex items-center gap-1.5 px-3 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors">
          <Plus size={14} /> Add Event
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? <div className="text-center py-10 flex justify-center items-center"><Loader2 className="animate-spin text-blue-600" /></div> : items?.length === 0 ? <div className="text-center py-10 text-gray-400 text-sm">No events. Add one above.</div> : (
          <div className="divide-y divide-gray-50">
            {items?.map(e => (
              <div key={e.id} className="flex items-start gap-4 p-4 hover:bg-gray-50/50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge bg-blue-100 text-blue-700 text-xs">{e.category}</span>
                    <h4 className="font-semibold text-gray-800 text-sm truncate">{e.title}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={10} />{e.dateLabel || e.eventDate}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} />{e.location}</span>
                  </div>
                </div>
                <button onClick={() => del(e.id, tab)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 w-full min-w-0">
      <div><h1 className="font-heading text-2xl font-bold text-gray-900">Events</h1><p className="text-gray-500 text-sm mt-1">Add and remove club events.</p></div>
      <EventTable items={upcoming} tab="upcoming" />
      <EventTable items={past} tab="past" />

      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-heading text-lg font-bold text-gray-900">Add Event</h3>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { id: 'title', label: 'Title', type: 'text' },
                { id: 'eventDate', label: 'Date', type: 'date' },
                { id: 'location', label: 'Location', type: 'text' },
              ].map(f => (
                <div key={f.id}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
                  <input type={f.type} value={form[f.id]} onChange={e => set(f.id, e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition">
                  {['Workshop', 'Competition', 'Seminar', 'Fest'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 resize-none transition" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} disabled={saving} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={save} disabled={saving} className="flex-1 flex justify-center py-2.5 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors">
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
