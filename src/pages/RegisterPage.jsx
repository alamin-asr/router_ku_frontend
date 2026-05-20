import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, ArrowLeft, Loader2, Mail, CheckCircle, Lock } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: Info, 2: Verify & Password
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { initiateRegistration, verifyOtp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleInitiate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await initiateRegistration({ name: form.name, email: form.email });
    setLoading(false);

    if (res.success) {
      toast.success('OTP sent to your email!', 'Check your inbox');
      setStep(2);
    } else {
      setError(res.error);
      toast.error(res.error);
    }
  };

  const handleVerifyAndSetPassword = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const res = await verifyOtp(form.email, otp, form.password);
    setLoading(false);

    if (res.success) {
      toast.success('Email verified successfully.', 'Complete your profile');
      navigate('/complete-profile', {
        state: {
          name: form.name,
          email: form.email,
          user: res.user,
        },
      });
    } else {
      setError(res.error);
      toast.error(res.error);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 dark:bg-gray-950 flex flex-col sm:flex-row items-stretch sm:items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 mb-6">
          <ArrowLeft size={14} /> Back to home
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="font-heading text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400 tracking-widest">ROUTER</div>
            <h1 className="text-xl sm:text-2xl font-bold mt-2">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">
              {step === 1 && "Join the ROUTER community"}
              {step === 2 && "Verify email and set password"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2].map(s => (
              <div key={s} className={`w-12 h-1.5 rounded-full transition-all ${step >= s ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 border border-red-100">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Name + Email */}
            {step === 1 && (
              <motion.form
                key="step-1"
                onSubmit={handleInitiate}
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 !py-3"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Continue
              </button>
              </motion.form>
            )}

            {/* Step 2: OTP Verification & Set Password */}
            {step === 2 && (
              <motion.form
                key="step-2"
                onSubmit={handleVerifyAndSetPassword}
                className="space-y-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 text-center mb-2">
                <Mail className="mx-auto text-blue-600 mb-2" size={24} />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  We sent a 6-digit OTP to<br />
                  <span className="font-medium text-gray-900 dark:text-white">{form.email}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Enter OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full px-4 py-2.5 sm:py-3 text-center text-lg sm:text-2xl tracking-widest font-mono rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Create Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => updateForm('password', e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6 || form.password.length < 6}
                className="btn-primary w-full flex items-center justify-center gap-2 !py-3 mt-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Verify & Create Account
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-gray-500 hover:text-gray-700 w-full"
              >
                ← Go Back
              </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
}