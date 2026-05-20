import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';
import { eventsApi } from '../api/services';

const defaultUpcoming = [
  { id: 1, title: 'National Robotics Championship 2025', dateLabel: 'March 25, 2025', eventDate: '2025-03-25', location: 'KU Engineering Building', description: 'Annual robotics challenge — autonomous navigation, object detection, and line-following.', category: 'COMPETITION' },
  { id: 2, title: 'IoT & Smart Systems Workshop', dateLabel: 'April 5, 2025', eventDate: '2025-04-05', location: 'ECE Lab, Room 304', description: 'Hands-on workshop covering ESP32, MQTT protocol, and cloud integration.', category: 'WORKSHOP' },
  { id: 3, title: 'ROUTER Tech Talk: AI in Telecom', dateLabel: 'April 14, 2025', eventDate: '2025-04-14', location: 'Seminar Hall, KU', description: 'Guest lecture on AI and machine learning in modern telecommunications.', category: 'SEMINAR' },
];

const defaultPast = [
  { id: 4, title: 'KUET Inter-University Hackathon', dateLabel: 'January 10, 2025', eventDate: '2025-01-10', location: 'KUET Campus', description: 'ROUTER secured 2nd place with an AI-powered traffic management system.', category: 'COMPETITION' },
  { id: 5, title: 'PCB Design Bootcamp', dateLabel: 'December 5, 2024', eventDate: '2024-12-05', location: 'ECE Lab', description: 'Intensive 2-day bootcamp on Altium Designer and PCB manufacturing.', category: 'WORKSHOP' },
  { id: 6, title: 'ROUTER Annual Fest 2024', dateLabel: 'November 18, 2024', eventDate: '2024-11-18', location: 'KU Central Field', description: '20+ student projects, alumni talks, and a mini drone racing event.', category: 'FEST' },
];

const UPCOMING_KEY = 'router_upcoming_events';
const PAST_KEY = 'router_past_events';

function loadEvents(key, fallback) {
  try { const s = localStorage.getItem(key); if (s) return JSON.parse(s); } catch { }
  return fallback;
}

const catColors = {
  COMPETITION: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  WORKSHOP: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  SEMINAR: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
  FEST: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  OTHER: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
};

const catDot = {
  COMPETITION: 'bg-blue-500   shadow-blue-500/40',
  WORKSHOP: 'bg-emerald-500 shadow-emerald-500/40',
  SEMINAR: 'bg-violet-500  shadow-violet-500/40',
  FEST: 'bg-amber-500   shadow-amber-500/40',
  OTHER: 'bg-slate-400   shadow-slate-400/40',
};

const catLine = {
  COMPETITION: 'border-blue-500/30',
  WORKSHOP: 'border-emerald-500/30',
  SEMINAR: 'border-violet-500/30',
  FEST: 'border-amber-500/30',
  OTHER: 'border-slate-400/30',
};

