"use client";

import { useState } from "react";
import { useLuminaStore } from "@/store/useLuminaStore";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Image as ImageIcon, Sparkles, Plus, Calendar as CalendarIcon, Trash2, AlertTriangle, Lock } from "lucide-react";
import confetti from "canvas-confetti";
import { apiService } from "@/services/api";

const PROMPTS = [
  "What made you smile today?",
  "What is one unexpected win you experienced recently?",
  "If fear were not a factor, what step would you take tomorrow?",
  "Describe a moment today when you felt fully present in your body.",
  "What boundary did you honor today that protected your energy?",
];

export default function JournalView() {
  const { gratitudeEntries, addGratitudeEntry, deleteGratitudeEntry, showToast, user, accessToken, openAuthModal } = useLuminaStore();
  const [promptIdx, setPromptIdx] = useState(0);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [mood, setMood] = useState("Calm 😊");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const cyclePrompt = () => {
    setPromptIdx((prev) => (prev + 1) % PROMPTS.length);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const parsedTags = tagsInput
      ? tagsInput.split(",").map((t) => t.trim())
      : ["Gratitude", "Presence"];

    if (accessToken) {
      try {
        const saved = await apiService.createJournalEntry(accessToken, {
          title,
          content,
          tags: parsedTags,
          mood,
        });

        addGratitudeEntry({
          id: saved.id,
          date: new Date(saved.createdAt || saved.entryDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          title: saved.title,
          content: saved.content,
          tags: saved.tags || parsedTags,
          mood: saved.mood || mood,
        });
      } catch (err) {
        addGratitudeEntry({
          date: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          title,
          content,
          tags: parsedTags,
          mood,
        });
      }
    } else {
      addGratitudeEntry({
        date: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        title,
        content,
        tags: parsedTags,
        mood,
      });
    }

    setTitle("");
    setContent("");
    setTagsInput("");
    showToast("Reflection anchored in your journal.");

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#745b25", "#47624d", "#DBC49A"],
    });
  };

  const handleDeleteEntry = async (id: string) => {
    if (accessToken) {
      try {
        await apiService.deleteJournalEntry(accessToken, id);
      } catch (err) {
        console.error("Failed to delete journal entry from API:", err);
      }
    }
    deleteGratitudeEntry(id);
    setDeletingId(null);
    showToast("Reflection permanently removed.");
  };

  if (!user) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-[#5f7b65]/10 text-[#47624d] rounded-full flex items-center justify-between mx-auto p-4 border border-[#47624d]/20">
          <Lock className="w-8 h-8 mx-auto" />
        </div>
        <h2 className="font-serif-title text-3xl font-bold text-[#1b1c1c]">
          Private Gratitude Sanctuary
        </h2>
        <p className="text-[#615b51] max-w-md mx-auto text-sm leading-relaxed">
          Your journal reflections are strictly encrypted and isolated to your account. Please sign in to access your sanctuary.
        </p>
        <button
          onClick={() => openAuthModal("login")}
          className="bg-[#47624d] hover:bg-[#38503d] text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg transition-all"
        >
          Sign In to Access Journal
        </button>
      </div>
    );
  }

  // Calculate dynamic heatmap dates for current month (last 28 days)
  const now = new Date();
  const daysGrid = Array.from({ length: 28 }).map((_, idx) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (27 - idx));
    const dateStr = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const hasEntry = gratitudeEntries.some((e) => {
      return e.date === dateStr || new Date(e.date).toDateString() === d.toDateString();
    });
    return { date: dateStr, dayNum: d.getDate(), hasEntry };
  });

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="font-serif-title text-4xl sm:text-5xl font-bold text-[#1b1c1c]">
          Gratitude Sanctuary
        </h1>
        <p className="text-base text-[#615b51] leading-relaxed">
          Record your daily reflections, anchor positive emotions, and track your internal transformation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: JOURNAL ENTRY FORM */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-ambient border border-[#e4e2e1] space-y-6">
          <div className="flex items-center justify-between border-b border-[#f0eded] pb-4">
            <h2 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
              New Reflection
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#737972]">
              <CalendarIcon className="w-4 h-4 text-[#745b25]" />
              <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            </div>
          </div>

          {/* PROMPT SUGGESTION */}
          <div className="bg-[#f6f3f2] p-4 rounded-2xl flex items-center justify-between gap-3 border border-[#eae7e7]">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-[#745b25] uppercase font-bold">
                PROMPT INSPIRATION
              </span>
              <p className="text-xs sm:text-sm font-medium text-[#1b1c1c] italic">
                &quot;{PROMPTS[promptIdx]}&quot;
              </p>
            </div>
            <button
              onClick={cyclePrompt}
              className="p-2 rounded-xl text-[#737972] hover:text-[#1b1c1c] hover:bg-white transition-colors"
              title="Next Prompt"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1b1c1c] uppercase tracking-wider mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="Give your reflection a name..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-[#f6f3f2] focus:bg-white text-sm text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1b1c1c] uppercase tracking-wider mb-1">
                Reflection
              </label>
              <textarea
                rows={5}
                placeholder="Write freely. What are you grateful for today?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full bg-[#f6f3f2] focus:bg-white text-sm text-[#1b1c1c] p-4 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] uppercase tracking-wider mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Nature, Peace, Victory"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-[#f6f3f2] focus:bg-white text-sm text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] uppercase tracking-wider mb-1">
                  Current State
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full bg-[#f6f3f2] focus:bg-white text-sm text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none transition-all"
                >
                  <option>Calm 😊</option>
                  <option>Inspired ⚡</option>
                  <option>Peaceful 🕊️</option>
                  <option>Focused 🎯</option>
                  <option>Joyful ✨</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => showToast("Photo attachment dialog open.")}
                className="text-xs text-[#737972] hover:text-[#1b1c1c] flex items-center gap-1.5 p-2 rounded-xl hover:bg-[#f6f3f2]"
              >
                <ImageIcon className="w-4 h-4 text-[#745b25]" /> Attach Memory Image
              </button>

              <button
                type="submit"
                className="bg-[#47624d] hover:bg-[#38503d] text-white text-sm font-semibold px-6 py-3 rounded-2xl transition-all shadow flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47624d]"
              >
                <Plus className="w-4 h-4" /> Anchor Entry
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: TIMELINE FEED & HEATMAP */}
        <div className="lg:col-span-5 space-y-6">
          {/* PAST REFLECTIONS FEED */}
          <div className="space-y-4">
            <h3 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
              Past Reflections
            </h3>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {gratitudeEntries.length === 0 ? (
                <div className="bg-[#f6f3f2] p-8 rounded-3xl text-center text-xs text-[#737972]">
                  No past reflections anchored yet. Write your first entry above!
                </div>
              ) : (
                gratitudeEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-3xl shadow-ambient border border-[#e4e2e1] space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between text-xs text-[#737972]">
                      <span>{entry.date}</span>
                      <div className="flex items-center gap-2">
                        {entry.mood && (
                          <span className="bg-[#f6f3f2] px-2.5 py-0.5 rounded-full font-medium text-[#1b1c1c]">
                            {entry.mood}
                          </span>
                        )}
                        <button
                          onClick={() => setDeletingId(entry.id)}
                          className="p-1 text-[#737972] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Reflection"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-serif-title text-xl font-bold text-[#1b1c1c]">
                      {entry.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#615b51] leading-relaxed">
                      {entry.content}
                    </p>

                    {entry.imageUrl && (
                      <div className="rounded-2xl overflow-hidden h-32 border border-[#f0eded]">
                        <img
                          src={entry.imageUrl}
                          alt={entry.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1">
                      {entry.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] uppercase tracking-wider font-semibold text-[#47624d] bg-[#5f7b65]/10 px-2.5 py-1 rounded-full"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* MONTHLY REFLECTION MATRIX (Dynamic Gratitude Consistency) */}
          <div className="bg-white p-6 rounded-3xl shadow-ambient border border-[#e4e2e1] space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-[#745b25] uppercase font-bold">
              MONTHLY HEAT MAP
            </span>
            <h4 className="font-serif-title text-lg font-bold text-[#1b1c1c]">
              Gratitude Consistency
            </h4>

            <div className="grid grid-cols-7 gap-1.5 pt-2">
              {daysGrid.map((item, idx) => (
                <div
                  key={idx}
                  className={`h-7 rounded-lg transition-colors ${
                    item.hasEntry
                      ? "bg-[#47624d]"
                      : "bg-[#f6f3f2] border border-[#e4e2e1]"
                  }`}
                  title={`${item.date}: ${item.hasEntry ? "Reflection logged" : "No reflection"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#e4e2e1] space-y-4"
            >
              <div className="flex items-center gap-3 text-red-600">
                <div className="p-2 bg-red-50 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-serif-title text-lg font-bold text-[#1b1c1c]">
                  Delete Reflection?
                </h3>
              </div>
              <p className="text-xs text-[#615b51]">
                Are you sure you want to permanently delete this past reflection? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#737972] hover:bg-[#f6f3f2]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteEntry(deletingId)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
