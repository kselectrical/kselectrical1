import React, { useState } from 'react';
import { X, User, Sparkles, Loader } from 'lucide-react';
import { auth, isFirebaseConfigured, db, saveCustomerToCloud } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: 'customer' | 'admin', user?: { name: string; email: string; photoUrl: string; phone?: string }) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  // Customer State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isCustomerLoading, setIsCustomerLoading] = useState(false);
  const [loginStep, setLoginStep] = useState<'phone' | 'name'>('phone');
  const [error, setError] = useState('');

  const handleClose = () => {
    setLoginStep('phone');
    setCustomerPhone('');
    setCustomerName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const phone = customerPhone.trim();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsCustomerLoading(true);
    setError('');

    if (loginStep === 'phone') {
      try {
        let name = '';
        let userExists = false;

        // Query Firestore Customers collection first
        if (isFirebaseConfigured && db) {
          try {
            const docRef = doc(db, 'Customers', phone);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              name = docSnap.data().name || 'Valued Customer';
              userExists = true;
            }
          } catch (fsErr) {
            console.error("Firestore customer check failed:", fsErr);
          }
        }

        if (userExists) {
          const email = `${phone}@kselectrical.in`;
          const password = phone;
          const photoUrl = '/profile.webp';

          const user = { name, email, photoUrl, phone };

          if (isFirebaseConfigured && auth) {
            try {
              await signInWithEmailAndPassword(auth, email, password);
            } catch (err) {
              const authError = err as { code?: string; message?: string };
              if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential' || authError.code === 'auth/invalid-email') {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
              } else {
                throw err;
              }
            }
          }

          onLoginSuccess('customer', user);
          handleClose();
        } else {
          setLoginStep('name');
        }
      } catch (err) {
        console.error("Error checking customer existence:", err);
        setLoginStep('name');
      } finally {
        setIsCustomerLoading(false);
      }
    } else {
      const name = customerName.trim();
      if (name.length < 2) {
        setError('Please enter a valid name (at least 2 characters).');
        setIsCustomerLoading(false);
        return;
      }

      try {
        const email = `${phone}@kselectrical.in`;
        const password = phone;
        const photoUrl = '/profile.webp';

        const user = { name, email, photoUrl, phone };

        // 1. Sign up/In to Firebase Auth
        if (isFirebaseConfigured && auth) {
          try {
            await signInWithEmailAndPassword(auth, email, password);
          } catch (err) {
            const authError = err as { code?: string; message?: string };
            if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential' || authError.code === 'auth/invalid-email') {
              const userCredential = await createUserWithEmailAndPassword(auth, email, password);
              await updateProfile(userCredential.user, { displayName: name });
            } else {
              throw err;
            }
          }
        }

        // 2. Save profile in Firestore Customers collection
        await saveCustomerToCloud({ name, phone, photoUrl });

        onLoginSuccess('customer', user);
        handleClose();
      } catch (err) {
        const authError = err as { message?: string };
        console.error("Customer signup failed:", err);
        setError(authError.message || 'Registration failed. Please try again.');
      } finally {
        setIsCustomerLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      
      {/* Backdrop Click Close */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Modal Container */}
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative z-10 shadow-dropdown font-sans text-center border border-gray-100">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-50 transition-all cursor-pointer select-none"
          aria-label="Close login modal"
        >
          <X size={16} />
        </button>

        {/* Brand Header */}
        <div className="mb-6 mt-2">
          <div className="w-11 h-11 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto border border-blue-100 shadow-sm mb-2">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <h2 className="text-gray-900 font-black text-lg tracking-tight">KS Portal Access</h2>
          <p className="text-[10px] text-gray-450 font-bold uppercase tracking-wider mt-0.5">Secure authentication gate</p>
        </div>

        {/* Customer Login Form */}
        <div className="min-h-[190px] flex flex-col justify-between text-left">
          <form onSubmit={handleCustomerSubmit} className="space-y-4 py-1">
            <div className="space-y-3.5">
              {/* Full Name (Show only if new customer) */}
              {loginStep === 'name' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor="customer-name" className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Your Name</label>
                    <span className="text-[9px] text-brand-blue font-bold px-1.5 py-0.5 bg-blue-50 border border-blue-100 rounded">New User</span>
                  </div>
                  <div className="flex border border-gray-250 rounded-lg overflow-hidden focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-blue-100 transition-all bg-white">
                    <div className="border-r border-gray-200 px-2.5 py-2 text-gray-400 flex items-center bg-gray-50">
                      <User size={13} />
                    </div>
                    <input
                      id="customer-name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter your name"
                      className="flex-1 bg-white text-gray-800 text-xs font-semibold px-2.5 py-2 focus:outline-none placeholder-gray-400 animate-in fade-in slide-in-from-top-1 duration-200"
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              {/* Mobile Number */}
              <div className="space-y-1">
                <label htmlFor="customer-phone" className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Mobile Number</label>
                <div className="flex border border-gray-250 rounded-lg overflow-hidden focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-blue-100 transition-all bg-white">
                  <div className="border-r border-gray-200 px-2.5 py-2 text-gray-400 flex items-center bg-gray-50">
                    <span className="text-xs font-bold text-gray-400">+91</span>
                  </div>
                  <input
                    id="customer-phone"
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    inputMode="numeric"
                    disabled={loginStep === 'name'}
                    value={customerPhone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setCustomerPhone(val);
                      if (error) setError('');
                    }}
                    placeholder="10-digit mobile number"
                    className="flex-1 bg-white text-gray-800 text-xs font-semibold px-2.5 py-2 focus:outline-none placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-450"
                    autoComplete="tel"
                    aria-label="Enter your 10-digit mobile number"
                  />
                </div>
                {loginStep === 'name' && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginStep('phone');
                        setError('');
                      }}
                      className="text-[9.5px] text-brand-blue hover:underline font-bold"
                    >
                      Change Number
                    </button>
                  </div>
                )}
              </div>
            </div>

            {error && <p className="text-[10px] text-red-500 font-extrabold text-center animate-shake">{error}</p>}

            <button
              type="submit"
              disabled={isCustomerLoading}
              className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow cursor-pointer select-none active:scale-98 flex items-center justify-center"
            >
              {isCustomerLoading ? (
                <>
                  <Loader size={13} className="animate-spin mr-1" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{loginStep === 'phone' ? 'Continue' : 'Complete Registration'}</span>
              )}
            </button>

            <p className="text-[9px] text-gray-450 font-semibold leading-normal text-center">
              Your data is fully secure. Same-day service activation.
            </p>
          </form>
        </div>

        {/* Discrete Admin Link at Bottom */}
        <div className="mt-5 pt-4 border-t border-gray-100 text-center">
          <Link
            to="/admin/login"
            onClick={handleClose}
            className="text-[10px] text-gray-400 hover:text-brand-blue font-bold uppercase tracking-wider transition-colors"
          >
            Are you an employee? Staff Login
          </Link>
        </div>

      </div>
    </div>
  );
};
