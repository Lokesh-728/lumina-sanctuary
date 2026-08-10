"use client";

import { useLuminaStore } from "@/store/useLuminaStore";
import { motion } from "framer-motion";
import { Target, Calendar, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function LandingView() {
  const { setActiveTab } = useLuminaStore();

  return (
    <div className="space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-16 text-center max-w-4xl mx-auto px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[#47624d]/10 via-[#DBC49A]/10 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[#47624d] bg-[#5f7b65]/10 border border-[#5f7b65]/20">
            YOUR TRANSFORMATION AWAITS
          </span>

          <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1b1c1c] leading-[1.15]">
            Become the Person Your Future Self Is Waiting For
          </h1>

          <p className="text-base sm:text-lg text-[#424842] max-w-2xl mx-auto leading-relaxed">
            Build daily habits, master proven manifestation techniques, and create
            meaningful progress—one intentional day at a time.
          </p>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={() => setActiveTab("daily")}
              className="bg-[#47624d] hover:bg-[#38503d] text-white text-base font-medium px-8 py-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-98 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47624d]"
            >
              Start Free
            </button>
            <button
              onClick={() => setActiveTab("techniques")}
              className="bg-white hover:bg-[#f6f3f2] text-[#1b1c1c] border border-[#c2c8c0] text-base font-medium px-8 py-3.5 rounded-full transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47624d]"
            >
              Explore Techniques
            </button>
          </div>
        </motion.div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1b1c1c] relative inline-block">
            How It Works
            <span className="block h-1 w-16 bg-[#DBC49A] mx-auto mt-2 rounded-full" />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "Set Your Intention",
              desc: "Define your future with clarity. We bridge spiritual vision with precise goal-setting frameworks.",
              color: "bg-[#e4eadf] text-[#47624d]",
            },
            {
              icon: Calendar,
              title: "Build Daily Habits",
              desc: "Small actions create monumental shifts. Track the rituals that align your energy with your goals.",
              color: "bg-[#ffdb99]/40 text-[#745b25]",
            },
            {
              icon: Sparkles,
              title: "Become Your Future Self",
              desc: "Experience the transformation. Evolve through evidence-based mindset work and daily discipline.",
              color: "bg-[#e4e2e1] text-[#424842]",
            },
          ].map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-ambient shadow-ambient-hover border border-[#f0eded] text-center space-y-4"
            >
              <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center ${card.color}`}>
                <card.icon className="w-7 h-7" />
              </div>
              <h3 className="font-serif-title text-xl font-semibold text-[#1b1c1c]">
                {card.title}
              </h3>
              <p className="text-sm text-[#615b51] leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. SCIENCE + SPIRITUAL BALANCE */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60 group">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                alt="Prism Light and Clarity"
                className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-xs uppercase tracking-widest opacity-80 font-mono">YOUR FUTURE SELF</span>
                <h4 className="font-serif-title text-2xl font-bold mt-1">FIND CLARITY</h4>
                <p className="text-sm opacity-90">Focus your path forward.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1b1c1c]">
              Science + Spiritual Balance
            </h2>

            <blockquote className="text-base italic text-[#47624d] font-serif border-l-2 border-[#DBC49A] pl-4">
              &quot;Manifestation is not magic; it&apos;s the disciplined alignment of your neurobiology with your highest intentions.&quot;
            </blockquote>

            <div className="space-y-5 pt-2">
              {[
                {
                  title: "RAS Activation",
                  desc: "Train your Reticular Activating System to filter for opportunities that match your vision.",
                },
                {
                  title: "Belief Alignment",
                  desc: "Identify and dissolve limiting subconscious patterns through structured introspection.",
                },
                {
                  title: "Neuroplasticity",
                  desc: "Rewire your brain's response to stress and success using cognitive behavioral techniques.",
                },
                {
                  title: "Intentional Action",
                  desc: "The bridge between thought and reality is the work. We provide the structure to execute.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#5f7b65]/15 text-[#47624d] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#1b1c1c]">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-[#615b51] mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. YOUR DAILY PRACTICE */}
      <section className="bg-[#f6f3f2]/60 py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1b1c1c]">
                Your Daily Practice
              </h2>
              <p className="text-base text-[#615b51] leading-relaxed">
                The Lumina dashboard transforms abstract goals into a tangible checklist for the soul.
              </p>
              <button
                onClick={() => setActiveTab("daily")}
                className="pt-2 text-sm font-semibold text-[#47624d] hover:text-[#38503d] inline-flex items-center gap-2 group"
              >
                Go to Daily Tracker <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white p-8 rounded-3xl shadow-ambient border border-[#e4e2e1] space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-title text-xl font-bold text-[#1b1c1c]">
                    Today&apos;s Alignment
                  </h3>
                  <span className="text-xs font-semibold text-[#737972] bg-[#f6f3f2] px-3 py-1 rounded-full">
                    75% Complete
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Morning Meditation (10 min)", checked: true },
                    { label: "Gratitude Journaling", checked: false },
                    { label: "Future-Self Visualization", checked: true },
                  ].map((task, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[#f0eded] bg-[#fcf9f8]"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                          task.checked
                            ? "bg-[#47624d] border-[#47624d] text-white"
                            : "border-[#c2c8c0] bg-white"
                        }`}
                      >
                        {task.checked && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <span
                        className={`text-sm ${
                          task.checked
                            ? "line-through text-[#737972]"
                            : "text-[#1b1c1c] font-medium"
                        }`}
                      >
                        {task.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="h-2 w-full bg-[#eae7e7] rounded-full overflow-hidden">
                    <div className="h-full bg-[#47624d] rounded-full w-[75%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROVEN TECHNIQUES */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 space-y-2">
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1b1c1c]">
            Proven Techniques
          </h2>
          <p className="text-sm sm:text-base text-[#615b51]">
            Master the tools that bridge intention and reality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              phase: "PHASE 01",
              title: "Visualization",
              img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
            },
            {
              phase: "PHASE 02",
              title: "Scripting",
              img: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80",
            },
            {
              phase: "PHASE 03",
              title: "Future Self",
              img: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
            },
            {
              phase: "PHASE 04",
              title: "Deep Work",
              img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80",
            },
          ].map((item) => (
            <div
              key={item.title}
              onClick={() => setActiveTab("techniques")}
              className="group cursor-pointer relative rounded-3xl overflow-hidden h-72 shadow-ambient shadow-ambient-hover"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] font-mono tracking-widest text-[#ffdb99] opacity-90 uppercase">
                  {item.phase}
                </span>
                <h3 className="font-serif-title text-2xl font-bold text-white group-hover:text-[#ffdb99] transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
