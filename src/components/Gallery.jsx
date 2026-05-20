import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Upload, Plus, Trash2, Loader2 } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { galleryApi } from '../api/services';

const DEFAULT_ITEMS = [
  { id: 1, label: 'KUET Hackathon 2025', category: 'Competition', icon: '🏆', bg: 'bg-blue-600', image: null },
  { id: 2, label: 'PCB Design Bootcamp', category: 'Workshop', icon: '🔧', bg: 'bg-emerald-600', image: null },
  { id: 3, label: 'Robo-Rumble 2024', category: 'Competition', icon: '🤖', bg: 'bg-indigo-600', image: null },
  { id: 4, label: 'Annual Fest 2024', category: 'Fest', icon: '🎉', bg: 'bg-purple-600', image: null },
  { id: 5, label: 'SDR Workshop', category: 'Workshop', icon: '📡', bg: 'bg-slate-600', image: null },
  { id: 6, label: 'Line Follower Demo', category: 'Robotics', icon: '⚡', bg: 'bg-teal-600', image: null },
  { id: 7, label: 'AI Tech Talk', category: 'Seminar', icon: '🧠', bg: 'bg-violet-600', image: null },
  { id: 8, label: 'Drone Racing Event', category: 'Competition', icon: '🚁', bg: 'bg-rose-600', image: null },
  { id: 9, label: 'Arduino Workshop', category: 'Workshop', icon: '💡', bg: 'bg-cyan-600', image: null },
];

const catFilters = ['All', 'Competition', 'Workshop', 'Fest', 'Seminar', 'Robotics'];
const BG_COLORS = ['bg-blue-600', 'bg-emerald-600', 'bg-indigo-600', 'bg-purple-600', 'bg-slate-600', 'bg-teal-600', 'bg-violet-600', 'bg-rose-600', 'bg-cyan-600', 'bg-amber-600'];

function Lightbox({ items, index, onClose, onPrev, onNext }) {
  const item = items[index];
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onPrev, onNext, onClose]);

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          <div className={`w-full h-[400px] flex items-center justify-center ${item.image ? '' : `text-9xl ${item.bg || 'bg-blue-600'}`} relative overflow-hidden`}>
            {item.image ? (
              <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
            ) : (
              <>
                <div className="absolute inset-0 opacity-20 circuit-overlay" />
                <span className="relative z-10">{item.icon || '📷'}</span>
              </>
            )}
          </div>
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight\">{item.label}</h3>
            <span className="px-4 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-widest rounded-full">{item.category}</span>
          </div>
        </motion.div>

        <button onClick={onClose} className="absolute -top-12 right-0 text-white hover:text-blue-400 transition-colors"><X size={32} /></button>
        <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/10 transition-all"><ChevronLeft size={32} /></button>
        <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/10 transition-all"><ChevronRight size={32} /></button>
      </div>
    </motion.div>
  );
}

function AddPhotoModal({ onAdd, onClose }) {
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState('Competition');
  const [imageData, setImageData] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageData(ev.target.result);
      setPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imageData) { alert('Please select an image.'); return; }
    onAdd({
      label,
      category,
      image: imageData,
      icon: '📷',
      bg: BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)],
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Add Gallery Photo</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="flex flex-col items-center justify-center gap-2 w-full h-40 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer overflow-hidden">
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Upload size={28} />
                <span className="text-sm font-bold uppercase tracking-widest">Choose Image</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>

          <input
            value={label}
            onChange={e => setLabel(e.target.value)}
            required
            placeholder="Photo Label (e.g. KUET Hackathon 2025)"
            className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-sm font-medium text-slate-900 dark:text-white border border-transparent focus:border-blue-500"
          />

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-sm font-medium text-slate-900 dark:text-white border border-transparent focus:border-blue-500 appearance-none"
          >
            {catFilters.filter(c => c !== 'All').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-colors text-sm">Add Photo</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Gallery() {
  const { isAdmin } = useAuth();
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [ref, visible] = useScrollReveal();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await galleryApi.getAll();
      const data = res.data?.data || res.data?.content || res.data;
      if (Array.isArray(data)) {
        setItems(data);
        try { localStorage.setItem('router_gallery_items', JSON.stringify(data)); } catch {}
      } else {
        throw new Error('Not array');
      }
    } catch (err) {
      console.warn('Failed to load gallery items, falling back to cache:', err);
      try {
        const stored = localStorage.getItem('router_gallery_items');
        setItems(stored ? JSON.parse(stored) : DEFAULT_ITEMS);
      } catch {
        setItems(DEFAULT_ITEMS);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);

  const handleAdd = async (newItem) => {
    try {
      await galleryApi.create({
        label: newItem.label,
        category: newItem.category,
        image: newItem.image,
      });
      fetchGallery();
    } catch (err) {
      console.error('Failed to create gallery photo on backend', err);
      const updated = [...items, { ...newItem, id: Date.now() }];
      setItems(updated);
      try { localStorage.setItem('router_gallery_items', JSON.stringify(updated)); } catch {}
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this photo?')) return;
    try {
      await galleryApi.delete(id);
      fetchGallery();
    } catch (err) {
      console.error('Failed to delete gallery photo on backend', err);
      const updated = items.filter(i => i.id !== id);
      setItems(updated);
      try { localStorage.setItem('router_gallery_items', JSON.stringify(updated)); } catch {}
    }
  };

  return (
    <section id="gallery" className="py-10 sm:py-20 bg-slate-50 dark:bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className={`text-center mb-16 reveal ${visible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            Memories
          </div>
          <h2 className="section-title-modern">Club Gallery</h2>
          <p className="section-subtitle-modern mx-auto">Capturing the spirit of innovation and collaboration in every frame.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {catFilters.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-6 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${filter === c ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-500/50'}`}>
              {c}
            </button>
          ))}
        </div>

        {isAdmin && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors shadow-lg shadow-blue-500/20"
            >
              <Plus size={16} /> Add Photo
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
            <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold">No pictures in this category.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  key={item.id || i}
                  className="group relative aspect-video rounded-[2.5rem] overflow-hidden card-modern p-0 border-transparent hover:border-blue-500/30 cursor-pointer"
                  onClick={() => setLightbox(i)}
                >
                  {item.image ? (
                    <img src={item.image} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-7xl transition-transform duration-700 group-hover:scale-110 ${item.bg || 'bg-blue-600'}`}>
                      <div className="absolute inset-0 opacity-10 circuit-overlay" />
                      <span className="relative z-10 group-hover:drop-shadow-2xl transition-all">{item.icon || '📷'}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/60 transition-all duration-500 flex flex-col items-center justify-center p-6 text-center">
                    <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0" />
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <div className="text-white text-lg font-black uppercase tracking-tight">{item.label}</div>
                      <div className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-1">{item.category}</div>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={e => handleDelete(item.id, e)}
                      className="absolute top-3 right-3 w-8 h-8 bg-rose-600/90 hover:bg-rose-600 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            items={filtered}
            index={lightbox}
            onClose={() => setLightbox(null)}
            onPrev={() => setLightbox(i => (i - 1 + filtered.length) % filtered.length)}
            onNext={() => setLightbox(i => (i + 1) % filtered.length)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {addOpen && <AddPhotoModal onAdd={handleAdd} onClose={() => setAddOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}
