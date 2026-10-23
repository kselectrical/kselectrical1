import React from 'react';
import { PhoneCall, AlertTriangle, X, Check } from 'lucide-react';

interface PriceConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  helplinePhone?: string;
}

export const PriceConfirmationModal: React.FC<PriceConfirmationModalProps> = ({
  isOpen,
  onClose,
  helplinePhone = '+919625724903'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden transform animate-in zoom-in-95 duration-200 text-left font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="p-6 sm:p-7 space-y-5">
          {/* Header Icon + Title */}
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle size={24} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                महत्वपूर्ण सूचना • Notice
              </div>
              <h3 className="text-lg font-black text-slate-900 leading-tight mt-1">
                कन्फर्म प्राइस फोन करके पता कर लें
              </h3>
              <p className="text-xs font-bold text-slate-500">
                Please Confirm Final Price on Phone
              </p>
            </div>
          </div>

          {/* Hindi Notice Box */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-1.5 text-slate-800">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-black uppercase">
              <span>🇮🇳</span>
              <span>हिंदी में सूचना:</span>
            </div>
            <p className="text-xs font-semibold leading-relaxed">
              आपकी सर्विस बुकिंग दर्ज हो गई है! कृपया काम शुरू होने से पहले <strong>अंतिम और कन्फर्म कीमत (Final Price)</strong> हमारे हेल्पलाइन नंबर या तकनीशियन से फोन करके जरूर पता कर लें।
            </p>
          </div>

          {/* English Notice Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 text-slate-700">
            <div className="flex items-center gap-1.5 text-slate-800 text-xs font-black uppercase">
              <span>🌐</span>
              <span>English Notice:</span>
            </div>
            <p className="text-xs font-medium leading-relaxed">
              Your service request is received! Please <strong>call our helpline or technician to confirm the exact final price</strong> and inspection scope before work begins.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <a
              href={`tel:${helplinePhone}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all duration-150 hover:scale-[1.01] active:scale-[0.98] cursor-pointer text-center"
            >
              <PhoneCall size={18} className="animate-pulse" />
              <span>कॉल करके रेट कन्फर्म करें (+91 96257 24903)</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check size={14} />
              <span>ठीक है, समझ गया / Got it, Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
