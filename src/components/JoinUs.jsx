import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ChevronDown, ChevronRight, Loader2, CheckCircle, HelpCircle, Mail, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INTERESTS = [
  { id: 'robotics', label: 'Robotics', icon: '🤖' },
  { id: 'embedded', label: 'Embedded', icon: '💡' },
  { id: 'telecom', label: 'Telecom', icon: '📡' },
  { id: 'aiml', label: 'AI/ML', icon: '🧠' },
  { id: 'programming', label: 'Software', icon: '💻' },
  { id: 'pcb', label: 'Hardware', icon: '🔧' },
];

const FAQS = [
  { q: 'Who can join ROUTER?', a: 'Any student of Khulna University with interest in electronics, robotics, or programming. No prior experience required — we welcome beginners!' },
  { q: 'What activities will I participate in?', a: 'Workshops, competitions, hackathons, seminars, research projects, and the Annual Fest. Active members get access to all club resources.' },
  { q: 'How often does the club meet?', a: 'General meetings are monthly. Technical teams meet weekly. Workshop sessions are scheduled per-event — usually weekends.' },
  { q: 'Can freshmen join?', a: 'Absolutely! We actively recruit freshmen in the first semester. Many of our top members joined in their first year.' },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-4">
      {FAQS.map((faq, i) => (
        <div key={i} className="card-modern p-0 overflow-hidden border-slate-100 dark:border-slate-800">
          <button onClick={() => setOpen(o => o === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <span className="font-bold text-slate-900 dark:text-white text-sm pr-4 uppercase tracking-tight">{faq.q}</span>
            <ChevronDown size={18} className={`text-blue-500 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <p className="px-6 pb-6 text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{faq.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function JoinUs() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', batch: '', password: '' });
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [ref, visible] = useScrollReveal();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register({ ...form, interests });
    setLoading(false);
    if (result.success) {
      toast.success('Welcome to ROUTER!', 'Registration Successful');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Registration failed.');
    }
  };

  const toggleInterest = (id) => setInterests(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <section id="join" className="py-10 sm:py-20 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">

          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Recruitment
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight mb-4">Start Your <br /><span className="text-blue-600">Journey</span> With Us</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-12 max-w-md">Become part of the most active technical community at Khulna University. Learn, build, and lead.</p>

            <div className="space-y-6 sm:space-y-8 mb-10 sm:mb-16">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/5 rounded-2xl flex items-center justify-center text-blue-600"><HelpCircle size={24} /></div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Got Questions?</h4>
                  <p className="text-xs text-slate-500 font-medium">Check our FAQ or drop a message to our leads.</p>
                </div>
              </div>
              <FAQ />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="card-modern p-5 sm:p-10 bg-slate-50/50 dark:bg-slate-900/40 relative group overflow-hidden border-transparent hover:border-blue-500/20 transition-all duration-700">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px]" />

              <form onSubmit={handle} className="relative z-10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Identity</label>
                    <input type="text" placeholder="Full Name" required className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-white dark:bg-slate-950 border border-transparent focus:border-blue-500 rounded-2xl transition-all outline-none text-sm font-medium shadow-sm"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="col-span-1">
                    <input type="email" placeholder="Email" required className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-white dark:bg-slate-950 border border-transparent focus:border-blue-500 rounded-2xl transition-all outline-none text-sm font-medium shadow-sm"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="col-span-1">
                    <input type="text" placeholder="Phone" required className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-white dark:bg-slate-950 border border-transparent focus:border-blue-500 rounded-2xl transition-all outline-none text-sm font-medium shadow-sm"
                      value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="col-span-1">
                    <input type="text" placeholder="Batch/Year" required className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-white dark:bg-slate-950 border border-transparent focus:border-blue-500 rounded-2xl transition-all outline-none text-sm font-medium shadow-sm"
                      value={form.batch} onChange={e => setForm({ ...form, batch: e.target.value })} />
                  </div>
                  <div className="col-span-1">
                    <input type="password" placeholder="Password" required className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-white dark:bg-slate-950 border border-transparent focus:border-blue-500 rounded-2xl transition-all outline-none text-sm font-medium shadow-sm"
                      value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Primary Interests</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {INTERESTS.map(i => {
                      const active = interests.includes(i.id);
                      return (
                        <button key={i.id} type="button" onClick={() => toggleInterest(i.id)}
                          className={`p-3 rounded-xl border text-center transition-all ${active ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-950 border-transparent text-slate-500 hover:border-blue-500/30'}`}>
                          <div className="text-xl mb-1">{i.icon}</div>
                          <div className="text-[9px] font-black uppercase tracking-tight">{i.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button disabled={loading} className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest rounded-3xl hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all shadow-xl mt-4">
                  {loading ? <Loader2 size={24} className="animate-spin" /> : 'Apply for Access'}
                </button>

                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">Already a member? <Link to="/login" className="text-blue-600">Sign In</Link></p>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
