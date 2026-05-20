import { useState, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Trophy, Code2, ExternalLink, Github, Layers, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsApi } from '../api/services';

const GRADIENTS = [
  'from-blue-600 to-indigo-600',
  'from-emerald-600 to-teal-600',
  'from-violet-600 to-purple-600',
  'from-amber-600 to-orange-600',
  'from-rose-600 to-pink-600',
  'from-cyan-600 to-blue-600'
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('All');
  const [ref, visible] = useScrollReveal();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await projectsApi.getAll();
        const data = res.data?.data || res.data?.content || res.data;
        setProjects(Array.isArray(data) ? data : []);
        setError(false);
      } catch (err) {
        console.error('Failed to fetch projects', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];
  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-10 sm:py-20 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className={`text-center mb-8 sm:mb-12 reveal ${visible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Innovations
          </div>
          <h2 className="section-title-modern">Technical Portfolio</h2>
          <p className="section-subtitle-modern mx-auto">A showcase of student-led initiatives pushing the boundaries of engineering.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-slate-400 mt-4 uppercase tracking-widest font-bold">Loading Portfolio...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
            <p className="text-rose-500 text-sm font-semibold">Failed to load technical portfolio. Please try again later.</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
            <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold">No projects posted yet.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-16">
              {categories.map(c => (
                <button key={c} onClick={() => setFilter(c)}
                  className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${filter === c ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xl' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-500/50'
                    }`}>
                  {c}
                </button>
              ))}
            </div>

            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => {
                  const colorGradient = p.color || GRADIENTS[i % GRADIENTS.length];
                  const techList = p.techStack || p.tech || [];
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={p.id}
                      className="group"
                    >
                      <div className="card-modern h-full flex flex-col p-0 overflow-hidden border-transparent hover:border-blue-500/30">
                        {/* Visual Header */}
                        <div className={`h-32 bg-gradient-to-br ${colorGradient} relative p-6 flex items-end overflow-hidden`}>
                          <div className="absolute inset-0 opacity-20 circuit-overlay" />
                          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 text-[10px] font-black text-white uppercase tracking-widest">{p.year}</div>
                          <h3 className="text-xl font-black text-white relative z-10 leading-tight uppercase tracking-tight">{p.title}</h3>
                        </div>

                        <div className="p-4 sm:p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/10 rounded-lg text-[10px] font-black uppercase tracking-widest">{p.category}</span>
                            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">by {p.team}</span>
                          </div>

                          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1">{p.description}</p>

                          <div className="space-y-6">
                            <div className="flex flex-wrap gap-2">
                              {techList.map(t => (
                                <span key={t} className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold">
                                  <Code2 size={10} className="text-blue-500" />
                                  {t}
                                </span>
                              ))}
                            </div>

                            {p.achievement && (
                              <div className="flex items-center gap-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                                <Trophy size={16} className="text-amber-500" />
                                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{p.achievement}</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex gap-4">
                              <a href={p.github || '#'} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors"><Github size={18} /></a>
                              <a href={p.externalLink || '#'} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors"><ExternalLink size={18} /></a>
                            </div>
                            <button className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1 group/btn">
                              Case Study <Layers size={12} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
