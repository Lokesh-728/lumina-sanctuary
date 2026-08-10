"use client";

import { useState } from "react";
import { useLuminaStore } from "@/store/useLuminaStore";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, CheckCircle2, X, Play, BookOpen } from "lucide-react";

interface TechniqueItem {
  id: string;
  title: string;
  duration: string;
  category: "Psychology" | "Spiritual" | "Daily Habits";
  description: string;
  bullets: string[];
  cta: string;
  img: string;
  fullGuide?: string;
}

const techniquesList: TechniqueItem[] = [
  {
    id: "t1",
    title: "Visualization",
    duration: "15 Min",
    category: "Psychology",
    description:
      "Mentally rehearse your desired outcome using all five senses to rewire neural pathways for success.",
    bullets: ["Enhanced Neuroplasticity", "Anxiety Reduction"],
    cta: "Start Practice",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
    fullGuide: "Sit comfortably in a quiet room. Close your eyes and breathe deeply for 2 minutes. Step into a vivid 3D scene where your goal is already achieved. Engage sight, sound, touch, and emotion for 10 minutes.",
  },
  {
    id: "t2",
    title: "Scripting",
    duration: "20 Min",
    category: "Spiritual",
    description:
      "Write your future life story in the present tense to anchor your goals in a felt physical reality.",
    bullets: ["Cognitive Reframing", "Clarity of Intent"],
    cta: "Open Journal",
    img: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80",
    fullGuide: "Open a fresh journal page. Write today's date 1 year in the future. Describe your ideal morning, work, feelings, and accomplishments as if they have already occurred today.",
  },
  {
    id: "t3",
    title: "Future Self",
    duration: "10 Min",
    category: "Psychology",
    description:
      "Connect with your future self to receive wisdom and guidance for your current daily decisions.",
    bullets: ["Identity Shift", "Decision Integrity"],
    cta: "Meet Your Self",
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
    fullGuide: "Imagine walking down a quiet forest path to meet yourself 5 years from now. Ask them: 'What is the one decision I need to make today to step into my highest potential?'",
  },
  {
    id: "t4",
    title: "WOOP",
    duration: "12 Min",
    category: "Psychology",
    description:
      "A science-based approach to goal setting: Wish, Outcome, Obstacle, and Plan.",
    bullets: ["Practical Action", "Obstacle Neutralization"],
    cta: "Map Goals",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    fullGuide: "1. Wish: Define a meaningful goal. 2. Outcome: Imagine the best result. 3. Obstacle: Identify your primary internal hurdle. 4. Plan: If obstacle occurs, then I will take action X.",
  },
  {
    id: "t5",
    title: "Affirmations",
    duration: "5 Min",
    category: "Daily Habits",
    description:
      "Structured positive statements to challenge and overcome self-sabotaging thoughts.",
    bullets: ["Confidence Building", "Belief Restructuring"],
    cta: "Begin Recitation",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    fullGuide: "Stand tall in front of a mirror or close your eyes. Speak 3 core identity statements out loud with conviction: 'I am disciplined. I am capable. I build my reality daily.'",
  },
  {
    id: "t6",
    title: "Identity Journal",
    duration: "15 Min",
    category: "Daily Habits",
    description:
      "Align your daily actions with the person you are becoming through deep self-inquiry.",
    bullets: ["Values Alignment", "Consistent Growth"],
    cta: "Journal Now",
    img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
    fullGuide: "Answer these 3 prompts: 1. Who did I embody today? 2. Where did I act out of fear instead of trust? 3. What is one habit I align with tomorrow?",
  },
  {
    id: "t7",
    title: "Vision Board",
    duration: "30 Min",
    category: "Spiritual",
    description:
      "Create a curated visual representation of your goals to maintain subconscious focus.",
    bullets: ["Visual Priming", "Emotional Connection"],
    cta: "Design Board",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    fullGuide: "Curate imagery representing your health, sanctuary home, career, and inner peace. Review your vision board every morning to prime your Reticular Activating System.",
  },
  {
    id: "t8",
    title: "Gratitude Flow",
    duration: "5 Min",
    category: "Daily Habits",
    description:
      "A high-intensity verbal practice to shift your vibrational state from lack to abundance instantly.",
    bullets: ["Mood Elevation", "Instant Resets"],
    cta: "Shift State",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    fullGuide: "For 3 minutes uninterrupted, speak out loud everything you appreciate in your immediate environment—from clean air to warm tea to supportive friends.",
  },
  {
    id: "t9",
    title: "Somatic Anchoring",
    duration: "10 Min",
    category: "Psychology",
    description:
      "Couple desired mental states with physical touch triggers to access them on command.",
    bullets: ["Conditioned Response", "Focus Stability"],
    cta: "Set Anchor",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
    fullGuide: "Bring yourself to a peak state of gratitude or deep focus. At the moment of peak intensity, gently press your thumb and forefinger together. Repeat 10 times.",
  },
  {
    id: "t10",
    title: "Shadow Work",
    duration: "45 Min",
    category: "Spiritual",
    description:
      "Identify and integrate unconscious blocks that prevent your manifestation from materializing.",
    bullets: ["Block Integration", "Radical Honesty"],
    cta: "Deep Inquiry",
    img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80",
    fullGuide: "Examine what triggers envy or resentment in you. Ask: 'What disowned part of myself is this trigger illuminating?' Write without self-judgment.",
  },
];

