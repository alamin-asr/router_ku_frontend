import { useState, useEffect } from 'react';
import { workshopsApi } from '../api/services';
import { Calendar, User, Clock, Users, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';


function RegisterModal({ workshop, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        discipline: ""
    });

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            // =========================
            // CALL BACKEND API
            // =========================

            await workshopsApi.register({

                workshopId: workshop.id,

                name: formData.name,

                email: formData.email,

                department: formData.discipline,

                discipline: formData.discipline,

            });

            setSuccess(true);

            setTimeout(() => {

                onSuccess();

                onClose();

            }, 1500);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);
        }
    };

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
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight\">Registration</h3>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"><X size={24} /></button>
                    </div>

                    {success ? (
                        <div className="py-12 text-center">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={40} className="text-emerald-500" />
                            </div>
                            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tight\">Confirmed!</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">You are now registered for this workshop.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl mb-6">
                                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Workshop</div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">{workshop.title}</div>
                            </div>

                            <div className="space-y-4">
                                <input type="text" placeholder="Full Name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl transition-all outline-none text-sm font-medium" />
                                <input type="email" placeholder="Email Address"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl transition-all outline-none text-sm font-medium" />
                                <input type="text" placeholder="Department"
                                    required
                                    value={formData.discipline}
                                    onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl transition-all outline-none text-sm font-medium" />
                            </div>

                            <button disabled={loading} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-[1.5rem] transition-all flex items-center justify-center gap-2 mt-8 shadow-lg shadow-blue-500/25">
                                {loading ? <Loader2 size={20} className="animate-spin" /> : 'Confirm Seats'}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function Workshops() {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [registered, setRegistered] = useState([]);
    const { isAuthenticated } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const [ref, visible] = useScrollReveal();
    useEffect(() => {
        fetchWorkshops();
    }, []);

    const fetchWorkshops = async () => {

        try {

            setLoading(true);

            const res = await workshopsApi.getAll();

            // backend response
            const data = res.data?.data || res.data;

            setWorkshops(Array.isArray(data) ? data : []);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);
        }
    };

    return (
        <section id="workshops" className="py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] dark:opacity-[0.04] pointer-events-none circuit-overlay" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div ref={ref} className={`text-center mb-24 reveal ${visible ? 'visible' : ''}`}>
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        Empowerment
                    </div>
                    <h2 className="section-title-modern">Skill Bootcamps</h2>
                    <p className="section-subtitle-modern mx-auto">Intensive, hands-on training sessions designed to bridge the gap between theory and practice.</p>
                </div>
                {
                    loading ? (
                        <div className="text-center py-20">
                            Loading workshops...
                        </div>
                    ) : (

                        <div className="grid md:grid-cols-2 gap-8">
                            {workshops.map((w, i) => {
                                const pct = Math.round((w.registered / w.seats) * 100);
                                const isReg = registered.includes(w.id);
                                const isFull = w.registered >= w.seats;

                                return (
                                    <motion.div
                                        key={w.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group h-full"
                                    >
                                        <div className="card-modern h-full flex flex-col border-slate-100 dark:border-slate-800 group-hover:border-blue-500/20 transition-all duration-500">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">{w.level}</span>
                                                {isFull && !isReg && <span className="text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><AlertCircle size={12} /> Sold Out</span>}
                                                {isReg && <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><CheckCircle size={12} /> Registered</span>}
                                            </div>

                                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{w.title}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 flex-1">{w.description}</p>

                                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-blue-500/5 flex items-center justify-center text-blue-600"><User size={14} /></div>
                                                    <div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instructor</div>
                                                        <div className="text-xs font-black text-slate-700 dark:text-slate-300">{w.instructor}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-blue-500/5 flex items-center justify-center text-blue-600"><Calendar size={14} /></div>
                                                    <div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Schedule</div>
                                                        <div className="text-xs font-black text-slate-700 dark:text-slate-300">{w.date}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-8">
                                                <div className="flex justify-between items-end mb-2">
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacity ({w.registered}/{w.seats})</div>
                                                    <div className={`text-xs font-black ${pct > 90 ? 'text-rose-500' : 'text-blue-600'}`}>{pct}%</div>
                                                </div>
                                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${pct}%` }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                        className={`h-full rounded-full ${w.color || (pct > 90 ? 'bg-rose-500' : pct > 75 ? 'bg-amber-500' : 'bg-blue-600')}`}
                                                    />
                                                </div>
                                            </div>

                                            {!isReg && !isFull && (
                                                <button
                                                    onClick={() => { if (!isAuthenticated) navigate('/login'); else setSelected(w); }}
                                                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all shadow-xl"
                                                >
                                                    Book Ticket
                                                </button>
                                            )}
                                            {isReg && <div className="w-full py-4 bg-emerald-500/10 text-emerald-600 text-center font-black uppercase tracking-widest rounded-2xl border border-emerald-500/20">Seat Reserved</div>}
                                            {isFull && !isReg && <div className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 text-center font-black uppercase tracking-widest rounded-2xl border border-slate-200 dark:border-slate-700">Fully Booked</div>}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
            </div>

            <AnimatePresence>
                {selected && (
                    <RegisterModal
                        workshop={selected}
                        onClose={() => setSelected(null)}
                        onSuccess={() => { setRegistered(p => [...p, selected.id]); toast.success('Registration successful!', 'Welcome aboard'); }}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
