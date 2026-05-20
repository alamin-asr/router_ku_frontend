import { useScrollReveal } from '../hooks/useScrollReveal';
import { motion } from 'framer-motion';

const activities = [
  { icon: '🤖', title: 'Robotics', desc: 'Autonomous robots, line followers, maze solvers, and battle bots. Hardware and software combined.', color: 'from-blue-600 to-indigo-600', tags: ['Arduino', 'ROS2', 'STM32', 'PID'] },
  { icon: '💡', title: 'Embedded Systems', desc: 'PCB design, firmware development, FPGA programming, and IoT device prototyping.', color: 'from-emerald-600 to-teal-600', tags: ['ESP32', 'Altium', 'RTOS', 'C/C++'] },
  { icon: '💻', title: 'Programming', desc: 'Algorithms, competitive programming, backend APIs, and AI model development.', color: 'from-violet-600 to-purple-600', tags: ['Python', 'Java', 'LeetCode', 'ML'] },
  { icon: '📡', title: 'Telecommunications', desc: 'SDR experiments, 5G fundamentals, signal processing, and RF circuit design.', color: 'from-amber-600 to-orange-600', tags: ['GNU Radio', 'RTL-SDR', 'MATLAB', '5G NR'] },
  { icon: '🔬', title: 'Research', desc: 'Collaborative research with faculty on AI, signal processing, and smart systems.', color: 'from-rose-600 to-pink-600', tags: ['IEEE', 'Publications', 'Sensors', 'AI/ML'] },
  { icon: '🏆', title: 'Competitions', desc: 'National hackathons, Robocon, inter-university challenges, and innovation showcases.', color: 'from-cyan-600 to-blue-600', tags: ['KUET', 'Robocon', 'Hackathon', 'IEEE Xtreme'] },
];

export default function Activities() {
  const [titleRef, titleVisible] = useScrollReveal();

  return (
    <section id="activities" className="py-10 sm:py-20 bg-slate-50 dark:bg-slate-900/40 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={titleRef} className={`text-center mb-10 reveal ${titleVisible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            Our Expertise
          </div>
          <h2 className="section-title-modern">Technical Domains</h2>
          <p className="section-subtitle-modern mx-auto">
            ROUTER operates across six specialized technical pillars, providing members with deep expertise through hands-on learning and competition.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group relative h-full"
            >
              <div className="card-modern relative h-full flex flex-col items-start border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${a.color} opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.07] transition-opacity duration-500`} />

                <div className="relative z-10 space-y-6">
                  <div className={`inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br ${a.color} text-white shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform duration-500`}>
                    <span className="text-3xl">{a.icon}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                      {a.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                      {a.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {a.tags.map(t => (
                      <span key={t} className="px-3 py-1 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 text-[10px] rounded-lg font-bold uppercase tracking-wider border border-transparent group-hover:border-blue-500/20 transition-all">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
