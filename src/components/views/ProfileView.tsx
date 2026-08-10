"use client";

import { useLuminaStore } from "@/store/useLuminaStore";
import { motion } from "framer-motion";
import { Sparkles, Check, ArrowRight, Trash2, User } from "lucide-react";

export default function ProfileView() {
  const {
    futureSelfProfile,
    updateFutureSelfProfile,
    profileStep,
    setProfileStep,
    showToast,
    user,
    openAuthModal,
  } = useLuminaStore();

  const handleNextStep = () => {
    if (profileStep < 3) {
      setProfileStep(profileStep + 1);
    } else {
      showToast("Future Self blueprint locked in.");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[#745b25] bg-[#ffdb99]/30 border border-[#745b25]/20">
          IDENTITY ARCHITECTURE
        </span>

        <h1 className="font-serif-title text-4xl sm:text-5xl font-bold text-[#1b1c1c]">
          Meet Your Future Self
        </h1>

        <p className="text-base text-[#615b51] leading-relaxed">
          Define the exact environment, habits, and emotional state of the person you are evolving into.
          Clear definition precedes reality.
        </p>

        {/* STEPPER PILLS */}
        <div className="flex justify-center items-center gap-3 pt-4">
          {[
            { step: 1, label: "Environment" },
            { step: 2, label: "Routine" },
            { step: 3, label: "Abundance" },
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setProfileStep(s.step)}
              className={`px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                profileStep === s.step
                  ? "bg-[#47624d] text-white shadow-sm"
                  : profileStep > s.step
                  ? "bg-[#e4eadf] text-[#47624d]"
                  : "bg-white text-[#737972] border border-[#e4e2e1]"
              }`}
            >
              <span>{s.step}. {s.label}</span>
              {profileStep > s.step && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT 7 COLS: WIZARD INPUT FORM */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-ambient border border-[#e4e2e1] space-y-6">
          {profileStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
                Stage 1: Primary Environment
              </h3>
              <p className="text-xs sm:text-sm text-[#615b51]">
                Where does your Future Self wake up every morning? Describe the physical location and spatial atmosphere.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] uppercase tracking-wider mb-1">
                  Primary Location / Home Base
                </label>
                <input
                  type="text"
                  value={futureSelfProfile.primaryLocation}
                  onChange={(e) => updateFutureSelfProfile({ primaryLocation: e.target.value })}
                  className="w-full bg-[#f6f3f2] focus:bg-white text-sm text-[#1b1c1c] p-3.5 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] uppercase tracking-wider mb-1">
                  Atmosphere & Vibes
                </label>
                <textarea
                  rows={4}
                  value={futureSelfProfile.atmosphereVibes}
                  onChange={(e) => updateFutureSelfProfile({ atmosphereVibes: e.target.value })}
                  className="w-full bg-[#f6f3f2] focus:bg-white text-sm text-[#1b1c1c] p-4 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none transition-all resize-none"
                />
              </div>
            </div>
          )}

          {profileStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
                Stage 2: Morning Discipline
              </h3>
              <p className="text-xs sm:text-sm text-[#615b51]">
                What non-negotiable morning rituals sustain your energy and focus?
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] uppercase tracking-wider mb-1">
                  Morning Rituals & Routine
                </label>
                <textarea
                  rows={4}
                  value={futureSelfProfile.morningDiscipline}
                  onChange={(e) => updateFutureSelfProfile({ morningDiscipline: e.target.value })}
                  className="w-full bg-[#f6f3f2] focus:bg-white text-sm text-[#1b1c1c] p-4 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none transition-all resize-none"
                />
              </div>
            </div>
          )}

          {profileStep === 3 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
                Stage 3: Abundance & Mindset
              </h3>
              <p className="text-xs sm:text-sm text-[#615b51]">
                Set your financial consciousness target and defining life motto.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] uppercase tracking-wider mb-1">
                  Wealth Consciousness Target
                </label>
                <input
                  type="text"
                  value={futureSelfProfile.wealthConsciousness}
                  onChange={(e) => updateFutureSelfProfile({ wealthConsciousness: e.target.value })}
                  className="w-full bg-[#f6f3f2] focus:bg-white text-sm text-[#1b1c1c] p-3.5 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] uppercase tracking-wider mb-1">
                  Core Life Quote / Motto
                </label>
                <input
                  type="text"
                  value={futureSelfProfile.quote}
                  onChange={(e) => updateFutureSelfProfile({ quote: e.target.value })}
                  className="w-full bg-[#f6f3f2] focus:bg-white text-sm text-[#1b1c1c] p-3.5 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-between items-center border-t border-[#f0eded]">
            {profileStep > 1 ? (
              <button
                onClick={() => setProfileStep(profileStep - 1)}
                className="text-xs font-semibold text-[#737972] hover:text-[#1b1c1c] px-4 py-2"
              >
                Previous Step
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNextStep}
              className="bg-[#47624d] hover:bg-[#38503d] text-white text-xs font-semibold px-6 py-3 rounded-2xl transition-all shadow flex items-center gap-2"
            >
              <span>{profileStep === 3 ? "Lock Blueprint" : "Next Stage"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT 5 COLS: LIVE FUTURE SELF AVATAR CARD & ACCOUNT ACTIONS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#47624d] text-white p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <span className="text-[10px] font-mono tracking-widest text-[#ffdb99] uppercase font-bold">
                FUTURE SELF BLUEPRINT
              </span>
              <span className="text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                EST. 2027
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="Future Self Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#ffdb99] shadow-md"
              />
              <div>
                <h4 className="font-serif-title text-xl font-bold">
                  {user ? `${user.firstName || ''} ${user.lastName || ''}` : 'Seeker'}
                </h4>
                <p className="text-xs text-gray-200">{futureSelfProfile.primaryLocation}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-gray-100 pt-2 border-t border-white/10">
              <div>
                <span className="text-[10px] font-mono text-[#ffdb99] uppercase block">
                  SANCTUARY ATMOSPHERE
                </span>
                <p className="italic leading-relaxed">{futureSelfProfile.atmosphereVibes}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#ffdb99] uppercase block">
                  DAWN RITUAL
                </span>
                <p>{futureSelfProfile.morningDiscipline}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#ffdb99] uppercase block">
                  WEALTH CONSCIOUSNESS
                </span>
                <p className="font-semibold text-white">{futureSelfProfile.wealthConsciousness}</p>
              </div>
            </div>

            <blockquote className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl border-l-2 border-[#ffdb99] text-xs italic text-gray-200">
              &quot;{futureSelfProfile.quote}&quot;
            </blockquote>
          </div>

          {/* Account Settings & Delete Account Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#e4e2e1] shadow-ambient space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-[#745b25] uppercase font-bold">
              ACCOUNT MANAGEMENT
            </span>

            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#615b51] bg-[#f9f8f5] p-3 rounded-2xl border border-[#e4e2e1]">
                  <span>Signed in as:</span>
                  <span className="font-semibold text-[#1b1c1c]">{user.email}</span>
                </div>
                <button
                  onClick={() => openAuthModal("login")}
                  className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-2xl border border-red-200 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete My User Account</span>
                </button>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-xs text-[#615b51]">
                  Sign up instantly to sync your future self profile with your MongoDB database.
                </p>
                <button
                  onClick={() => openAuthModal("register")}
                  className="w-full py-2.5 px-4 bg-[#47624d] hover:bg-[#38503d] text-white text-xs font-semibold rounded-2xl transition-all shadow-sm"
                >
                  Register Instantly
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
