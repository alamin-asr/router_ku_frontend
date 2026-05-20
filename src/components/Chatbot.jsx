import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CANNED = {
  join: { q: ['how to join', 'membership', 'apply', 'register', 'become member'], a: 'To join ROUTER, scroll to the "Join Us" section on our homepage and fill out the membership form. No experience needed — beginners are welcome! 🎉' },
  workshops: { q: ['workshop', 'learn', 'course', 'training', 'skill'], a: 'We run regular workshops on Arduino, ROS2, PCB Design, Python Signal Processing, 5G Networks, and more. Check the Workshops section!' },
  competitions: { q: ['competition', 'contest', 'prize', 'win', 'hackathon', 'robocon'], a: 'ROUTER teams compete in events like KUET Robocon and our own Robo-Rumble. Prize pools up to BDT 50,000!' },
  projects: { q: ['project', 'showcase', 'build', 'robot', 'iot', 'ai'], a: 'Our members build autonomous robots, AI traffic models, and SDR systems. See the Projects section!' },
  team: { q: ['team', 'member', 'who', 'executive', 'leader'], a: 'ROUTER has 6 specialized teams. Meet the team leaders on our Team section!' },
  contact: { q: ['contact', 'email', 'reach', 'location', 'where'], a: '📍 ECE Discipline, Khulna University\n📧 router@ku.ac.bd\n📞 +880 1700-000001' },
};

const SUGGESTIONS = ['How do I join?', 'Latest workshops?', 'Competition prizes?'];

function getReply(text) {
  const lower = text.toLowerCase();
  for (const [, val] of Object.entries(CANNED)) {
    if (val.q.some(kw => lower.includes(kw))) return val.a;
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hello! 👋 I\'m ROUTER Assistant. How can I help you navigate our tech community today?';
  }
  return 'Interesting! For specific details, visit the relevant section on our site or reach out to us at router@ku.ac.bd. I can also help with info on joining, workshops, or competitions! 😊';
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Greetings! I\'m your ROUTER Assistant. How can I guide you today?', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const send = async (text) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { from: 'user', text, time: new Date() }]);
    setInput('');
    setTyping(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
    setMessages(m => [...m, { from: 'bot', text: getReply(text), time: new Date() }]);
    setTyping(false);
  };

  return (
    <>
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-4 sm:bottom-8 sm:left-8 z-[100] w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl shadow-[0_15px_35px_rgba(37,99,235,0.3)] flex items-center justify-center transition-all hover:scale-110 active:scale-90 group overflow-hidden">
        <AnimatePresence mode="wait">
          {open ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={28} /></motion.div>
            : <motion.div key="msg" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="relative">
              <MessageCircle size={28} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
            </motion.div>}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-4 right-4 sm:right-auto sm:bottom-28 sm:left-8 z-[100] w-auto max-w-[360px] sm:w-[360px]"
          >
            <div className="card-modern p-0 overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 shadow-2xl flex flex-col h-[500px]">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-sm uppercase tracking-tight">ROUTER AI</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-blue-200 font-bold uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Pulse Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'items-start gap-3'}`}>
                    {m.from === 'bot' && (
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0 mt-1"><Bot size={16} /></div>
                    )}
                    <div className={`max-w-[85%] rounded-[1.25rem] px-4 py-3 shadow-sm ${m.from === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
                      }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line font-medium">{m.text}</p>
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600"><Bot size={16} /></div>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3">
                      <div className="flex gap-1">
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggestions */}
              <div className="px-6 pb-2 flex gap-2 flex-wrap">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)}
                    className="text-[10px] px-3 py-1.5 bg-blue-500/5 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full border border-blue-500/10 hover:bg-blue-600 hover:text-white transition-all font-black uppercase tracking-widest">
                    {s}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex gap-2 items-center bg-slate-50 dark:bg-slate-800 rounded-2xl p-2 border border-slate-200/50 dark:border-slate-700/50">
                  <input value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send(input)}
                    placeholder="Ask Assistant..." className="flex-1 bg-transparent px-2 text-sm text-slate-800 dark:text-slate-200 outline-none placeholder-slate-400 font-medium" />
                  <button onClick={() => send(input)} disabled={!input.trim()}
                    className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center disabled:opacity-30 hover:scale-105 transition-all shadow-lg shadow-blue-500/20">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
