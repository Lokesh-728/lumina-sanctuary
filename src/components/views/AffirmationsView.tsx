"use client";

import { useState, useEffect, useRef } from "react";
import {
  useLuminaStore,
  AffirmationItem,
  AffirmationCategoryItem,
} from "@/store/useLuminaStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Heart,
  Sun,
  Volume2,
  VolumeX,
  Mic,
  Play,
  Pause,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  Bookmark,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Edit3,
  Trash2,
  X,
  Check,
  Tag,
  BarChart2,
  Shuffle,
  FolderPlus,
} from "lucide-react";
import confetti from "canvas-confetti";
import { apiService } from "@/services/api";

export default function AffirmationsView() {
  const {
    user,
    accessToken,
    openAuthModal,
    categories,
    affirmations,
    affirmationAnalytics,
    activeCategory,
    setActiveCategory,
    addCategory,
    renameCategory,
    deleteCategory,
    addAffirmation,
    updateAffirmation,
    deleteAffirmation,
    toggleFavoriteAffirmation,
    setTodayFeaturedAffirmation,
    recordAffirmationRecitation,
    showToast,
    setActiveTab,
  } = useLuminaStore();

  const [activeFilter, setActiveFilter] = useState<
    "ALL" | "TODAY" | "FAVORITES" | "RECENT"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Modals
  const [isAffirmationModalOpen, setIsAffirmationModalOpen] = useState(false);
  const [editingAffirmation, setEditingAffirmation] =
    useState<AffirmationItem | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [categoryToDelete, setCategoryToDelete] = useState<AffirmationCategoryItem | null>(null);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);

  const [isReadingModeOpen, setIsReadingModeOpen] = useState(false);
  const [readingIndex, setReadingIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(5); // seconds per slide
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  // Helper for checking auth before write action
  const requireAuth = (actionName: string = "perform this action") => {
    if (!user) {
      showToast(`Please login to ${actionName}`);
      openAuthModal("login");
      return false;
    }
    return true;
  };

  // Form State for Affirmation
  const [affText, setAffText] = useState("");
  const [affCategory, setAffCategory] = useState(categories[0]?.id || "");
  const [affTags, setAffTags] = useState("");
  const [affIsFavorite, setAffIsFavorite] = useState(false);
  const [affIsToday, setAffIsToday] = useState(false);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Collect all unique tags for filter tag cloud
  const allTags = Array.from(
    new Set(affirmations.flatMap((a) => a.tags || []))
  );

  // Filter Logic
  const filteredAffirmations = affirmations.filter((aff) => {
    if (activeCategory !== "All" && aff.categoryId !== activeCategory) {
      return false;
    }
    if (selectedTag && !aff.tags.includes(selectedTag)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = aff.text.toLowerCase().includes(q);
      const matchCategory = aff.categoryName?.toLowerCase().includes(q);
      const matchTag = aff.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchText && !matchCategory && !matchTag) return false;
    }
    switch (activeFilter) {
      case "TODAY":
        return aff.isTodayFeatured;
      case "FAVORITES":
        return aff.isFavorite;
      case "RECENT":
        return true;
      default:
        return true;
    }
  });

  // Open Create / Edit Modal
  const openCreateModal = () => {
    if (!requireAuth("create affirmations")) return;
    setEditingAffirmation(null);
    setAffText("");
    setAffCategory(categories[0]?.id || "");
    setAffTags("");
    setAffIsFavorite(false);
    setAffIsToday(false);
    setAudioUrl(undefined);
    setIsAffirmationModalOpen(true);
  };

  const openEditModal = (aff: AffirmationItem) => {
    if (!requireAuth("edit affirmations")) return;
    setEditingAffirmation(aff);
    setAffText(aff.text);
    setAffCategory(aff.categoryId);
    setAffTags(aff.tags.join(", "));
    setAffIsFavorite(aff.isFavorite);
    setAffIsToday(aff.isTodayFeatured);
    setAudioUrl(aff.audioUrl);
    setIsAffirmationModalOpen(true);
  };

  const handleSaveAffirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth("save affirmation")) return;
    if (!affText.trim()) return;

    const tagsArray = affTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingAffirmation) {
      if (accessToken) {
        try {
          await apiService.updateAffirmation(accessToken, editingAffirmation.id, {
            text: affText,
            categoryId: affCategory,
            tags: tagsArray,
            isFavorite: affIsFavorite,
            isTodayFeatured: affIsToday,
            audioUrl,
          });
        } catch (err) {
          console.error("Failed to update affirmation via API:", err);
        }
      }
      updateAffirmation(editingAffirmation.id, {
        text: affText,
        categoryId: affCategory,
        tags: tagsArray,
        isFavorite: affIsFavorite,
        isTodayFeatured: affIsToday,
        audioUrl,
      });
      showToast("Affirmation updated successfully");
    } else {
      if (accessToken) {
        try {
          const created = await apiService.createAffirmation(accessToken, {
            text: affText,
            categoryId: affCategory,
            tags: tagsArray,
            isFavorite: affIsFavorite,
            isTodayFeatured: affIsToday,
            audioUrl,
          });
          addAffirmation({
            id: created.id,
            text: created.text,
            categoryId: created.categoryId,
            categoryName: created.categoryName || categories.find((c) => c.id === affCategory)?.name || "General",
            tags: created.tags || tagsArray,
            isFavorite: created.isFavorite,
            isTodayFeatured: created.isTodayFeatured,
            audioUrl: created.audioUrl,
          });
        } catch (err) {
          console.error("Failed to create affirmation via API:", err);
          addAffirmation({
            text: affText,
            categoryId: affCategory,
            tags: tagsArray,
            isFavorite: affIsFavorite,
            isTodayFeatured: affIsToday,
            audioUrl,
          });
        }
      } else {
        addAffirmation({
          text: affText,
          categoryId: affCategory,
          tags: tagsArray,
          isFavorite: affIsFavorite,
          isTodayFeatured: affIsToday,
          audioUrl,
        });
      }
      showToast("New affirmation saved");
    }
    setIsAffirmationModalOpen(false);
  };

  // Add Category Handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth("create categories")) return;
    if (!newCategoryName.trim()) return;

    if (accessToken) {
      try {
        const cat = await apiService.createCategory(accessToken, newCategoryName.trim());
        addCategory(cat.name);
      } catch (err) {
        console.error("Failed to create category via API:", err);
        addCategory(newCategoryName.trim());
      }
    } else {
      addCategory(newCategoryName.trim());
    }
    setNewCategoryName("");
    setIsCategoryModalOpen(false);
    showToast("Category created");
  };

  // Delete Category Confirmation Handler
  const promptDeleteCategory = (cat: AffirmationCategoryItem) => {
    if (!requireAuth("delete categories")) return;
    setCategoryToDelete(cat);
    setIsDeleteCategoryModalOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    if (accessToken) {
      try {
        await apiService.deleteCategory(accessToken, categoryToDelete.id);
      } catch (err) {
        console.error("Failed to delete category via API:", err);
      }
    }
    deleteCategory(categoryToDelete.id);
    if (activeCategory === categoryToDelete.id) {
      setActiveCategory("All");
    }
    showToast(`Category "${categoryToDelete.name}" deleted`);
    setIsDeleteCategoryModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleDeleteAffirmation = async (id: string) => {
    if (!requireAuth("delete affirmation")) return;
    if (accessToken) {
      try {
        await apiService.deleteAffirmation(accessToken, id);
      } catch (err) {
        console.error("Failed to delete affirmation via API:", err);
      }
    }
    deleteAffirmation(id);
    showToast("Affirmation deleted");
  };

  const handleToggleFavorite = async (aff: AffirmationItem) => {
    if (!requireAuth("favorite affirmation")) return;
    if (accessToken) {
      try {
        await apiService.updateAffirmation(accessToken, aff.id, {
          isFavorite: !aff.isFavorite,
        });
      } catch (err) {
        console.error("Failed to toggle favorite via API:", err);
      }
    }
    toggleFavoriteAffirmation(aff.id);
    showToast(aff.isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  // Speech Synthesis TTS
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isPlayingTTS) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingTTS(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingTTS(true);
    recordAffirmationRecitation();
  };

  // Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      showToast("Microphone access denied or unavailable");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Reading Mode Navigation & Auto Play Effect FIXED
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isReadingModeOpen && isAutoPlay && filteredAffirmations.length > 0) {
      timer = setInterval(() => {
        setReadingIndex((prev) => (prev + 1) % filteredAffirmations.length);
        recordAffirmationRecitation();
      }, autoPlaySpeed * 1000);
    }
    return () => clearInterval(timer);
  }, [isReadingModeOpen, isAutoPlay, autoPlaySpeed, filteredAffirmations.length, recordAffirmationRecitation]);

  const openReadingMode = (startIndex: number = 0) => {
    if (filteredAffirmations.length === 0) {
      showToast("No affirmations available to read");
      return;
    }
    setReadingIndex(startIndex);
    setIsReadingModeOpen(true);
  };

  const handleRandomAffirmation = () => {
    if (filteredAffirmations.length === 0) return;
    const rand = Math.floor(Math.random() * filteredAffirmations.length);
    openReadingMode(rand);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.6 },
    });
  };

  const featuredTodayAffirmation = affirmations.find((a) => a.isTodayFeatured);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e4e2e1] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#745b25] mb-1">
            <Sparkles className="w-5 h-5 text-[#745b25]" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Mindset & Energy
            </span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1b1c1c]">
            Affirmations & Intentions
          </h1>
          <p className="text-sm text-[#615b51] mt-1">
            Reprogram your subconscious mind through category-based daily recitations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRandomAffirmation}
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#c2c8c0] text-[#1b1c1c] text-xs font-semibold hover:bg-[#f6f3f2] transition-all flex items-center gap-2 shadow-xs"
          >
            <Shuffle className="w-4 h-4 text-[#745b25]" />
            <span>Random Manifestation</span>
          </button>

          <button
            onClick={() => openReadingMode(0)}
            className="px-4 py-2.5 rounded-2xl bg-[#745b25] hover:bg-[#5f491c] text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-xs"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Distraction-Free Mode</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-2xl bg-[#47624d] hover:bg-[#38503d] text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Affirmation</span>
          </button>
        </div>
      </div>

      {/* TODAY'S FEATURED AFFIRMATION HERO BANNER */}
      {featuredTodayAffirmation && (
        <div className="bg-gradient-to-br from-[#47624d] to-[#2f4333] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-[#ffdb99] text-xs font-semibold tracking-wider uppercase font-mono">
              <Sun className="w-4 h-4" /> Today&apos;s Featured Affirmation
            </div>
            <p className="font-serif-title text-2xl sm:text-3xl leading-snug font-medium italic">
              &quot;{featuredTodayAffirmation.text}&quot;
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-100/80 pt-1">
              <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10">
                {featuredTodayAffirmation.categoryName}
              </span>
              {featuredTodayAffirmation.tags.map((t) => (
                <span key={t} className="text-[11px]">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => speakText(featuredTodayAffirmation.text)}
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/20 shadow-md"
              title="Play Text to Speech"
            >
              {isPlayingTTS ? (
                <VolumeX className="w-6 h-6 text-[#ffdb99]" />
              ) : (
                <Volume2 className="w-6 h-6 text-[#ffdb99]" />
              )}
            </button>

            <button
              onClick={() => {
                toggleFavoriteAffirmation(featuredTodayAffirmation.id);
                showToast("Favorites updated");
              }}
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/20 shadow-md"
            >
              <Heart
                className={`w-6 h-6 ${
                  featuredTodayAffirmation.isFavorite
                    ? "fill-rose-400 text-rose-400"
                    : "text-white"
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* CATEGORY FILTER TABS & CATEGORY MANAGEMENT */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-title text-xl font-bold text-[#1b1c1c]">
            Categories
          </h2>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="text-xs text-[#47624d] font-semibold hover:underline flex items-center gap-1"
          >
            <FolderPlus className="w-3.5 h-3.5" /> Add Category
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeCategory === "All"
                ? "bg-[#1b1c1c] text-white border-[#1b1c1c] shadow-xs"
                : "bg-white text-[#424842] border-[#e4e2e1] hover:border-[#c2c8c0]"
            }`}
          >
            All Categories ({affirmations.length})
          </button>

          {categories.map((cat) => {
            const count = affirmations.filter((a) => a.categoryId === cat.id).length;
            const isSelected = activeCategory === cat.id;
            return (
              <div key={cat.id} className="relative group shrink-0 flex items-center">
                <button
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#47624d] text-white border-[#47624d] shadow-xs"
                      : "bg-white text-[#424842] border-[#e4e2e1] hover:border-[#c2c8c0]"
                  }`}
                >
                  <span>{cat.name} ({count})</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    promptDeleteCategory(cat);
                  }}
                  title={`Delete category "${cat.name}"`}
                  className="p-1 text-[#737972] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-[#e4e2e1] shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737972]" />
          <input
            type="text"
            placeholder="Search affirmations or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f6f3f2] focus:bg-white text-xs text-[#1b1c1c] pl-10 pr-4 py-2.5 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {(
            [
              { id: "ALL", label: "All" },
              { id: "TODAY", label: "Today's Featured" },
              { id: "FAVORITES", label: "Favorites" },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === f.id
                  ? "bg-[#745b25] text-white"
                  : "bg-[#f6f3f2] text-[#424842] hover:bg-[#e8e4e3]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAG CLOUD (IF TAGS EXIST) */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[#737972] font-mono text-[10px] uppercase">
            Filter by Tag:
          </span>
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-semibold text-[11px] flex items-center gap-1"
            >
              Clear Tag <X className="w-3 h-3" />
            </button>
          )}
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                selectedTag === tag
                  ? "bg-[#47624d] text-white"
                  : "bg-[#f6f3f2] text-[#615b51] hover:bg-[#e4e2e1]"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* AFFIRMATIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAffirmations.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-[#e4e2e1] text-center space-y-3">
            <Sparkles className="w-8 h-8 text-[#745b25] mx-auto opacity-50" />
            <h3 className="font-serif-title text-xl font-bold text-[#1b1c1c]">
              No Affirmations Found
            </h3>
            <p className="text-xs text-[#615b51] max-w-md mx-auto">
              Try adjusting your category filter, search query, or create a brand new affirmation to empower your mindset.
            </p>
            <button
              onClick={openCreateModal}
              className="px-5 py-2.5 rounded-2xl bg-[#47624d] text-white text-xs font-semibold inline-flex items-center gap-2 mt-2"
            >
              <Plus className="w-4 h-4" /> Create Affirmation
            </button>
          </div>
        ) : (
          filteredAffirmations.map((aff, idx) => (
            <div
              key={aff.id}
              className="bg-white p-6 rounded-3xl border border-[#e4e2e1] shadow-ambient hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#f6f3f2] text-[#47624d]">
                    {aff.categoryName}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setTodayFeaturedAffirmation(aff.id);
                        showToast("Set as Today's Affirmation");
                      }}
                      title="Set as Today's Affirmation"
                      className={`p-1.5 rounded-xl hover:bg-[#f6f3f2] ${
                        aff.isTodayFeatured
                          ? "text-[#745b25]"
                          : "text-[#c2c8c0] group-hover:text-[#737972]"
                      }`}
                    >
                      <Sun className="w-4 h-4 fill-current" />
                    </button>

                    <button
                      onClick={() => handleToggleFavorite(aff)}
                      className="p-1.5 rounded-xl hover:bg-[#f6f3f2]"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          aff.isFavorite
                            ? "fill-rose-500 text-rose-500"
                            : "text-[#c2c8c0] group-hover:text-[#737972]"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <p className="font-serif-title text-lg text-[#1b1c1c] leading-relaxed font-medium">
                  &quot;{aff.text}&quot;
                </p>

                {aff.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {aff.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] text-[#737972] bg-[#f6f3f2] px-2 py-0.5 rounded-md"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* CARD FOOTER */}
              <div className="pt-3 border-t border-[#f0eded] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => speakText(aff.text)}
                    className="p-2 rounded-xl bg-[#f6f3f2] hover:bg-[#e4eadf] text-[#47624d] transition-colors"
                    title="Speak Affirmation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {aff.audioUrl && (
                    <audio src={aff.audioUrl} controls className="h-7 w-28" />
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(aff)}
                    className="p-1.5 rounded-xl hover:bg-[#f6f3f2] text-[#737972] hover:text-[#1b1c1c]"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAffirmation(aff.id)}
                    className="p-1.5 rounded-xl hover:bg-[#f6f3f2] text-[#737972] hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT AFFIRMATION MODAL */}
      <AnimatePresence>
        {isAffirmationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#e4e2e1]"
            >
              <div className="flex items-center justify-between border-b border-[#f0eded] pb-4">
                <h3 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
                  {editingAffirmation ? "Edit Affirmation" : "New Affirmation"}
                </h3>
                <button
                  onClick={() => setIsAffirmationModalOpen(false)}
                  className="p-2 text-[#737972] hover:text-[#1b1c1c] rounded-full hover:bg-[#f6f3f2]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAffirmation} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#1b1c1c] font-semibold mb-1">
                    Affirmation Statement *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Money flows effortlessly toward me in expected and unexpected ways."
                    value={affText}
                    onChange={(e) => setAffText(e.target.value)}
                    className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none font-serif-title text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#1b1c1c] font-semibold mb-1">
                      Category
                    </label>
                    <select
                      value={affCategory}
                      onChange={(e) => setAffCategory(e.target.value)}
                      className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#1b1c1c] font-semibold mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="Abundance, Mindset, Wealth"
                      value={affTags}
                      onChange={(e) => setAffTags(e.target.value)}
                      className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none"
                    />
                  </div>
                </div>

                {/* AUDIO RECORDING SECTION */}
                <div className="p-4 bg-[#f6f3f2] rounded-2xl space-y-2 border border-[#e4e2e1]">
                  <label className="block text-[#1b1c1c] font-semibold">
                    Voice Recording (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-4 py-2 rounded-xl bg-[#47624d] text-white font-medium flex items-center gap-2"
                      >
                        <Mic className="w-4 h-4" /> Start Recording
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-4 py-2 rounded-xl bg-rose-600 text-white font-medium animate-pulse flex items-center gap-2"
                      >
                        <Pause className="w-4 h-4" /> Stop Recording
                      </button>
                    )}

                    {audioUrl && (
                      <audio src={audioUrl} controls className="h-8 w-40" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={affIsFavorite}
                      onChange={(e) => setAffIsFavorite(e.target.checked)}
                      className="accent-[#47624d] w-4 h-4 rounded"
                    />
                    <span className="font-semibold text-[#1b1c1c]">Add to Favorites</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={affIsToday}
                      onChange={(e) => setAffIsToday(e.target.checked)}
                      className="accent-[#745b25] w-4 h-4 rounded"
                    />
                    <span className="font-semibold text-[#1b1c1c]">Set as Today&apos;s Featured</span>
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-[#f0eded]">
                  <button
                    type="button"
                    onClick={() => setIsAffirmationModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-[#c2c8c0] text-[#1b1c1c] font-medium hover:bg-[#f6f3f2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#47624d] text-white font-medium hover:bg-[#38503d]"
                  >
                    {editingAffirmation ? "Save Changes" : "Create Affirmation"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE CATEGORY MODAL */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-[#e4e2e1]"
            >
              <div className="flex items-center justify-between border-b border-[#f0eded] pb-3">
                <h3 className="font-serif-title text-xl font-bold text-[#1b1c1c]">
                  New Category
                </h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-1.5 text-[#737972] hover:text-[#1b1c1c]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#1b1c1c] font-semibold mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Focus & Study"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#c2c8c0] text-[#1b1c1c]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#47624d] text-white font-medium"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CATEGORY CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteCategoryModalOpen && categoryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-[#e4e2e1]"
            >
              <div className="flex items-center justify-between border-b border-[#f0eded] pb-3">
                <h3 className="font-serif-title text-xl font-bold text-rose-700">
                  Delete Category?
                </h3>
                <button
                  onClick={() => setIsDeleteCategoryModalOpen(false)}
                  className="p-1.5 text-[#737972] hover:text-[#1b1c1c]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs text-[#615b51]">
                <p>
                  Are you sure you want to delete the category{" "}
                  <strong className="text-[#1b1c1c] font-semibold">&quot;{categoryToDelete.name}&quot;</strong>?
                </p>
                <p className="bg-rose-50 text-rose-700 p-3 rounded-2xl border border-rose-200">
                  ⚠️ Deleting this category will also permanently delete all affirmations assigned to it.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#c2c8c0] text-[#1b1c1c] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteCategory}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-xs"
                >
                  Delete Category
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN DISTRACTION-FREE READING MODE */}
      <AnimatePresence>
        {isReadingModeOpen && filteredAffirmations[readingIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#121413] text-white flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none"
          >
            {/* TOP BAR */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full text-[#ffdb99]">
                  {filteredAffirmations[readingIndex].categoryName}
                </span>
                <span className="text-xs text-white/60">
                  {readingIndex + 1} of {filteredAffirmations.length}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* AUTO PLAY TOGGLE */}
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs">
                  <span className="text-white/80 font-medium">Auto Scroll</span>
                  <input
                    type="checkbox"
                    checked={isAutoPlay}
                    onChange={(e) => setIsAutoPlay(e.target.checked)}
                    className="accent-[#ffdb99] w-4 h-4"
                  />
                  {isAutoPlay && (
                    <select
                      value={autoPlaySpeed}
                      onChange={(e) => setAutoPlaySpeed(Number(e.target.value))}
                      className="bg-transparent text-white font-mono text-xs focus:outline-none ml-1"
                    >
                      <option value={3} className="text-black">3s</option>
                      <option value={5} className="text-black">5s</option>
                      <option value={8} className="text-black">8s</option>
                    </select>
                  )}
                </div>

                <button
                  onClick={() => setIsReadingModeOpen(false)}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* MAIN AFFIRMATION DISPLAY */}
            <div className="max-w-4xl mx-auto text-center space-y-8 my-auto px-4">
              <motion.p
                key={filteredAffirmations[readingIndex].id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="font-serif-title text-3xl sm:text-5xl md:text-6xl font-medium leading-tight text-emerald-50 italic"
              >
                &quot;{filteredAffirmations[readingIndex].text}&quot;
              </motion.p>

              {filteredAffirmations[readingIndex].tags.length > 0 && (
                <div className="flex items-center justify-center gap-2 flex-wrap pt-4">
                  {filteredAffirmations[readingIndex].tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* BOTTOM CONTROLS BAR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto w-full">
              <button
                onClick={() =>
                  setReadingIndex(
                    (prev) => (prev - 1 + filteredAffirmations.length) % filteredAffirmations.length
                  )
                }
                className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    speakText(filteredAffirmations[readingIndex].text)
                  }
                  className="px-6 py-3 rounded-full bg-[#47624d] hover:bg-[#38503d] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg"
                >
                  <Volume2 className="w-4 h-4 text-[#ffdb99]" />
                  <span>Listen (TTS)</span>
                </button>

                <button
                  onClick={() => {
                    recordAffirmationRecitation();
                    confetti({ particleCount: 20, spread: 40 });
                    showToast("Recitation logged (+1)");
                  }}
                  className="px-6 py-3 rounded-full bg-[#745b25] hover:bg-[#5f491c] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-[#ffdb99]" />
                  <span>Log Recitation</span>
                </button>
              </div>

              <button
                onClick={() =>
                  setReadingIndex(
                    (prev) => (prev + 1) % filteredAffirmations.length
                  )
                }
                className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
