import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Briefcase, Phone, MapPin, User, Star, CheckCircle } from 'lucide-react';

export const CareersPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: '',
    experience: '',
    location: '',
    current_employment: '',
    preferred_locations: '',
    note: ''
  });
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const roles = [
    {
      title: "AC Technician / HVAC Engineer",
      type: "Full-Time / Part-Time",
      experience: "2+ Years Required",
      desc: "Expertise in Split & Window AC installations, high-pressure wet jet cleaning, compressor replacement, capacitor diagnostics, and R32/R22 gas charging."
    },
    {
      title: "Certified Residential Electrician",
      type: "Full-Time / Part-Time",
      experience: "1+ Years Required",
      desc: "Diagnostics of household short circuits, installation of modular switchboards, distribution box MCB upgrades, geyser thermostat repairs, and ceiling fan fittings."
    },
    {
      title: "RO Water Purifier Specialist",
      type: "Full-Time",
      experience: "1+ Year Required",
      desc: "Cartridge/filter replacement, TDS calibration, reverse osmosis membrane flush, booster pump repairs, and leakage fixes."
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setSubmitError('Please select a valid image file (JPG, PNG, WEBP).');
        return;
      }
      if (file.size > 8 * 1024 * 1024) { // 8MB limit
        setSubmitError('Image size exceeds 8MB limit.');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setSubmitError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile) {
      setSubmitError('Please upload a profile photo / selfie (अपनी फोटो अपलोड करें)।');
      return;
    }
    if (formData.phone.trim().length !== 10) {
      setSubmitError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const bodyData = new FormData();
    bodyData.append('name', formData.name);
    bodyData.append('phone', formData.phone);
    bodyData.append('role', formData.role);
    bodyData.append('experience', formData.experience);
    bodyData.append('location', formData.location);
    bodyData.append('current_employment', formData.current_employment);
    bodyData.append('preferred_locations', formData.preferred_locations);
    bodyData.append('note', formData.note);
    bodyData.append('photo', photoFile);

    // Proceed directly to WhatsApp application (since PHP server is decommissioned)
    const phoneNum = "917895321472"; // Kaushindra Singh's WhatsApp
    const message = `Hello KS Electrical, I would like to apply for a job role.\n\n*Application Details:*\n- *Name:* ${formData.name}\n- *Phone:* ${formData.phone}\n- *Role Applied:* ${formData.role}\n- *Experience:* ${formData.experience} Years\n- *Current Location:* ${formData.location}\n- *Current Employment:* ${formData.current_employment}\n- *Preferred Locations:* ${formData.preferred_locations}\n- *Additional Notes:* ${formData.note || 'None'}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNum}?text=${encodedMessage}`;
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Redirect to WhatsApp after brief delay
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        role: '',
        experience: '',
        location: '',
        current_employment: '',
        preferred_locations: '',
        note: ''
      });
      setPhotoFile(null);
      setPhotoPreview('');
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Careers & Jobs | KS Electrical and AC Services</title>
        <meta name="description" content="Join the team at KS Electrical and AC Services. Apply online for HVAC/AC technician, electrician, and RO filter specialist job roles in Gaur City." />
        <link rel="canonical" href="https://www.kselectrical.in/careers" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'Careers' }]} />

      <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-[10px] text-brand-blue bg-blue-50 border border-blue-100 px-3 py-1 rounded-full font-black uppercase tracking-wider select-none">
              We Are Hiring
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-3">
              Join Our Technician Network
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto mt-2">
              Earn competitive payouts, choose flexible schedules, and serve top residential societies in Gaur City, Noida Extension, and Ghaziabad.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Job Listings */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight border-l-4 border-brand-blue pl-3 text-left">
                Active Job Openings
              </h2>

              <div className="space-y-4">
                {roles.map((role, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm hover:shadow transition-all text-left">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h3 className="font-extrabold text-gray-900 text-base flex items-center">
                        <Briefcase size={16} className="text-brand-blue mr-2 shrink-0" />
                        {role.title}
                      </h3>
                      <span className="bg-green-50 border border-green-150 text-green-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                        {role.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-gray-500 mt-1.5">
                      <Star size={12} className="text-yellow-500 shrink-0" fill="currentColor" />
                      <span>{role.experience}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-3 leading-relaxed">
                      {role.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Perks card */}
              <div className="bg-brand-blue-dark text-white rounded-xl p-6 text-left shadow-sm mt-6">
                <h3 className="font-black text-sm uppercase tracking-wider text-blue-300">Why Work With Us?</h3>
                <ul className="mt-4 space-y-2 text-xs font-semibold text-gray-200">
                  <li className="flex items-center">
                    <CheckCircle size={14} className="text-green-400 mr-2 shrink-0" />
                    Same-day direct payouts upon job completion.
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={14} className="text-green-400 mr-2 shrink-0" />
                    Flexible working hours (Full-time or Part-time slots).
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={14} className="text-green-400 mr-2 shrink-0" />
                    Safety equipment and ongoing technical training support.
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={14} className="text-green-400 mr-2 shrink-0" />
                    Direct connection with 1000+ local apartment clients.
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Apply Form */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-md text-left sticky top-24">
                <h2 className="text-lg font-black text-gray-900 tracking-tight mb-2">
                  Apply Online
                </h2>
                <p className="text-gray-500 text-xs mb-6">
                  Fill in your basic credentials to submit your job application to our helpline.
                </p>

                {submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center my-6">
                    <CheckCircle className="text-green-500 mx-auto mb-3" size={32} />
                    <h4 className="text-green-800 font-extrabold text-sm">Application Ready!</h4>
                    <p className="text-green-600 text-xs mt-1">
                      Redirecting you to WhatsApp to submit your details...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* DP / Photo Upload */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">
                        Upload Profile Photo / Selfie (अपनी फोटो अपलोड करें) *
                      </label>
                      <div className="flex items-center space-x-3">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Preview" className="w-14 h-14 rounded-full object-cover border-2 border-brand-blue" />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                            <span className="text-[9px] font-extrabold uppercase">No Photo</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          required
                          onChange={handleFileChange}
                          className="text-xs text-gray-550 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[11px] file:font-black file:bg-blue-50 file:text-brand-blue hover:file:bg-blue-100 cursor-pointer file:cursor-pointer flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1" htmlFor="name">
                        Full Name (पूरा नाम)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                          <User size={14} />
                        </span>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue"
                          placeholder="e.g. Rajesh Kumar"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1" htmlFor="phone">
                        Phone Number (फोन नंबर)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                          <Phone size={14} />
                        </span>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          pattern="[0-9]{10}"
                          maxLength={10}
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue"
                          placeholder="10-digit mobile number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1" htmlFor="role">
                        Select Role (कार्य प्रकार)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                          <Briefcase size={14} />
                        </span>
                        <select
                          id="role"
                          name="role"
                          required
                          value={formData.role}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
                        >
                          <option value="" disabled>Choose a role...</option>
                          <option value="AC Technician / HVAC">AC Technician / HVAC</option>
                          <option value="Residential Electrician">Residential Electrician</option>
                          <option value="RO Purifier Specialist">RO Purifier Specialist</option>
                          <option value="Helper / Assistant Tech">Helper / Assistant Tech</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1" htmlFor="experience">
                        Experience (अनुभव)
                      </label>
                      <input
                        type="number"
                        id="experience"
                        name="experience"
                        required
                        min="0"
                        max="40"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        placeholder="Years of experience (e.g. 3)"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1" htmlFor="location">
                        Current Address / Location (वर्तमान पता)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                          <MapPin size={14} />
                        </span>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          required
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue"
                          placeholder="e.g. Gaur City 1, Greater Noida"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1" htmlFor="current_employment">
                        Current Employment (अभी कहाँ काम करते हैं)
                      </label>
                      <input
                        type="text"
                        id="current_employment"
                        name="current_employment"
                        required
                        value={formData.current_employment}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        placeholder="e.g. Local shop name or Self-employed / N/A"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1" htmlFor="preferred_locations">
                        Preferred Work Locations (आगे कहाँ काम करना चाहते हैं)
                      </label>
                      <input
                        type="text"
                        id="preferred_locations"
                        name="preferred_locations"
                        required
                        value={formData.preferred_locations}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        placeholder="e.g. Gaur City 1, Noida Sector 12, Crossing Republik"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1" htmlFor="note">
                        Short Note (Optional)
                      </label>
                      <textarea
                        id="note"
                        name="note"
                        rows={3}
                        value={formData.note}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        placeholder="Write any additional details..."
                      />
                    </div>

                    {submitError && (
                      <p className="text-[10px] text-red-500 font-extrabold text-center animate-shake">
                        {submitError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-black uppercase py-3 rounded-lg shadow transition-colors cursor-pointer text-center flex items-center justify-center space-x-1.5"
                    >
                      {isSubmitting ? (
                        <span>Submitting Application...</span>
                      ) : (
                        <span>Submit Application & Open WhatsApp</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default CareersPage;
