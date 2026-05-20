import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, PlayCircle, Settings, Upload, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useScrollReveal, useCountUp } from '../hooks/useScrollReveal';
import { useAuth } from '../context/AuthContext';

const DEFAULT_SLIDES = [
  {
    image: '/hero1.png',
    title: 'Future of Robotics',
    subtitle: 'Innovate the future with advanced automation and intelligent systems.',
    cta: 'Explore Projects',
    link: '#projects'
  },
  {
    image: '/hero2.png',
    title: 'Embedded Mastery',
    subtitle: 'Building smart solutions from the ground up with precision engineering.',
    cta: 'Learn More',
    link: '#about'
  },
  {
    image: '/hero3.png',
    title: 'Collaborative Growth',
    subtitle: 'Work together with the best minds to solve real-world problems.',
    cta: 'Join ROUTER',
    link: '#join'
  }
];

const WORDS = ['Robotics', 'Embedded Systems', 'Telecom', 'AI & Machine Learning', 'Programming'];

function TypingText() {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = WORDS[wordIdx];
    let delay = deleting ? 50 : 100;
    if (!deleting && charIdx === word.length) delay = 2000;
    if (deleting && charIdx === 0) delay = 500;

    const t = setTimeout(() => {
      if (!deleting && charIdx < word.length) {
        setDisplay(word.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      } else if (!deleting && charIdx === word.length) {
        setDeleting(true);
      } else if (deleting && charIdx > 0) {
        setDisplay(word.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      } else {
        setDeleting(false);
        setWordIdx(i => (i + 1) % WORDS.length);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx]);

  return (
    <span className="text-blue-400">
      {display}<span className="cursor-blink" />
    </span>
  );
}

function StatCounter({ value, suffix = '+', label, delay }) {
  const [ref, visible] = useScrollReveal();
  const count = useCountUp(value, 2000, visible);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="glass-dark rounded-lg sm:rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-colors"
    >
      <div className="text-lg sm:text-xl font-bold text-white mb-0.5 group-hover:scale-110 transition-transform">
        {count}{suffix}
      </div>
      <div className="text-blue-300/80 text-[10px] sm:text-xs font-bold uppercase tracking-widest">{label}</div>
    </motion.div>
  );
}

function HeroEditModal({ slides, onSave, onClose }) {
  const [localSlides, setLocalSlides] = useState(slides.map(s => ({ ...s })));

  const updateSlide = (idx, field, value) => {
    setLocalSlides(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const deleteSlide = (idx) => {
    setLocalSlides(prev => prev.filter((_, i) => i !== idx));
  };

  const handleReplaceImage = (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateSlide(idx, 'image', ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddSlide = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLocalSlides(prev => [...prev, {
        image: ev.target.result,
        title: 'New Slide',
        subtitle: 'Add your description here.',
        cta: 'Learn More',
        link: '#about'
      }]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = () => {
    try {
      localStorage.setItem('router_hero_slides', JSON.stringify(localSlides));
      onSave(localSlides);
      onClose();
    } catch {
      alert('Failed to save: images may be too large. Try smaller/compressed images.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Edit Hero Slides</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {localSlides.map((slide, idx) => (
            <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-28 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0">
                  <img src={slide.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    value={slide.title}
                    onChange={e => updateSlide(idx, 'title', e.target.value)}
                    className="w-full text-sm font-bold bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                    placeholder="Slide Title"
                  />
                  <input
                    value={slide.subtitle}
                    onChange={e => updateSlide(idx, 'subtitle', e.target.value)}
                    className="w-full text-xs bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 text-slate-500 dark:text-slate-400 outline-none focus:border-blue-500"
                    placeholder="Slide Subtitle"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500/10 text-blue-600 text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-blue-500/20 transition-colors cursor-pointer">
                  <Upload size={13} /> Replace Image
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleReplaceImage(idx, e)} />
                </label>
                <button
                  onClick={() => deleteSlide(idx)}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-500 text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-rose-500/20 transition-colors"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}

          <label className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer text-sm font-bold uppercase tracking-widest">
            <Upload size={16} /> Add New Slide
            <input type="file" accept="image/*" className="hidden" onChange={handleAddSlide} />
          </label>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-3 bg-blue-600 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-colors text-sm">Save Changes</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const { isAdmin } = useAuth();
  const [activeIdx, setActiveIdx] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [slides, setSlides] = useState(() => {
    try {
      const saved = localStorage.getItem('router_hero_slides');
      return saved ? JSON.parse(saved) : DEFAULT_SLIDES;
    } catch {
      return DEFAULT_SLIDES;
    }
  });

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative h-screen max-h-[700px] min-h-[600px] w-full overflow-hidden mesh-bg">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect="fade"
        speed={1500}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        onSlideChange={(swiper) => setActiveIdx(swiper.activeIndex)}
        className="h-full group"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} className="relative h-full">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 sm:via-slate-950/50 to-slate-950/20 sm:to-transparent z-10" />
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            </div>

            <div className="relative z-20 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-20 sm:pb-12 lg:pt-16">
              <AnimatePresence mode="wait">
                {activeIdx === i && (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl min-w-0"
                  >
                    <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-4 py-2 rounded-2xl mb-8">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-blue-300 text-xs font-bold uppercase tracking-[0.2em]">Khulna University</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-2 sm:mb-4 leading-[1.1] sm:leading-[1.15] tracking-tight break-words">
                      ROUTER<span className="text-blue-500">.</span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 leading-relaxed">
                      Pushing boundaries in <TypingText />
                    </p>

                    <p className="text-slate-300 text-sm sm:text-base md:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed max-w-2xl">
                      {slide.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => scrollTo(slide.link)}
                        className="btn-primary-modern w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm"
                      >
                        {slide.cta}
                        <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={() => scrollTo('#events')}
                        className="btn-secondary-modern w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm"
                      >
                        <PlayCircle size={16} />
                        Watch Showreels
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Admin Edit Button */}
      {isAdmin && (
        <button
          onClick={() => setEditOpen(true)}
          className="absolute top-20 sm:top-24 right-4 sm:right-6 z-40 flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600/90 hover:bg-blue-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-xl backdrop-blur-sm transition-colors shadow-lg"
        >
          <Settings size={14} /> Edit Slides
        </button>
      )}

      {/* Floating Stats */}
      <div className="absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 sm:px-6 z-30">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <StatCounter value={120} label="Active Members" delay={0.1} />
          <StatCounter value={45} label="Projects Completed" delay={0.2} />
          <StatCounter value={30} label="Tech Workshops" delay={0.3} />
          <StatCounter value={18} label="Excellence Awards" delay={0.4} />
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        whileHover={{ opacity: 1, y: 5 }}
        onClick={() => scrollTo('#about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white z-30 animate-bounce cursor-pointer p-2 hidden sm:block"
      >
        <ChevronDown size={32} />
      </motion.button>

      <AnimatePresence>
        {editOpen && (
          <HeroEditModal
            slides={slides}
            onSave={(updated) => setSlides(updated)}
            onClose={() => setEditOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
