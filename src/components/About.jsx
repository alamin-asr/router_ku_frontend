import { useScrollReveal } from '../hooks/useScrollReveal';
import { Target, Eye, Zap, Users, Award, Globe, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { value: '120+', label: 'Active Members', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { value: '6+', label: 'Years Active', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { value: '15+', label: 'Awards', icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { value: '3+', label: 'Partners', icon: Globe, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
];

const pillars = [
  { icon: '🔬', title: 'Research', desc: 'Driving technical excellence through faculty-led research and national collaborations.' },
  { icon: '🏆', title: 'Compete', desc: 'Challenging the best at national and international robotics and AI arenas.' },
  { icon: '📚', title: 'Learn', desc: 'Bridging knowledge gaps with intensive workshops and industry-led bootcamps.' },
  { icon: '🤝', title: 'Network', desc: 'Building lifelong connections between students, alumni, and global tech leaders.' },
];

export default function About() {
  const [titleRef, titleVisible] = useScrollReveal();

  return (
    <section id="about" className="relative py-10 sm:py-20 overflow-hidden bg-white dark:bg-slate-950">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none circuit-overlay" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={titleRef} className={`mb-10 reveal ${titleVisible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            Our Identity
          </div>
          <h2 className="section-title-modern">Driving Innovation at ECE Discipline</h2>
          <p className="section-subtitle-modern">
            ROUTER is more than just a club. It's a powerhouse of innovation, a community of dreamers, and a workshop for the future leaders of technology.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="card-modern group"
            >
              <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <s.icon size={20} className={s.color} />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {s.value}
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Split */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-6 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Target className="text-blue-500 flex-shrink-0" size={20} /> Our Mission
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                To foster a culture of technical excellence, innovation, and collaboration among ECE students at
                Khulna University. We bridge the gap between classroom theory and real-world engineering through
                hands-on projects and global mentorship.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Eye className="text-indigo-500 flex-shrink-0" size={20} /> Our Vision
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                To become Bangladesh's most recognized student engineering club — producing graduates who lead
                innovation in telecommunications, embedded systems, robotics, and AI on a global stage.
              </p>
            </div>
            <button className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold hover:gap-5 transition-all">
              Learn more about our history <ArrowRight size={20} />
            </button>
          </motion.div>

          {/* Pillars Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-50 dark:bg-slate-900/50 p-4 sm:p-6 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform origin-left">{p.icon}</div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">{p.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
