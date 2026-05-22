import { useState, useEffect } from 'react';
import { Trophy, Calendar, Users, Tag, ChevronDown, ChevronUp, Medal, X, CheckCircle, Loader2, Target, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';
import { competitionsApi } from '../api/services';

const leaderboard = [
  { rank: 1, team: 'Team AeroByte', pts: 2840, cat: 'Drone Racing', medal: 'gold' },
  { rank: 2, team: 'Team NeuralNet', pts: 2610, cat: 'AI/ML', medal: 'silver' },
  { rank: 3, team: 'Team RoboTrace', pts: 2490, cat: 'Line Follower', medal: 'bronze' },
  { rank: 4, team: 'Team GreenGrid', pts: 2200, cat: 'IoT', medal: null },
  { rank: 5, team: 'Team SpectraSense', pts: 1980, cat: 'Telecom', medal: null },
];

const COMP_GRADIENTS = [
  'from-blue-600 to-indigo-600',
  'from-emerald-600 to-teal-600',
  'from-violet-600 to-purple-600',
  'from-amber-600 to-orange-600'
];

function RegModal({ comp, onClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ teamName: '', leaderName: '', category: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        competitionId: comp.id,
        teamName: form.teamName,
        leaderName: form.leaderName,
        category: form.category
      };
      await competitionsApi.register(payload);

      // Save registration to localStorage for cache/admin fallback view
      const registration = {
        id: Date.now(),
        competitionId: comp.id,
        competitionTitle: comp.title,
        teamName: form.teamName,
        leaderName: form.leaderName,
        category: form.category,
        registeredAt: new Date().toISOString(),
      };
      try {
        const existing = JSON.parse(localStorage.getItem('router_competition_registrations') || '[]');
        localStorage.setItem('router_competition_registrations', JSON.stringify([...existing, registration]));
      } catch { }

      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit registration. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const categoriesList = comp.categories || [];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Team Entry</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"><X size={24} /></button>
          </div>

          {success ? (
            <div className="py-12 text-center">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-emerald-500" />
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Registered!</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Your team is officially in the race.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl mb-6">
                <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Competition</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{comp.title}</div>
              </div>

              <div className="space-y-4">
                <input
                  type="text" placeholder="Team Name" required
                  value={form.teamName} onChange={e => setForm(p => ({ ...p, teamName: e.target.value }))}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-transparent focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl transition-all outline-none text-sm font-medium" />
                <input
                  type="text" placeholder="Leader Name" required
                  value={form.leaderName} onChange={e => setForm(p => ({ ...p, leaderName: e.target.value }))}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-transparent focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl transition-all outline-none text-sm font-medium" />
                <select
                  required
                  value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-transparent focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl transition-all outline-none text-sm font-medium appearance-none">
                  <option value="">Select Category</option>
                  {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <button disabled={loading} className="w-full py-5 bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-widest rounded-[1.5rem] transition-all flex items-center justify-center gap-2 mt-8 shadow-lg shadow-amber-500/25">
                {loading ? <Loader2 size={20} className="animate-spin" /> : 'Join Arena'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function LeaderboardView() {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="card-modern p-0 overflow-hidden border-amber-500/20 mb-12 shadow-2xl shadow-amber-500/10"
    >
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy size={24} className="text-white" />
          <span className="text-lg font-black text-white uppercase tracking-tight">Hall of Fame</span>
        </div>
        <span className="flex items-center gap-2 text-[10px] font-black text-white/80 uppercase tracking-widest">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> Live Stats
        </span>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {leaderboard.map((row, i) => (
          <div key={i} className={`px-8 py-5 flex items-center gap-6 ${row.rank <= 3 ? 'bg-amber-500/5' : ''}`}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg">
              {row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : <span className="text-slate-400">#{row.rank}</span>}
            </div>
            <div className="flex-1">
              <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{row.team}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.cat}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-blue-600 dark:text-blue-400 tracking-tight">{row.pts.toLocaleString()}</div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Points</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Competitions() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReg, setActiveReg] = useState(null);
  const [showRank, setShowRank] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [ref, visible] = useScrollReveal();

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true);
        const res = await competitionsApi.getAll();
        const data = res.data?.data || res.data?.content || res.data;
        setCompetitions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompetitions();
  }, []);

  return (
    <section id="competitions" className="py-10 sm:py-20 bg-slate-50 dark:bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className={`text-center mb-16 reveal ${visible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 bg-amber-500 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            {/* <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            Competition */}
          </div>
          <h2 className="section-title-modern">Competitions</h2>
          <p className="section-subtitle-modern mx-auto">Battle it out with the brightest minds across multiple technical domains.</p>

          <button onClick={() => setShowRank(!showRank)} className="mt-8 px-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-amber-500/50 transition-all flex items-center gap-2 mx-auto shadow-lg">
            <Trophy size={14} className="text-amber-500" /> {showRank ? 'Hide' : 'Show'} Leaderboard
          </button>
        </div>

        <AnimatePresence>
          {showRank && <LeaderboardView />}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-amber-600" size={32} />
          </div>
        ) : competitions.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
            <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold">No active arenas listed.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {competitions.map((c, i) => {
              const gradient = c.color || COMP_GRADIENTS[i % COMP_GRADIENTS.length];
              const categoriesList = c.categories || [];
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="card-modern h-full flex flex-col border-transparent hover:border-amber-500/20 transition-all duration-500 overflow-hidden relative">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-14 h-14 bg-amber-50 shadow-xl shadow-amber-500/20 rounded-2xl flex items-center justify-center text-white">
                        <Target size={28} />
                      </div>
                      <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Active
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{c.title}</h3>
                    <div className="flex flex-wrap gap-4 mb-8">
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        <Calendar size={12} className="text-blue-500" /> {c.date}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        <Users size={12} className="text-blue-500" /> {c.teamSize || c.team || '1–4 Members'}
                      </div>
                    </div>

                    <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl mb-8 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Trophy size={20} className="text-amber-500" />
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">Prize Pool</span>
                      </div>
                      <span className="text-lg font-black text-amber-600 tracking-tight">{c.prize}</span>
                    </div>

                    <div className="space-y-4 mb-10 flex-1">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categories</div>
                      <div className="flex flex-wrap gap-2">
                        {categoriesList.map(cat => (
                          <span key={cat} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-widest">{cat}</span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center mb-6">
                        <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                          <Zap size={14} /> Deadline: {c.deadline}
                        </div>
                      </div>
                      <button
                        onClick={() => { if (!isAuthenticated) navigate('/login'); else setActiveReg(c); }}
                        className="w-full py-5 bg-blue-600 hover:bg-slate-900 dark:hover:bg-white text-white dark:hover:text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-500/10"
                      >
                        Entry Form
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <AnimatePresence>
        {activeReg && <RegModal comp={activeReg} onClose={() => setActiveReg(null)} />}
      </AnimatePresence>
    </section>
  );
}
