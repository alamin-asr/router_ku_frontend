import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Github, Linkedin, Mail, Pencil, Trash2, Plus, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const DEFAULT_TEAM = [
  { id: 1, name: 'Dr. Anisur Rahman', role: 'Faculty Advisor', dept: 'ECE, KU', initials: 'AR', color: 'bg-blue-600', photo: null, github: '', linkedin: '', email: '' },
  { id: 2, name: 'Md. Rafiqul Islam', role: 'President', dept: 'ECE, 4th Year', initials: 'RI', color: 'bg-indigo-600', photo: null, github: '', linkedin: '', email: '' },
  { id: 3, name: 'Nusrat Jahan', role: 'Vice President', dept: 'ECE, 4th Year', initials: 'NJ', color: 'bg-emerald-600', photo: null, github: '', linkedin: '', email: '' },
  { id: 4, name: 'Farhan Hossain', role: 'Technical Lead', dept: 'ECE, 3rd Year', initials: 'FH', color: 'bg-amber-600', photo: null, github: '', linkedin: '', email: '' },
  { id: 5, name: 'Sadia Islam', role: 'Research Lead', dept: 'ECE, 3rd Year', initials: 'SI', color: 'bg-rose-600', photo: null, github: '', linkedin: '', email: '' },
  { id: 6, name: 'Imran Hossain', role: 'Robotics Lead', dept: 'ECE, 3rd Year', initials: 'IH', color: 'bg-cyan-600', photo: null, github: '', linkedin: '', email: '' },
  { id: 7, name: 'Tania Akter', role: 'Events Manager', dept: 'ECE, 2nd Year', initials: 'TA', color: 'bg-violet-600', photo: null, github: '', linkedin: '', email: '' },
  { id: 8, name: 'Arif Hossain', role: 'Treasurer', dept: 'ECE, 2nd Year', initials: 'AH', color: 'bg-teal-600', photo: null, github: '', linkedin: '', email: '' },
];

const COLORS = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 'bg-cyan-600', 'bg-violet-600', 'bg-teal-600', 'bg-slate-600'];

function loadTeam() {
  try {
    const saved = localStorage.getItem('router_team_members');
    return saved ? JSON.parse(saved) : DEFAULT_TEAM;
  } catch {
    return DEFAULT_TEAM;
  }
}

function saveTeam(members) {
  try {
    localStorage.setItem('router_team_members', JSON.stringify(members));
    return true;
  } catch {
    alert('Failed to save: photo may be too large. Try a smaller image.');
    return false;
  }
}

const EMPTY_MEMBER = { name: '', role: '', dept: '', initials: '', color: 'bg-blue-600', photo: null, github: '', linkedin: '', email: '' };