export default function TechniquesView() {
  const { setActiveTab } = useLuminaStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All Practices");
  const [activeModalTechnique, setActiveModalTechnique] = useState<TechniqueItem | null>(null);

  const filteredTechniques = techniquesList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedFilter === "All Practices" || item.category === selectedFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCtaClick = (tech: TechniqueItem) => {
    if (tech.title === "Scripting" || tech.title === "Identity Journal") {
      setActiveTab("journal");
    } else if (tech.title === "Vision Board") {
      setActiveTab("vision");
    } else if (tech.title === "Future Self") {
      setActiveTab("profile");
    } else if (tech.title === "Affirmations") {
      setActiveTab("affirmations");
    } else {
      setActiveModalTechnique(tech);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="font-serif-title text-4xl sm:text-5xl font-bold text-[#1b1c1c]">
          Techniques Library
        </h1>
        <p className="text-base text-[#615b51] leading-relaxed">
          Master the art of intentional creation through our curated collection of psychological and
          spiritual manifestation protocols.
        </p>

        {/* SEARCH & FILTERS */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737972]" />
            <input
              type="text"
              placeholder="Search techniques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f6f3f2] focus:bg-white text-sm text-[#1b1c1c] pl-10 pr-4 py-2.5 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {["All Practices", "Psychology", "Spiritual", "Daily Habits"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedFilter === filter
                    ? "bg-[#47624d] text-white shadow-sm"
                    : "bg-white text-[#424842] border border-[#e4e2e1] hover:bg-[#f6f3f2]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTechniques.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-ambient border border-[#e4e2e1] overflow-hidden flex flex-col justify-between shadow-ambient-hover"
          >
            <div>
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#ffdb99]" />
                  <span>{item.duration}</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#615b51] leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-[#f0eded]">
                  {item.bullets.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-xs text-[#424842]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#47624d]" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => handleCtaClick(item)}
                className="w-full bg-white hover:bg-[#f6f3f2] text-[#1b1c1c] border border-[#c2c8c0] hover:border-[#47624d] text-xs font-semibold py-3 rounded-2xl transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47624d]"
              >
                {item.cta}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* TECHNIQUE MODAL */}
      <AnimatePresence>
        {activeModalTechnique && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#e4e2e1] relative"
            >
              <button
                onClick={() => setActiveModalTechnique(null)}
                className="absolute top-4 right-4 p-2 text-[#737972] hover:text-[#1b1c1c] rounded-full hover:bg-[#f6f3f2]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#e4eadf] rounded-2xl text-[#47624d]">
                  <Play className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#745b25] font-semibold">
                    {activeModalTechnique.category} • {activeModalTechnique.duration}
                  </span>
                  <h3 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
                    {activeModalTechnique.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-[#424842] leading-relaxed">
                  {activeModalTechnique.description}
                </p>

                <div className="bg-[#f6f3f2] p-5 rounded-2xl border-l-4 border-[#47624d] space-y-2">
                  <h4 className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#47624d]" /> Step-by-Step Protocol
                  </h4>
                  <p className="text-xs text-[#615b51] leading-relaxed">
                    {activeModalTechnique.fullGuide}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setActiveModalTechnique(null)}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#47624d] text-white hover:bg-[#38503d] transition-colors"
                >
                  Complete Practice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
