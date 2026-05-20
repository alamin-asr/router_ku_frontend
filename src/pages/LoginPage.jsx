import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back!', 'Signed in');
      navigate(result.role === 'ADMIN' ? '/admin' : '/dashboard');
    } else {
      toast.error(result.error || 'Invalid credentials.');
    }
  };

  const demo = (email, pwd) => setForm({ email, password: pwd });

  return (
    <div className="min-h-[100dvh] bg-gray-50 dark:bg-gray-950 flex flex-col sm:flex-row items-stretch sm:items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to home
        </Link>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="font-heading text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400 tracking-widest">ROUTER</div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-2">Sign In</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Access your member dashboard</p>
          </div>

          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-10 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition" />
                <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full text-center flex items-center justify-center gap-2 !py-3">
              {loading && <Loader2 size={15} className="animate-spin" />} Sign In
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">Demo Credentials</p>
            <div className="space-y-1.5">
              {[
                { label: 'Admin', email: 'admin@system.com', pwd: 'admin123', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
                { label: 'Member', email: '220940@ku.ac.bd', pwd: 'alamin123', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
              ].map(d => (
                <button key={d.label} onClick={() => demo(d.email, d.pwd)}
                  className={`w-full flex flex-wrap items-center gap-x-2 gap-y-1 px-2.5 py-1.5 rounded-lg text-left text-xs hover:opacity-80 transition-opacity min-w-0 ${d.color}`}>
                  <span className="font-semibold">{d.label}:</span>
                  <span className="break-all text-left">{d.email}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-5">
            New member? <Link to="/register" className="text-blue-600 hover:underline font-medium">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
