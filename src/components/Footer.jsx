import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Github, Linkedin, Facebook, Twitter, ArrowUp, Zap } from 'lucide-react';

const sections = [
  {
    title: 'Club', links: [
      { label: 'Our Story', href: '#about' },
      { label: 'Timeline', href: '#timeline' },
      { label: 'Activities', href: '#activities' },
      { label: 'Team', href: '#team' },
    ]
  },
  {
    title: 'Resources', links: [
      { label: 'Projects', href: '#projects' },
      { label: 'Workshops', href: '#workshops' },
      { label: 'Gallery', href: '#gallery' },
      { label: 'Events', href: '#events' },
    ]
  },
  {
    title: 'Account', links: [
      { label: 'Member Portal', href: '/login' },
      { label: 'Join Now', href: '/register' },
      { label: 'Dashboard', href: '/dashboard' },
    ]
  },
];

const socials = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
];

export default function Footer() {
  const scrollTo = (href) => {
    if (href.startsWith('#')) document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-slate-950 text-slate-400 relative overflow-hidden pt-12 sm:pt-24 pb-10 sm:pb-12">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 sm:gap-16 mb-10 sm:mb-20">

          {/* Brand Info */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                <Zap size={24} fill="currentColor" />
              </div>
              <span className="text-3xl font-black text-white uppercase tracking-tighter">ROUTER</span>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-sm">
              The premier technical catalyst for <span className="text-white">ECE Discipline</span> students. Driven by innovation, fueled by engineering excellence.
            </p>
            <div className="flex gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href}
                  className="w-12 h-12 bg-slate-900 hover:bg-blue-600 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 border border-slate-800"
                  aria-label={label}>
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12">
            {sections.map(s => (
              <div key={s.title}>
                <h4 className="text-white text-xs font-black uppercase tracking-widest mb-4 sm:mb-8">{s.title}</h4>
                <ul className="space-y-4">
                  {s.links.map(l => (
                    <li key={l.label}>
                      {l.href.startsWith('#')
                        ? <button onClick={() => scrollTo(l.href)} className="text-slate-500 hover:text-blue-500 text-sm font-bold transition-colors">{l.label}</button>
                        : <Link to={l.href} className="text-slate-500 hover:text-blue-500 text-sm font-bold transition-colors">{l.label}</Link>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="grid sm:grid-cols-3 gap-8 py-10 border-y border-slate-900 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-blue-500"><MapPin size={18} /></div>
            <div className="text-xs font-bold leading-tight">Khulna University<br /><span className="text-slate-500">Khulna, 9208 BD</span></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-blue-500"><Mail size={18} /></div>
            <div className="text-xs font-bold">router@ku.ac.bd<br /><span className="text-slate-500">Official Support</span></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-blue-500"><Phone size={18} /></div>
            <div className="text-xs font-bold">+880 1700-000001<br /><span className="text-slate-500">Club Hotline</span></div>
          </div>
        </div>

        <div className="flex flex-col sm:grid sm:grid-cols-2 items-center justify-between gap-6 pb-4">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
            © {new Date().getFullYear()} ROUTER Club · ECE Discipline · Khulna University
          </p>
          <button onClick={scrollTop}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-500 text-[10px] font-black uppercase tracking-widest transition-all group">
            Top of Page <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center group-hover:-translate-y-1 transition-transform"><ArrowUp size={14} /></div>
          </button>
        </div>
      </div>
    </footer>
  );
}
