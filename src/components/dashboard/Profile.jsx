import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CheckCircle, Circle, ChevronRight, Star, Trophy, BookOpen, Users, Zap, Edit3, Save, X } from 'lucide-react';

const SKILLS = [
  { name: 'Embedded Systems', key: 'embedded', color: '#2563eb' },
  { name: 'Robotics', key: 'robotics', color: '#7c3aed' },
  { name: 'Programming', key: 'programming', color: '#059669' },
  { name: 'Telecommunications', key: 'telecom', color: '#d97706' },
  { name: 'AI / Machine Learning', key: 'aiml', color: '#dc2626' },
];

const ACHIEVEMENTS = [
  { icon: '🏆', label: 'Champion', desc: 'Won a competition', earned: true, color: '#d97706' },
  { icon: '🤖', label: 'Builder', desc: 'Submitted a project', earned: true, color: '#2563eb' },
  { icon: '📡', label: 'Signal Master', desc: 'Completed Telecom workshop', earned: false, color: '#7c3aed' },
  { icon: '⭐', label: 'Early Bird', desc: 'Joined in first month', earned: true, color: '#059669' },
  { icon: '🔥', label: 'On Fire', desc: '5-day activity streak', earned: false, color: '#dc2626' },
  { icon: '🎓', label: 'Scholar', desc: 'Published research', earned: false, color: '#0891b2' },
];

const STEPS = [
  { label: 'Verify email', done: true },
  { label: 'Complete profile', done: true },
  { label: 'Join a team', done: false },
  { label: 'Register for a workshop', done: false },
  { label: 'Submit a project', done: false },
];

function OnboardingProgress() {
  const done = STEPS.filter(s => s.done).length;
  const pct = Math.round((done / STEPS.length) * 100);
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white">Getting Started</h3>
        <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">{done}/{STEPS.length} done</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
      </div>
      <div className="space-y-3">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            {step.done
              ? <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
              : <Circle size={18} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />}
            <span className={`text-sm ${step.done ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300 font-medium'}`}>{step.label}</span>
            {!step.done && i === done && <ChevronRight size={14} className="text-blue-500 ml-auto" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillBars() {
  const [skills] = useState({ embedded: 78, robotics: 65, programming: 82, telecom: 40, aiml: 55 });
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
      <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-5">Skill Profile</h3>
      <div className="space-y-4">
        {SKILLS.map(skill => (
          <div key={skill.key}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
              <span className="text-xs font-semibold" style={{ color: skill.color }}>{skills[skill.key]}%</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full skill-bar" style={{ width: `${skills[skill.key]}%`, background: skill.color, animationDelay: `${SKILLS.indexOf(skill) * 150}ms` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementBadges() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Trophy size={18} className="text-amber-500" />
        <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white">Achievements</h3>
        <span className="ml-auto badge bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs">
          {ACHIEVEMENTS.filter(a => a.earned).length}/{ACHIEVEMENTS.length}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {ACHIEVEMENTS.map((a, i) => (
          <div key={i} className={`flex flex-col items-center gap-1.5 ${!a.earned ? 'opacity-35 grayscale' : 'badge-pop'}`}
            style={{ animationDelay: `${i * 80}ms` }}
            title={a.desc}>
            <div className="w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl"
              style={{ borderColor: a.earned ? a.color + '50' : '#e5e7eb', background: a.earned ? a.color + '15' : '#f9fafb' }}>
              {a.icon}
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight">{a.label}</span>
            <span className="text-[10px] text-gray-400 text-center leading-tight">{a.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '', batch: user?.batch || '' });
  const [saving, setSaving] = useState(false);

  // Re-sync form when user data changes (e.g. after update or re-fetch)
  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '', bio: user.bio || '', batch: user.batch || '' });
    }
  }, [user]);

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 w-full min-w-0">
      {/* Profile card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold font-heading shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">{user?.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
              <span className="badge bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs mt-1">{user?.role}</span>
            </div>
          </div>
          <button onClick={() => editing ? save() : setEditing(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors w-full sm:w-auto shrink-0">
            {editing ? <><Save size={14} />Save</> : <><Edit3 size={14} />Edit</>}
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { k: 'name', l: 'Full Name' }, { k: 'phone', l: 'Phone' }, { k: 'batch', l: 'Year / Batch' }
          ].map(f => (
            <div key={f.k}>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{f.l}</label>
              {editing
                ? <input value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition" />
                : <p className="text-sm text-gray-800 dark:text-gray-200">{user?.[f.k] || '—'}</p>}
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Bio</label>
            {editing
              ? <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={2}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition resize-none" />
              : <p className="text-sm text-gray-800 dark:text-gray-200">{user?.bio || 'No bio yet.'}</p>}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <OnboardingProgress />
        <SkillBars />
      </div>
      <AchievementBadges />
    </div>
  );
}
