import { useScrollReveal } from '../hooks/useScrollReveal';
import { motion } from 'framer-motion';

const milestones = [
  { year: '2019', title: 'ROUTER Founded', desc: 'Club established under ECE Discipline, Khulna University with 12 founding members.', color: 'bg-blue-600', tag: 'Milestone' },
  { year: '2020', title: 'First Workshop Series', desc: 'Launched Arduino & Embedded Systems bootcamp — 40+ participants from 3 departments.', color: 'bg-emerald-600', tag: 'Workshop' },
  { year: '2021', title: 'National Robotics Win', desc: 'Won 1st place at KUET Robocon — line follower robot category. First national title.', color: 'bg-amber-600', tag: 'Achievement' },
  { year: '2022', title: 'Research Lab Partnership', desc: 'Signed MOU with ECE Faculty Lab for hardware resources and mentorship.', color: 'bg-indigo-600', tag: 'Partnership' },
  { year: '2023', title: '100+ Members Milestone', desc: 'ROUTER grew past 100 active members. Restructured into 6 specialized teams.', color: 'bg-rose-600', tag: 'Milestone' },
  { year: '2024', title: 'Annual Fest & Hackathon', desc: 'Hosted first ROUTER Annual Fest — 20+ projects, 200+ attendees.', color: 'bg-cyan-600', tag: 'Event' },
  { year: '2025', title: 'National Championship', desc: 'ROUTER teams secured 2 gold and 1 silver medals in 4 national competitions.', color: 'bg-blue-700', tag: 'Achievement' },
];

export default function Timeline() {
  const [ref, visible] = useScrollReveal();

  return (
    <section id="timeline" className="py-16 sm:py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div ref={ref} className={`text-center mb-12 sm:mb-24 reveal ${visible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Our Evolution
          </div>
          <h2 className="section-title-modern">Club History</h2>
          <p className="section-subtitle-modern mx-auto">From a small group of enthusiasts to a nationally recognized student engineering club.</p>
        </div>

        <div className="relative">
          {/* Vertical line with gradient */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/20 via-indigo-500/20 to-transparent sm:-translate-x-1/2 rounded-full" />

          <div className="space-y-10 sm:space-y-16">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center gap-8 sm:gap-0 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
              >
                {/* Connector Dot */}
                <div className={`absolute left-4 sm:left-1/2 sm:-translate-x-1/2 w-6 h-6 rounded-full border-4 border-white dark:border-slate-950 ${m.color} z-10 shadow-lg shadow-blue-500/20`} />

                {/* Content Card container */}
                <div className="hidden sm:block sm:w-1/2" />

                <div className={`flex-1 ml-10 sm:ml-0 ${i % 2 === 0 ? 'sm:pr-12' : 'sm:pl-12'} sm:w-1/2`}>
                  <div className="card-modern relative group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{m.year}</span>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-200 dark:border-slate-700">{m.tag}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">{m.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
