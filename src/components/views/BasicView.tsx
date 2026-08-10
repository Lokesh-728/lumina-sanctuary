"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  ChevronDown,
  Sparkles,
  Brain,
  Compass,
  ArrowRight,
  Hourglass,
  Target,
  BookOpen,
  Users,
  Key,
  Layers,
  Download,
  BookMarked,
  ShieldAlert,
} from "lucide-react";
import { useLuminaStore } from "@/store/useLuminaStore";

export default function BasicView() {
  const { showToast, setActiveTab } = useLuminaStore();
  const [activeSubTab, setActiveSubTab] = useState<"principles" | "correction">(
    "principles"
  );
  const [activeCategory, setActiveCategory] = useState<
    "Science" | "Mindset" | "Spirituality"
  >("Science");
  const [expandedAccordion, setExpandedAccordion] = useState<number | null>(0);

  const mistakes = [
    {
      num: "Mistake 01",
      title: "Waiting Instead of Acting",
      icon: Hourglass,
      iconBg: "bg-[#f6f3f2] text-[#424842]",
      why: "Perfectionism disguising itself as preparation. Fear of making the 'wrong' first move.",
      solution:
        "Implement the 5-minute rule: commit to one small, messy action today rather than a perfect plan tomorrow.",
    },
    {
      num: "Mistake 02",
      title: "Setting Vague Goals",
      icon: Target,
      iconBg: "bg-[#ffdb99]/40 text-[#745b25]",
      why: "Ambiguity feels safer. If you don't define 'success,' you can't technically 'fail.'",
      solution:
        "Use concrete metrics. Replace 'I want to be happy' with 'I will meditate for 10 minutes every morning.'",
    },
    {
      num: "Mistake 03",
      title: "Information Gluttony",
      icon: BookOpen,
      iconBg: "bg-[#f6f3f2] text-[#424842]",
      why: "Reading about growth feels like growing. It provides a dopamine hit without the effort of practice.",
      solution:
        "Adopt a 1:1 ratio. For every hour spent consuming content, spend one hour in active practice or application.",
    },
    {
      num: "Mistake 04",
      title: "Relying on External Praise",
      icon: Users,
      iconBg: "bg-[#f6f3f2] text-[#424842]",
      why: "Social conditioning makes us prioritize the 'gallery' over the 'studio.'",
      solution:
        "Keep a private progress log. Celebrate internal milestones that nobody else will ever see.",
    },
    {
      num: "Mistake 05",
      title: "The 'Mind-Only' Trap",
      icon: Key,
      iconBg: "bg-[#ffdb99]/40 text-[#745b25]",
      why: "Treating personal growth as a purely intellectual exercise while ignoring physical depletion.",
      solution:
        "Anchor spiritual work in somatic reality. Pair your intentions with breathwork or movement.",
    },
    {
      num: "Mistake 06",
      title: "Intensity Over Consistency",
      icon: Layers,
      iconBg: "bg-[#f6f3f2] text-[#424842]",
      why: "Bursts of inspiration are exciting; the 'boring' middle of daily habit is where the ego resists.",
      solution:
        "Lower the barrier to entry. It is better to practice for 2 minutes every day than 2 hours once a month.",
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* 1. TOP HERO & NAVIGATION SUBTAB */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-[#47624d] bg-[#eae7e7]">
          Foundational Mastery
        </span>

        <h1 className="font-serif-title text-4xl sm:text-5xl font-bold text-[#1b1c1c]">
          Basic Principles & Self-Correction
        </h1>

        <p className="text-base text-[#615b51] leading-relaxed">
          Master the neuroscience of intention and systematically eliminate the mental blockers stopping your progress.
        </p>

        {/* Sub-tab Navigation */}
        <div className="flex justify-center items-center gap-3 pt-4">
          <button
            onClick={() => setActiveSubTab("principles")}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeSubTab === "principles"
                ? "bg-[#47624d] text-white shadow-md"
                : "bg-white text-[#424842] border border-[#e4e2e1] hover:bg-[#f6f3f2]"
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>Core Principles & Science</span>
          </button>

          <button
            onClick={() => setActiveSubTab("correction")}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeSubTab === "correction"
                ? "bg-[#745b25] text-white shadow-md"
                : "bg-white text-[#424842] border border-[#e4e2e1] hover:bg-[#f6f3f2]"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Self-Correction & Obstacles</span>
          </button>
        </div>
      </div>

      {/* 2. SUBTAB CONTENT */}
      {activeSubTab === "principles" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-16"
        >
          {/* Category Filter Pills */}
          <div className="flex justify-center items-center gap-3">
            {(["Science", "Mindset", "Spirituality"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[#1b1c1c] text-white"
                    : "bg-[#f6f3f2] text-[#615b51] hover:text-[#1b1c1c]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* HERO FEATURE CARD */}
          <section className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60">
            <div className="relative h-[380px] sm:h-[440px] w-full">
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80"
                alt="The Science of Observation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent flex flex-col justify-center p-8 sm:p-12 text-white max-w-2xl space-y-4">
                <h2 className="font-serif-title text-3xl sm:text-4xl font-bold leading-tight">
                  The Science of Observation
                </h2>
                <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                  Modern physics and psychology converge at the point of focused attention.
                  Understanding how your brain filters information is the first step in directing your future.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                    <Brain className="w-3.5 h-3.5 text-[#ffdb99]" /> Neural Paths
                  </span>
                  <span className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#ffdb99]" /> Cognitive Flow
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* RAS & NEUROPLASTICITY */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-ambient border border-[#f0eded] space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#f6f3f2] text-[#47624d]">
                    <Filter className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#745b25] bg-[#ffdb99]/30 px-3 py-1 rounded-full">
                    Biological Filter
                  </span>
                </div>

                <h3 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
                  The Reticular Activating System (RAS)
                </h3>

                <p className="text-sm text-[#615b51] leading-relaxed">
                  Think of the RAS as your brain&apos;s personal gatekeeper. It filters out the millions
                  of data points you receive every second, only letting in what it deems &quot;important.&quot;
                </p>

                <blockquote className="bg-[#f6f3f2] p-5 rounded-2xl border-l-4 border-[#745b25] italic text-sm text-[#424842]">
                  &quot;When you focus on a goal, you &apos;program&apos; your RAS to spot opportunities that were always there, but previously invisible to you.&quot;
                </blockquote>
              </div>

              <div className="rounded-2xl overflow-hidden border border-[#eae7e7] pt-2">
                <img
                  src="https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80"
                  alt="RAS Diagram & Spectrum"
                  className="w-full h-36 object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              <div className="bg-[#47624d] text-white p-8 rounded-3xl shadow-lg space-y-4 relative overflow-hidden flex-1">
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
                  <Brain className="w-48 h-48" />
                </div>

                <h3 className="font-serif-title text-2xl font-bold">Neuroplasticity</h3>

                <p className="text-sm text-gray-100 leading-relaxed">
                  Your brain is not fixed. Through repetitive visualization and thought-pattern shifts,
                  you physically rewire your neural architecture.
                </p>

                <ul className="space-y-2 text-xs sm:text-sm text-[#f6fff4] pt-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ffdb99]" />
                    <span>Synaptic Pruning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ffdb99]" />
                    <span>Myelination</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ffdb99]" />
                    <span>Cortical Remapping</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#eae7e7] shadow-ambient space-y-3">
                <span className="text-[10px] font-mono tracking-widest text-[#745b25] uppercase font-bold">
                  CORE MECHANICS
                </span>
                <h4 className="font-serif-title text-xl font-bold text-[#1b1c1c]">
                  Thought &rarr; Emotion &rarr; Action
                </h4>

                <div className="flex items-center justify-between pt-2 px-2">
                  {[
                    { num: "1", label: "Thought" },
                    { num: "2", label: "Emotion" },
                    { num: "3", label: "Action" },
                  ].map((step, idx) => (
                    <div key={step.num} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border border-[#47624d] flex items-center justify-center text-xs font-semibold text-[#47624d]">
                        {step.num}
                      </div>
                      {idx < 2 && <div className="w-8 sm:w-12 h-[1px] bg-[#c2c8c0]" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* DECONSTRUCTING BELIEFS */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-serif-title text-3xl font-bold text-[#1b1c1c]">
                Deconstructing Beliefs
              </h2>
              <p className="text-sm text-[#615b51] leading-relaxed">
                Most of our reality is filtered through subconscious &quot;scripts&quot; written in childhood.
                To manifest, one must first audit these invisible foundations.
              </p>

              <div className="space-y-4">
                {[
                  {
                    id: 0,
                    title: "IDENTIFYING LIMITING BELIEFS",
                    content:
                      "Track feelings of contraction or anxiety when setting ambitious goals. Note the internal dialog—often rooted in fear of failure or unworthiness.",
                  },
                  {
                    id: 1,
                    title: "REPLACING WITH EMPOWERED SCRIPTS",
                    content:
                      "Construct precise counter-affirmations grounded in evidence. Repeat during alpha brainwave states (upon waking and before sleep) for rapid integration.",
                  },
                ].map((acc) => {
                  const isOpen = expandedAccordion === acc.id;
                  return (
                    <div key={acc.id} className="bg-white rounded-2xl border border-[#e4e2e1] overflow-hidden">
                      <button
                        onClick={() => setExpandedAccordion(isOpen ? null : acc.id)}
                        className="w-full text-left p-5 font-semibold text-xs tracking-wider text-[#1b1c1c] flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47624d]"
                      >
                        <span>{acc.title}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#737972] transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-5 pb-5 text-xs sm:text-sm text-[#615b51] leading-relaxed border-t border-[#f0eded]"
                          >
                            {acc.content}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-6 bg-white p-12 rounded-3xl border border-[#e4e2e1] shadow-ambient text-center flex flex-col items-center justify-center min-h-[320px] space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#f6f3f2] flex items-center justify-center text-[#47624d] mb-2">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="font-serif-title text-3xl font-bold text-[#1b1c1c]">Re-Pattern</h3>
              <span className="text-xs tracking-widest text-[#737972] font-mono uppercase">
                THE SUBCONSCIOUS MIND
              </span>
            </div>
          </section>
        </motion.div>
      ) : (
        /* SELF-CORRECTION SUBTAB */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-16"
        >
          {/* 6 MISTAKE CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mistakes.map((m, idx) => (
              <motion.div
                key={m.num}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white p-8 rounded-3xl shadow-ambient border border-[#e4e2e1] space-y-6 flex flex-col justify-between shadow-ambient-hover"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${m.iconBg}`}>
                      <m.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-[#a85e50] tracking-wider">
                      {m.num}
                    </span>
                  </div>

                  <h3 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
                    {m.title}
                  </h3>

                  <div className="bg-[#f6f3f2] p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-[#745b25] uppercase font-bold">
                      Why It Happens
                    </span>
                    <p className="text-xs text-[#615b51] leading-relaxed">{m.why}</p>
                  </div>

                  <div className="bg-[#f6f3f2] p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-[#47624d] uppercase font-bold">
                      The Solution
                    </span>
                    <p className="text-xs italic text-[#1b1c1c] leading-relaxed">
                      &quot;{m.solution}&quot;
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* BANNER CTA CARD */}
          <div className="bg-[#47624d] text-white p-8 sm:p-12 rounded-3xl shadow-xl text-center space-y-6 max-w-4xl mx-auto">
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold">Ready to clear the path?</h2>
            <p className="text-sm sm:text-base text-gray-100 max-w-xl mx-auto leading-relaxed">
              Download our &quot;Anchor Release&quot; workbook to deep-dive into your personal blockers and
              create a customized action plan.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={() => showToast("Workbook downloaded to your device.")}
                className="bg-white hover:bg-[#f6f3f2] text-[#1b1c1c] text-xs sm:text-sm font-semibold px-8 py-3.5 rounded-full transition-all shadow flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-[#47624d]" /> Download Workbook
              </button>
              <button
                onClick={() => setActiveTab("daily")}
                className="bg-transparent hover:bg-white/10 text-white border border-white/40 text-xs sm:text-sm font-semibold px-8 py-3.5 rounded-full transition-all"
              >
                Join Workshop
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
