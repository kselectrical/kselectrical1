import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, User, ArrowRight, Loader, ShieldCheck, Star, Wrench } from 'lucide-react';
import { auth, isFirebaseConfigured, saveCustomerToCloud, getCustomerByPhoneFromDb } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

interface CustomerLoginPageProps {
  onLoginSuccess: (role: 'customer' | 'admin', user?: { name: string; email: string; photoUrl: string; phone?: string; address?: string }) => void;
  isLoggedIn: boolean;
}

export const CustomerLoginPage: React.FC<CustomerLoginPageProps> = ({ onLoginSuccess, isLoggedIn }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'phone' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Already logged in → redirect to dashboard
  useEffect(() => {
    if (isLoggedIn) navigate('/customer/dashboard', { replace: true });
  }, [isLoggedIn, navigate]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim();
    if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Look up customer by phone from Firestore Customers, past orders, past bookings, or session
      const customerData = await getCustomerByPhoneFromDb(cleanPhone);

      if (customerData && customerData.name) {
        // Existing customer found in database — login directly without asking for name again!
        const email = customerData.email || `${cleanPhone}@kselectrical.in`;
        const password = cleanPhone;

        if (isFirebaseConfigured && auth) {
          try {
            await signInWithEmailAndPassword(auth, email, password);
          } catch (authErr: unknown) {
            const err = authErr as { code?: string };
            if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
              const cred = await createUserWithEmailAndPassword(auth, email, password);
              await updateProfile(cred.user, { displayName: customerData.name });
            }
          }
        }

        // Save session locally with complete profile (name, phone, address)
        localStorage.setItem('ks_auth_session', JSON.stringify({
          isLoggedIn: true,
          userRole: 'customer',
          currentUser: {
            name: customerData.name,
            email,
            phone: cleanPhone,
            address: customerData.address || '',
            photoUrl: customerData.photoUrl || '/profile.webp'
          }
        }));

        onLoginSuccess('customer', {
          name: customerData.name,
          email,
          photoUrl: customerData.photoUrl || '/profile.webp',
          phone: cleanPhone,
          address: customerData.address || '',
        });
        navigate('/customer/dashboard', { replace: true });
        return;
      }

      // New customer — ask for name
      setStep('name');
    } catch (err) {
      console.error("Login phone submit error:", err);
      setStep('name'); // fallback to registration
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    if (cleanName.length < 2) {
      setError('Please enter your full name.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const email = `${cleanPhone}@kselectrical.in`;
      const password = cleanPhone;

      try {
        await signInWithEmailAndPassword(auth!, email, password);
      } catch (authErr: unknown) {
        const err = authErr as { code?: string };
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
          const cred = await createUserWithEmailAndPassword(auth!, email, password);
          await updateProfile(cred.user, { displayName: cleanName });
        } else throw authErr;
      }

      await saveCustomerToCloud({ name: cleanName, phone: cleanPhone, photoUrl: '/profile.webp' });

      onLoginSuccess('customer', {
        name: cleanName,
        email,
        photoUrl: '/profile.webp',
        phone: cleanPhone,
      });
      navigate('/customer/dashboard', { replace: true });
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <img src="/log.webp" alt="KS Electrical" className="h-12 mx-auto mb-4 drop-shadow-lg" />
          <h1 className="text-2xl font-black text-white tracking-tight">KS Electrical & AC Services</h1>
          <p className="text-blue-300 text-sm mt-1">Customer Portal — Access your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">

          {/* Trust Badges */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-green-400 text-xs font-semibold">
              <ShieldCheck size={14} />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-400 text-xs font-semibold">
              <Star size={14} />
              <span>4.9★ Rated</span>
            </div>
            <div className="flex items-center gap-1 text-blue-300 text-xs font-semibold">
              <Wrench size={14} />
              <span>5000+ Jobs</span>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${step === 'phone' || step === 'name' ? 'bg-blue-400' : 'bg-white/20'}`} />
            <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${step === 'name' ? 'bg-blue-400' : 'bg-white/20'}`} />
          </div>

          {/* STEP 1: Phone */}
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-white/80 text-xs font-bold uppercase tracking-wider mb-2">
                  📱 Enter Mobile Number
                </label>
                <div className="flex bg-white/10 border border-white/20 rounded-xl overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/30 transition-all">
                  <div className="flex items-center px-3 border-r border-white/20 text-white/60 font-bold text-sm bg-white/5">
                    +91
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[6-9][0-9]{9}"
                    required
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
                    placeholder="10-digit number"
                    className="flex-1 bg-transparent text-white placeholder-white/40 px-3 py-3 focus:outline-none font-semibold text-sm"
                    autoComplete="tel"
                    autoFocus
                  />
                </div>
                <p className="text-white/40 text-xs mt-1.5">
                  First time here? Enter your number — an account will be created automatically.
                </p>
              </div>

              {error && (
                <p className="text-red-400 text-xs font-semibold bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-white/10 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-blue-500/25"
              >
                {loading ? (
                  <><Loader size={16} className="animate-spin" /> Checking...</>
                ) : (
                  <><span>Continue</span><ArrowRight size={16} /></>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Name (New Customer) */}
          {step === 'name' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl px-3 py-2 flex items-center gap-2 mb-2">
                <Phone size={13} className="text-blue-400" />
                <span className="text-blue-300 text-xs font-bold">+91 {phone}</span>
                <button type="button" onClick={() => { setStep('phone'); setError(''); }} className="ml-auto text-white/40 hover:text-white text-xs underline">
                  Change
                </button>
              </div>

              <div>
                <label className="block text-white/80 text-xs font-bold uppercase tracking-wider mb-2">
                  👤 Your Full Name
                </label>
                <div className="flex bg-white/10 border border-white/20 rounded-xl overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/30 transition-all">
                  <div className="flex items-center px-3 border-r border-white/20 text-white/40 bg-white/5">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(''); }}
                    placeholder="Enter your full name"
                    className="flex-1 bg-transparent text-white placeholder-white/40 px-3 py-3 focus:outline-none font-semibold text-sm"
                    autoComplete="name"
                    autoFocus
                  />
                </div>
                <p className="text-white/40 text-xs mt-1.5">
                  A new account will be created. Your data remains encrypted &amp; safe.
                </p>
              </div>

              {error && (
                <p className="text-red-400 text-xs font-semibold bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || name.trim().length < 2}
                className="w-full bg-green-500 hover:bg-green-400 disabled:bg-white/10 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-green-500/25"
              >
                {loading ? (
                  <><Loader size={16} className="animate-spin" /> Creating Account...</>
                ) : (
                  <><span>Create Account &amp; Continue</span><ArrowRight size={16} /></>
                )}
              </button>
            </form>
          )}

          {/* Benefits */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-white/40 text-xs text-center mb-3">After Logging In You Get:</p>
            <div className="grid grid-cols-2 gap-2">
              {['Live Order Tracking', 'Service History', 'Product Orders', 'Warranty Check'].map((b) => (
                <div key={b} className="flex items-center gap-1.5 text-white/60 text-xs">
                  <div className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Link */}
        <p className="text-center mt-4">
          <Link
            to="/admin/login"
            className="text-white/30 hover:text-white/60 text-xs font-semibold transition-colors"
          >
            Employee / Staff Login →
          </Link>
        </p>

        {/* Back to home */}
        <p className="text-center mt-2">
          <Link
            to="/"
            className="text-blue-400/60 hover:text-blue-300 text-xs transition-colors"
          >
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