function MemberModal({ member, onSave, onClose }) {
  const [form, setForm] = useState(member ? { ...member } : { ...EMPTY_MEMBER, id: Date.now() });

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set('photo', ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
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
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl max-h-[95vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {member ? 'Edit Member' : 'Add Member'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Photo Upload — full-width preview */}
          <label className="relative flex items-center justify-center w-full h-48 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800 group">
            {form.photo ? (
              <>
                <img src={form.photo} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload size={28} className="text-white" />
                </div>
              </>
            ) : (
              <div className={`w-full h-full flex flex-col items-center justify-center gap-3 ${form.color}`}>
                <span className="text-white text-5xl font-black">{form.initials || '?'}</span>
                <span className="text-white/70 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"><Upload size={12} /> Upload Photo</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </label>
          <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest -mt-2">Click to upload / change photo</p>

          <input required value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="Full Name" className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-sm font-medium text-slate-900 dark:text-white border border-transparent focus:border-blue-500" />

          <input required value={form.role} onChange={e => set('role', e.target.value)}
            placeholder="Role (e.g. President)" className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-sm font-medium text-slate-900 dark:text-white border border-transparent focus:border-blue-500" />

          <input required value={form.dept} onChange={e => set('dept', e.target.value)}
            placeholder="Department (e.g. ECE, 3rd Year)" className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-sm font-medium text-slate-900 dark:text-white border border-transparent focus:border-blue-500" />

          <input value={form.initials} onChange={e => set('initials', e.target.value)}
            placeholder="Initials (e.g. AR)" maxLength={3}
            className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-sm font-medium text-slate-900 dark:text-white border border-transparent focus:border-blue-500" />

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Avatar Color</p>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => set('color', c)}
                  className={`w-8 h-8 rounded-xl ${c} ${form.color === c ? 'ring-2 ring-offset-2 ring-blue-500' : ''} transition-all`}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Social Links (optional)</p>
            <input value={form.github} onChange={e => set('github', e.target.value)}
              placeholder="GitHub URL" className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-sm font-medium text-slate-900 dark:text-white border border-transparent focus:border-blue-500" />
            <input value={form.linkedin} onChange={e => set('linkedin', e.target.value)}
              placeholder="LinkedIn URL" className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-sm font-medium text-slate-900 dark:text-white border border-transparent focus:border-blue-500" />
            <input value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="Email Address" className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-sm font-medium text-slate-900 dark:text-white border border-transparent focus:border-blue-500" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-colors text-sm">Save</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Team() {
  const { isAdmin } = useAuth();
  const [titleRef, titleVisible] = useScrollReveal();
  const [team, setTeam] = useState(loadTeam);
  const [editTarget, setEditTarget] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openEdit = (member) => { setEditTarget(member); setModalOpen(true); };
  const openAdd = () => { setEditTarget(null); setModalOpen(true); };

  const handleSave = (updated) => {
    const next = editTarget
      ? team.map(m => m.id === updated.id ? updated : m)
      : [...team, updated];
    if (saveTeam(next)) setTeam(next);
  };

  const handleDelete = (id) => {
    const next = team.filter(m => m.id !== id);
    if (saveTeam(next)) setTeam(next);
  };

  return (
    <section id="team" className="py-10 sm:py-20 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={titleRef} className={`text-center mb-24 reveal ${titleVisible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            Leadership
          </div>
          <h2 className="section-title-modern">Technical Board</h2>
          <p className="section-subtitle-modern mx-auto">The visionary minds and dedicated leaders driving the ROUTER mission forward.</p>
        </div>

        {isAdmin && (
          <div className="flex justify-end mb-8">
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors shadow-lg shadow-blue-500/20"
            >
              <Plus size={16} /> Add Member
            </button>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 border border-slate-100 dark:border-slate-800 transition-all duration-500 hover:-translate-y-2">

                {/* ── Photo / Avatar ── */}
                <div className="relative w-full h-64 overflow-hidden">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${member.color} transition-transform duration-700 group-hover:scale-105`}>
                      <span className="text-white text-7xl font-black select-none opacity-80">{member.initials}</span>
                    </div>
                  )}

                  {/* Gradient overlay at bottom of image */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

                  {/* Social icons appear over the image on hover */}
                  <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    {member.github ? (
                      <a href={member.github} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all">
                        <Github size={16} />
                      </a>
                    ) : (
                      <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white/40">
                        <Github size={16} />
                      </span>
                    )}
                    {member.linkedin ? (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-blue-600 transition-all">
                        <Linkedin size={16} />
                      </a>
                    ) : (
                      <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white/40">
                        <Linkedin size={16} />
                      </span>
                    )}
                    {member.email ? (
                      <a href={`mailto:${member.email}`} onClick={e => e.stopPropagation()}
                        className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all">
                        <Mail size={16} />
                      </a>
                    ) : (
                      <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white/40">
                        <Mail size={16} />
                      </span>
                    )}
                  </div>

                  {/* Admin controls */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(member); }}
                        className="w-8 h-8 bg-white/90 hover:bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-md transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(member.id); }}
                        className="w-8 h-8 bg-white/90 hover:bg-white text-rose-500 rounded-xl flex items-center justify-center shadow-md transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                {/* ── Info ── */}
                <div className="px-5 py-5">
                  {/* Role badge */}
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white rounded-lg ${member.color}`}>
                      {member.role}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-1">
                    {member.name}
                  </h3>
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">{member.dept}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <MemberModal
            member={editTarget}
            onSave={handleSave}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