function Countdown({ dateStr }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const update = () => {
      const diff = new Date(dateStr) - new Date();
      if (diff <= 0) { setExpired(true); return; }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [dateStr]);

  if (expired) return <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">Event passed / in progress</div>;
  return (
    <div className="flex items-center gap-1.5 mt-3">
      {[['d', 'Days'], ['h', 'Hrs'], ['m', 'Min'], ['s', 'Sec']].map(([k, l]) => (
        <div key={k} className="flex flex-col items-center bg-blue-500/6 border border-blue-500/10 rounded-lg px-2 py-1 min-w-[40px]">
          <span className="text-xs font-black text-blue-600 dark:text-blue-400 tabular-nums">{String(time[k]).padStart(2, '0')}</span>
          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">{l}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Chain item for Upcoming Events ───────────────────────────────────── */
function ChainItem({ event, index }) {
  const isRight = index % 2 === 0; // even → card on right (desktop)
  const dotClass = catDot[event.category] || catDot.OTHER;
  const borderClass = catLine[event.category] || catLine.OTHER;

  const Card = (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className={`group bg-white dark:bg-slate-900 rounded-2xl border-2 ${borderClass} p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`px-2.5 py-1 border rounded-lg text-[10px] font-black uppercase tracking-widest ${catColors[event.category] || catColors.OTHER}`}>
          {event.category}
        </span>
        <span className="flex items-center gap-1 text-emerald-500 text-[9px] font-black uppercase tracking-widest flex-shrink-0">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Upcoming
        </span>
      </div>
      <h3 className="text-base font-black text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {event.title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{event.description}</p>
      <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <Calendar size={12} className="text-blue-500 flex-shrink-0" />
          {event.dateLabel}
        </div>
        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <MapPin size={12} className="text-blue-500 flex-shrink-0" />
          {event.location}
        </div>
      </div>
      <Countdown dateStr={event.eventDate} />
    </motion.div>
  );

  return (
    <div className="relative">
      {/* ── Mobile layout: line on left, card on right ── */}
      <div className="sm:hidden flex items-start gap-4 pl-10">
        <div className={`absolute left-3.5 top-5 w-4 h-4 rounded-full ${dotClass} shadow-md ring-2 ring-white dark:ring-slate-950 z-10`} />
        <div className="flex-1">{Card}</div>
      </div>

      {/* ── Desktop layout: alternating L/R with center line ── */}
      <div className={`hidden sm:flex items-center gap-0 ${isRight ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Card half */}
        <div className="w-[calc(50%-24px)]">{Card}</div>
        {/* Center dot */}
        <div className="w-12 flex justify-center flex-shrink-0 z-10">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 + 0.2 }}
            className={`w-5 h-5 rounded-full ${dotClass} shadow-lg ring-[3px] ring-white dark:ring-slate-950`}
          />
        </div>
        {/* Empty half */}
        <div className="w-[calc(50%-24px)]" />
      </div>
    </div>
  );
}

/* ── Past event compact row ───────────────────────────────────────────── */
function PastRow({ event, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 opacity-75 hover:opacity-100 transition-opacity"
    >
      <div className={`mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${(catDot[event.category] || catDot.OTHER).split(' ')[0]} opacity-60`} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={`px-2 py-0.5 border rounded text-[9px] font-black uppercase tracking-widest ${catColors[event.category] || catColors.OTHER}`}>
            {event.category}
          </span>
          <span className="text-[10px] text-slate-400 font-bold">{event.dateLabel}</span>
        </div>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-snug">{event.title}</p>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{event.description}</p>
        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-semibold">
          <MapPin size={10} /> {event.location}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Calendar ──────────────────────────────────────────────────────────── */
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function CalendarView({ allEvents }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventsByDay = {};
  allEvents.forEach(e => {
    const d = new Date(e.eventDate);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(e);
    }
  });

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <div className="card-modern">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{MONTHS[month]} {year}</h3>
        <div className="flex gap-2">
          <button onClick={prev} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white transition-all"><ChevronLeft size={18} /></button>
          <button onClick={next} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white transition-all"><ChevronRight size={18} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-3">
        {DAYS.map((d, i) => <div key={`${d}${i}`} className="text-center text-[10px] font-black text-slate-400 uppercase py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1;
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const hasEvent = !!eventsByDay[day];
          return (
            <button key={day} onClick={() => setSelected(hasEvent ? eventsByDay[day] : null)}
              className={`relative aspect-square flex items-center justify-center text-sm rounded-xl font-black transition-all
                ${isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : hasEvent ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20 hover:bg-blue-600 hover:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              {day}
              {hasEvent && !isToday && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {selected.map(e => (
              <div key={e.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className={`p-1.5 rounded-lg ${catColors[e.category] || catColors.OTHER}`}><Clock size={16} /></div>
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">{e.title}</div>
                  <div className="text-[10px] font-bold text-slate-500 mt-0.5">{e.location}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main export ───────────────────────────────────────────────────────── */
export default function Events() {
  const [view, setView] = useState('list');
  const [ref, visible] = useScrollReveal();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        try {
          const uRes = await eventsApi.getUpcoming();
          const raw = uRes.data.data !== undefined ? uRes.data.data : (uRes.data.content !== undefined ? uRes.data.content : uRes.data);
          setUpcomingEvents(Array.isArray(raw) ? raw : []);
        } catch (e) {
          console.error(e);
          setUpcomingEvents([]);
        }

        try {
          const pRes = await eventsApi.getPast();
          const raw = pRes.data.data !== undefined ? pRes.data.data : (pRes.data.content !== undefined ? pRes.data.content : pRes.data);
          setPastEvents(Array.isArray(raw) ? raw : []);
        } catch (e) {
          console.error(e);
          setPastEvents([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const allEvents = [...upcomingEvents, ...pastEvents];

  return (
    <section id="events" className="py-10 sm:py-20 bg-white dark:bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div ref={ref} className={`text-center mb-10 reveal ${visible ? 'visible' : ''}`}>
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            Calendar
          </div>
          <h2 className="section-title-modern">Club Events</h2>
          <p className="section-subtitle-modern mx-auto">Stay connected with our technical journey through upcoming competitions and workshops.</p>

          <div className="inline-flex bg-slate-100 dark:bg-slate-900 rounded-2xl p-1.5 mt-8 border border-slate-200 dark:border-slate-800 shadow-inner">
            {[['list', 'List View'], ['calendar', 'Calendar View']].map(([v, l]) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${view === v ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'calendar' ? (
            <motion.div key="calendar" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-xl mx-auto">
              <CalendarView allEvents={allEvents} />
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-14">

              {/* ─── Upcoming Events: Chain Layout ─── */}
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 bg-blue-500 shadow-lg shadow-blue-500/20 rounded-2xl flex items-center justify-center text-white">
                    <Calendar size={20} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Upcoming Events</h3>
                </div>

                <div className="relative">
                  {/* Mobile: left vertical line */}
                  <div className="sm:hidden absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/70 via-blue-500/30 to-transparent" />
                  {/* Desktop: center vertical line */}
                  <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/70 via-blue-500/30 to-transparent" />

                  <div className="space-y-8">
                    {upcomingEvents.map((e, i) => <ChainItem key={e.id} event={e} index={i} />)}
                  </div>
                </div>
              </div>

              {/* ─── Past Events: Compact list ─── */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500">
                    <Clock size={20} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Past Events</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pastEvents.map((e, i) => <PastRow key={e.id} event={e} index={i} />)}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
