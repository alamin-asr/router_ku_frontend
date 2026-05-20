import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, CheckCircle2, FileText, GraduationCap, Loader2, Mail, MoveRight, Phone, Sparkles, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userApi } from '../api/services';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

const defaultForm = {
  name: '',
  email: '',
  studentId: '',
  discipline: '',
  batch: '',
  phone: '',
  bio: '',
};

const emptyErrors = {
  studentId: '',
  discipline: '',
  batch: '',
  phone: '',
};

function FieldShell({ label, error, children, optional = false }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label>
        {optional && <span className="text-xs text-slate-400 dark:text-slate-500">Optional</span>}
      </div>
      {children}
      {error ? <p className="mt-1.5 text-xs font-medium text-rose-500 dark:text-rose-400">{error}</p> : null}
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-300">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

export default function CompleteProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, refreshUser } = useAuth();

  const routeName = location.state?.name || '';
  const routeEmail = location.state?.email || '';
  const routeStudentId = location.state?.studentId || '';

  const authName = user?.name || '';
  const authEmail = user?.email || '';

  const resolvedIdentity = useMemo(() => {
    const email = routeEmail || authEmail || '';
    return {
      name: routeName || authName || '',
      email,
      studentId: routeStudentId || user?.studentId || (email.includes('@') ? email.split('@')[0] : ''),
    };
  }, [authEmail, authName, routeEmail, routeName, routeStudentId, user?.studentId]);

  const [form, setForm] = useState(() => ({
    ...defaultForm,
    ...resolvedIdentity,
  }));
  const [errors, setErrors] = useState(emptyErrors);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!resolvedIdentity.email) {
      navigate('/register', { replace: true });
      return;
    }

    setForm(prev => ({
      ...prev,
      name: prev.name || resolvedIdentity.name,
      email: resolvedIdentity.email,
      studentId: prev.studentId || resolvedIdentity.studentId,
    }));
  }, [navigate, resolvedIdentity]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const nextErrors = { ...emptyErrors };
    if (!form.studentId.trim()) nextErrors.studentId = 'Student ID is required.';
    if (!form.discipline.trim()) nextErrors.discipline = 'Discipline is required.';
    if (!form.batch.trim()) nextErrors.batch = 'Batch is required.';
    if (!form.phone.trim()) {
      nextErrors.phone = 'Phone number is required.';
    } else {
      const digits = form.phone.replace(/\D/g, '');
      if (digits.length < 10) nextErrors.phone = 'Please enter a valid phone number.';
    }
    return nextErrors;
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        studentId: form.studentId.trim(),
        discipline: form.discipline.trim(),
        batch: form.batch.trim(),
        phone: form.phone.trim(),
        bio: form.bio.trim(),
      };

      await userApi.completeProfile(payload);
      toast.success('Registration completed successfully');
      setSubmitted(true);
      refreshUser().catch(() => {});
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to complete registration. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.24),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.18),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,1))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[0.92fr_1.08fr] xl:grid-cols-[0.9fr_1.1fr]">
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-8"
          >
            <div>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                <Sparkles size={13} /> Verified onboarding
              </div>

              <h1 className="max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl xl:text-5xl">
                Complete your university profile in one polished step.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Your email has already been verified. Add your academic details to unlock the member dashboard and personalize your experience.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <StatPill label="Verified email" value={resolvedIdentity.email || 'Pending'} />
                <StatPill label="Student record" value="Required to continue" />
                <StatPill label="Profile state" value="One step away" />
                <StatPill label="Portal style" value="Dashboard ready" />
              </div>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-2xl bg-emerald-400/15 p-2 text-emerald-300">
                  <BadgeCheck size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">What happens next</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    After submission, your account is marked complete and you can move into the dashboard with your profile ready.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -18 }}
                transition={{ duration: 0.28 }}
                className="flex items-center justify-center"
              >
                <Card className="w-full max-w-2xl border-emerald-500/20 bg-slate-950/90 text-white shadow-[0_30px_120px_-35px_rgba(16,185,129,0.55)]">
                  <CardContent className="flex flex-col items-center px-6 py-12 text-center sm:px-10 sm:py-16">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl" />
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
                        <CheckCircle2 size={42} strokeWidth={2.1} />
                      </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">Profile completed</h2>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
                      Registration completed successfully. Your student profile is now ready for the ROUTER dashboard.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Button onClick={() => navigate('/dashboard')} className="min-w-44">
                        Go to dashboard <MoveRight size={16} />
                      </Button>
                      <Button variant="outline" onClick={() => navigate('/')}>Back to home</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.28 }}
                className="h-full"
              >
                <Card className="h-full bg-white/95 dark:bg-slate-950/95">
                  <CardHeader className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                          <GraduationCap size={13} /> Complete profile
                        </div>
                        <CardTitle>Student Registration Details</CardTitle>
                        <CardDescription>
                          Fill in your academic information to finish onboarding.
                        </CardDescription>
                      </div>
                      <div className="hidden rounded-2xl bg-slate-100 p-3 text-slate-500 dark:bg-slate-900 dark:text-slate-300 sm:block">
                        <UserRound size={20} />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <form onSubmit={submit} className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <FieldShell label="Full name">
                          <div className="relative">
                            <UserRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <Input
                              value={form.name}
                              onChange={(e) => handleChange('name', e.target.value)}
                              placeholder="Your full name"
                              className="pl-10"
                              autoComplete="name"
                            />
                          </div>
                        </FieldShell>

                        <FieldShell label="Email address">
                          <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <Input
                              value={form.email}
                              readOnly
                              disabled
                              className="pl-10"
                              aria-readonly="true"
                            />
                          </div>
                        </FieldShell>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <FieldShell label="Student ID" error={errors.studentId}>
                          <div className="relative">
                            <BadgeCheck className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <Input
                              value={form.studentId}
                              onChange={(e) => handleChange('studentId', e.target.value)}
                              placeholder="220924"
                              className="pl-10"
                              autoComplete="off"
                            />
                          </div>
                        </FieldShell>

                        <FieldShell label="Discipline" error={errors.discipline}>
                          <div className="relative">
                            <GraduationCap className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <Input
                              value={form.discipline}
                              onChange={(e) => handleChange('discipline', e.target.value)}
                              placeholder="ECE"
                              className="pl-10"
                              autoComplete="organization-title"
                            />
                          </div>
                        </FieldShell>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <FieldShell label="Batch" error={errors.batch}>
                          <Input
                            value={form.batch}
                            onChange={(e) => handleChange('batch', e.target.value)}
                            placeholder="2022"
                            autoComplete="off"
                          />
                        </FieldShell>

                        <FieldShell label="Phone" error={errors.phone}>
                          <div className="relative">
                            <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <Input
                              value={form.phone}
                              onChange={(e) => handleChange('phone', e.target.value)}
                              placeholder="017XXXXXXXX"
                              className="pl-10"
                              autoComplete="tel"
                            />
                          </div>
                        </FieldShell>
                      </div>

                      <FieldShell label="Bio" optional>
                        <div className="relative">
                          <FileText className="pointer-events-none absolute left-3 top-3 text-slate-400" size={16} />
                          <Textarea
                            value={form.bio}
                            onChange={(e) => handleChange('bio', e.target.value)}
                            placeholder="A short bio about your interests, goals, or activities"
                            className="pl-10"
                            rows={4}
                          />
                        </div>
                      </FieldShell>

                      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                          Required fields are validated before submission.
                        </p>
                        <Button type="submit" disabled={loading} size="lg" className="w-full sm:w-auto sm:min-w-56">
                          {loading ? <Loader2 className="animate-spin" size={16} /> : <MoveRight size={16} />}
                          {loading ? 'Saving profile...' : 'Complete registration'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}