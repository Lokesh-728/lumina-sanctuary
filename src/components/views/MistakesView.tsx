"use client";

import { useLuminaStore } from "@/store/useLuminaStore";
import { motion } from "framer-motion";
import { Hourglass, Target, BookOpen, Users, Key, Layers, Download } from "lucide-react";

export default function MistakesView() {
  const { showToast, setActiveTab } = useLuminaStore();

  const mistakes = [
    {
      num: "Mistake 01",
      title: "Waiting Instead of Acting",
      icon: Hourglass,
      iconBg: "bg-[#f6f3f2] text-[#424842]",
      why: "Perfectionism disguising itself as preparation. Fear of making the 'wrong' first move.",
      solution: "Implement the 5-minute rule: commit to one small, messy action today rather than a perfect plan tomorrow.",
    },
    {
      num: "Mistake 02",
      title: "Setting Vague Goals",
      icon: Target,
      iconBg: "bg-[#ffdb99]/40 text-[#745b25]",
      why: "Ambiguity feels safer. If you don't define 'success,' you can't technically 'fail.'",
      solution: "Use concrete metrics. Replace 'I want to be happy' with 'I will meditate for 10 minutes every morning.'",
    },
    {
      num: "Mistake 03",
      title: "Information Gluttony",
      icon: BookOpen,
      iconBg: "bg-[#f6f3f2] text-[#424842]",
      why: "Reading about growth feels like growing. It provides a dopamine hit without the effort of practice.",
      solution: "Adopt a 1:1 ratio. For every hour spent consuming content, spend one hour in active practice or application.",
    },
    {
      num: "Mistake 04",
      title: "Relying on External Praise",
      icon: Users,
      iconBg: "bg-[#f6f3f2] text-[#424842]",
      why: "Social conditioning makes us prioritize the 'gallery' over the 'studio.'",
      solution: "Keep a private progress log. Celebrate internal milestones that nobody else will ever see.",
    },
    {
      num: "Mistake 05",
      title: "The 'Mind-Only' Trap",
      icon: Key,
      iconBg: "bg-[#ffdb99]/40 text-[#745b25]",
      why: "Treating personal growth as a purely intellectual exercise while ignoring physical depletion.",
      solution: "Anchor spiritual work in somatic reality. Pair your intentions with breathwork or movement.",
    },
    {
      num: "Mistake 06",
      title: "Intensity Over Consistency",
      icon: Layers,
      iconBg: "bg-[#f6f3f2] text-[#424842]",
      why: "Bursts of inspiration are exciting; the 'boring' middle of daily habit is where the ego resists.",
      solution: "Lower the barrier to entry. It is better to practice for 2 minutes every day than 2 hours once a month.",
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-[#745b25] bg-[#ffdb99]/30">
          SELF-CORRECTION PATH
        </span>

        <h1 className="font-serif-title text-4xl sm:text-5xl font-bold text-[#1b1c1c]">
          Stop Blocking Your Progress
        </h1>

        <p className="text-base text-[#615b51] leading-relaxed">
          Growth is as much about what you remove as what you add. Identify the common mental anchors
          slowing your ascent and learn how to cut the lines.
        </p>
      </div>

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

      {/* DISCIPLINE OF CLARITY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-6">
        <div className="lg:col-span-6 space-y-6">
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1b1c1c]">
            The Discipline of Clarity
          </h2>
          <p className="text-sm text-[#615b51] leading-relaxed">
            At Lumina, we believe that intention without action is merely a dream. By systematically
            removing these obstacles, you create the space for genuine transformation to take root.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "Scientific grounding in habit formation",
              "Compassionate but firm accountability",
              "Sustainable systems over quick fixes",
            ].map((bullet) => (
              <div key={bullet} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#745b25]" />
                <span className="text-xs sm:text-sm font-semibold text-[#1b1c1c]">
                  {bullet}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* IMAGE RIGHT */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#e4e2e1]">
            <img
              src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80"
              alt="The Discipline of Clarity"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
