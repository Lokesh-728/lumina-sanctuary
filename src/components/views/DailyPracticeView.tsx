"use client";

import { useState, useEffect } from "react";
import { useLuminaStore, DailyTask, TaskPriority, RepeatFrequency } from "@/store/useLuminaStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Sun,
  Moon,
  Sparkles,
  Plus,
  Pin,
  Archive,
  RotateCcw,
  Trash2,
  Edit2,
  Search,
  Filter,
  Clock,
  Calendar,
  AlertCircle,
  BarChart3,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";

import { apiService } from "@/services/api";

export default function DailyPracticeView() {
  const {
    dailyTasks,
    toggleTask,
    addTask,
    updateTask,
    archiveTask,
    restoreTask,
    deleteTask,
    pinTask,
    showToast,
    setActiveTab,
    user,
    accessToken,
    openAuthModal,
  } = useLuminaStore();

  useEffect(() => {
    if (accessToken) {
      apiService
        .getTasks(accessToken)
        .then((tasks) => {
          if (Array.isArray(tasks)) {
            useLuminaStore.getState().setDailyTasks(tasks);
          }
        })
        .catch((err) => console.error("Error fetching tasks on mount:", err));
    }
  }, [accessToken]);

  const [activeFilter, setActiveFilter] = useState<
    "ALL" | "PENDING" | "COMPLETED" | "ARCHIVED" | "HIGH_PRIORITY" | "PINNED"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"morning" | "afternoon" | "evening">("morning");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [estimatedTime, setEstimatedTime] = useState<number>(15);
  const [dueDate, setDueDate] = useState("");
  const [repeatFrequency, setRepeatFrequency] = useState<RepeatFrequency>("NONE");

  const openCreateModal = (cat: "morning" | "afternoon" | "evening" = "morning") => {
    if (!accessToken || !user) {
      openAuthModal("login");
      showToast("Please sign in to save your daily practice tasks");
      return;
    }
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setCategory(cat);
    setPriority("MEDIUM");
    setEstimatedTime(15);
    setDueDate("");
    setRepeatFrequency("NONE");
    setIsModalOpen(true);
  };

  const openEditModal = (task: DailyTask) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setCategory((task.category?.toLowerCase() as any) || "morning");
    setPriority(task.priority || "MEDIUM");
    setEstimatedTime(task.estimatedTime || 15);
    setDueDate(task.dueDate || "");
    setRepeatFrequency(task.repeatFrequency || "NONE");
    setIsModalOpen(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      if (accessToken) {
        try {
          await apiService.updateTask(accessToken, editingTask.id, {
            title,
            description,
            category: category.toUpperCase(),
            priority,
            estimatedTime,
            dueDate,
            repeatFrequency,
          });
        } catch (err) {
          console.error("API task update error:", err);
        }
      }
      updateTask(editingTask.id, {
        title,
        description,
        category,
        priority,
        estimatedTime,
        dueDate,
        repeatFrequency,
      });
      showToast("Task updated successfully");
    } else {
      if (accessToken) {
        try {
          const created = await apiService.createTask(accessToken, {
            title,
            description,
            category: category.toUpperCase(),
            priority,
            estimatedTime,
            dueDate,
            repeatFrequency,
          });
          addTask({
            id: created.id,
            title: created.title,
            description: created.description,
            category: (created.category ? created.category.toLowerCase() : category) as any,
            priority: created.priority,
            estimatedTime: created.estimatedTime,
            dueDate: created.dueDate,
            repeatFrequency: created.repeatFrequency,
            completed: false,
          });
        } catch (err) {
          addTask({
            title,
            description,
            category,
            priority,
            estimatedTime,
            dueDate,
            repeatFrequency,
            completed: false,
          });
        }
      } else {
        addTask({
          title,
          description,
          category,
          priority,
          estimatedTime,
          dueDate,
          repeatFrequency,
          completed: false,
        });
      }
      showToast("New ritual task added");
    }
    setIsModalOpen(false);
  };

  const handleToggle = async (id: string, currentCompleted: boolean) => {
    if (accessToken) {
      try {
        await apiService.toggleTask(accessToken, id);
      } catch (err) {
        console.error("API task toggle error:", err);
      }
    }
    toggleTask(id);
    if (!currentCompleted) {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#47624d", "#745b25", "#8DA18F"],
      });
    }
  };

  const handleArchiveTask = async (id: string) => {
    if (accessToken) {
      try {
        await apiService.archiveTask(accessToken, id);
      } catch (err) {}
    }
    archiveTask(id);
  };

  const handleRestoreTask = async (id: string) => {
    if (accessToken) {
      try {
        await apiService.restoreTask(accessToken, id);
      } catch (err) {}
    }
    restoreTask(id);
  };

  const handleDeleteTask = async (id: string) => {
    if (accessToken) {
      try {
        await apiService.deleteTask(accessToken, id);
      } catch (err) {}
    }
    deleteTask(id);
  };

  // Filter Tasks Logic
  const nonArchivedTasks = dailyTasks.filter((t) => !t.isArchived);
  const archivedTasks = dailyTasks.filter((t) => t.isArchived);

  const getFilteredTasks = (categoryName: "morning" | "afternoon" | "evening") => {
    return nonArchivedTasks.filter((task) => {
      if (!task.category || task.category.toLowerCase() !== categoryName.toLowerCase()) return false;

      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      switch (activeFilter) {
        case "PENDING":
          return !task.completed;
        case "COMPLETED":
          return task.completed;
        case "HIGH_PRIORITY":
          return task.priority === "HIGH";
        case "PINNED":
          return !!task.isPinned;
        case "ARCHIVED":
          return false;
        default:
          return true;
      }
    });
  };

  const morningTasks = getFilteredTasks("morning");
  const afternoonTasks = getFilteredTasks("afternoon");
  const eveningTasks = getFilteredTasks("evening");

  // Calculations for Today's Clarity Ring
  const activeTasksList = dailyTasks.filter((t) => !t.isArchived);
  const completedCount = activeTasksList.filter((t) => t.completed).length;
  const totalCount = activeTasksList.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Motivational Messages based on Percentage
  const getMotivationalMessage = (pct: number) => {
    if (pct === 0) return "Let's begin.";
    if (pct <= 25) return "Good start.";
    if (pct <= 50) return "Halfway there.";
    if (pct <= 75) return "Almost done.";
    return "Excellent work!";
  };

  if (!user) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-[#5f7b65]/10 text-[#47624d] rounded-full flex items-center justify-center mx-auto p-4 border border-[#47624d]/20">
          <Sun className="w-8 h-8 mx-auto" />
        </div>
        <h2 className="font-serif-title text-3xl font-bold text-[#1b1c1c]">
          Private Daily Practice Sanctuary
        </h2>
        <p className="text-[#615b51] max-w-md mx-auto text-sm leading-relaxed">
          Your daily rituals, morning disciplines, and daily execution tasks are private to your user profile.
        </p>
        <button
          onClick={() => openAuthModal("login")}
          className="bg-[#47624d] hover:bg-[#38503d] text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg transition-all"
        >
          Sign In to Access Practice
        </button>
      </div>
    );
  }

  const priorityColor = (pri?: TaskPriority) => {
    switch (pri) {
      case "HIGH":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "MEDIUM":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "LOW":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e4e2e1] pb-6">
        <div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1b1c1c]">
            Daily Practice
          </h1>
          <p className="text-sm text-[#615b51] mt-1">
            Structured ritual management designed to cultivate unbroken focus and daily discipline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowStatsModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#c2c8c0] text-[#1b1c1c] text-xs font-semibold hover:bg-[#f6f3f2] transition-all flex items-center gap-2 shadow-sm"
          >
            <BarChart3 className="w-4 h-4 text-[#47624d]" />
            <span>Practice Insights</span>
          </button>

          <button
            onClick={() => openCreateModal("morning")}
            className="px-5 py-2.5 rounded-2xl bg-[#47624d] hover:bg-[#38503d] text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Ritual Task</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-[#e4e2e1] shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737972]" />
          <input
            type="text"
            placeholder="Search rituals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f6f3f2] focus:bg-white text-xs text-[#1b1c1c] pl-10 pr-4 py-2.5 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {(
            [
              { id: "ALL", label: "All Tasks" },
              { id: "PENDING", label: "Pending" },
              { id: "COMPLETED", label: "Completed" },
              { id: "HIGH_PRIORITY", label: "High Priority" },
              { id: "PINNED", label: "Pinned" },
              { id: "ARCHIVED", label: `Archived (${archivedTasks.length})` },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === f.id
                  ? "bg-[#47624d] text-white shadow-xs"
                  : "bg-[#f6f3f2] text-[#424842] hover:bg-[#e8e4e3]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ARCHIVED SECTION (IF SELECTED) */}
      {activeFilter === "ARCHIVED" ? (
        <div className="bg-white p-6 rounded-3xl border border-[#e4e2e1] space-y-4">
          <div className="flex items-center justify-between border-b border-[#f0eded] pb-3">
            <h2 className="font-serif-title text-xl font-bold text-[#1b1c1c] flex items-center gap-2">
              <Archive className="w-5 h-5 text-[#737972]" /> Archived Tasks
            </h2>
            <span className="text-xs text-[#737972] font-mono">
              {archivedTasks.length} ITEMS ARCHIVED
            </span>
          </div>

          {archivedTasks.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#737972]">
              No archived tasks found.
            </div>
          ) : (
            <div className="space-y-2">
              {archivedTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl bg-[#f6f3f2]/60 border border-[#e4e2e1] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-medium text-[#1b1c1c] line-through">
                      {task.title}
                    </span>
                    <span className="ml-3 px-2 py-0.5 rounded-md bg-[#e4e2e1] text-[10px] text-[#615b51] uppercase font-mono">
                      {task.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        restoreTask(task.id);
                        showToast("Task restored");
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#c2c8c0] text-[#1b1c1c] font-medium hover:bg-[#f6f3f2] flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Restore
                    </button>
                    <button
                      onClick={() => {
                        deleteTask(task.id);
                        showToast("Task permanently deleted");
                      }}
                      className="p-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* MAIN GRID: 3 RITUAL SECTIONS & RIGHT PROGRESS COLUMN */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: 3 PERMANENT PRACTICE SECTIONS */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. MORNING RITUALS */}
            <section className="space-y-4">
              <div className="flex items-center justify-between text-[#745b25]">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  <h2 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
                    Morning Rituals
                  </h2>
                </div>
                <button
                  onClick={() => openCreateModal("morning")}
                  className="p-1.5 text-xs text-[#47624d] hover:bg-[#e4eadf] rounded-xl flex items-center gap-1 font-medium"
                >
                  <Plus className="w-4 h-4" /> Add Task
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-ambient border border-[#e4e2e1] space-y-3">
                {morningTasks.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#737972] italic">
                    No morning rituals matching filter.
                  </div>
                ) : (
                  morningTasks.map((task) => (
                    <TaskCardItem
                      key={task.id}
                      task={task}
                      onToggle={() => handleToggle(task.id, task.completed)}
                      onPin={() => pinTask(task.id)}
                      onEdit={() => openEditModal(task)}
                      onArchive={() => {
                        archiveTask(task.id);
                        showToast("Task archived");
                      }}
                      priorityColor={priorityColor}
                    />
                  ))
                )}
              </div>
            </section>

            {/* 2. AFTERNOON MOMENTUM */}
            <section className="space-y-4">
              <div className="flex items-center justify-between text-[#745b25]">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-[#DBC49A]" />
                  <h2 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
                    Afternoon Momentum
                  </h2>
                </div>
                <button
                  onClick={() => openCreateModal("afternoon")}
                  className="p-1.5 text-xs text-[#47624d] hover:bg-[#e4eadf] rounded-xl flex items-center gap-1 font-medium"
                >
                  <Plus className="w-4 h-4" /> Add Task
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-ambient border border-[#e4e2e1] space-y-3">
                {afternoonTasks.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#737972] italic">
                    No afternoon rituals matching filter.
                  </div>
                ) : (
                  afternoonTasks.map((task) => (
                    <TaskCardItem
                      key={task.id}
                      task={task}
                      onToggle={() => handleToggle(task.id, task.completed)}
                      onPin={() => pinTask(task.id)}
                      onEdit={() => openEditModal(task)}
                      onArchive={() => {
                        archiveTask(task.id);
                        showToast("Task archived");
                      }}
                      priorityColor={priorityColor}
                    />
                  ))
                )}
              </div>
            </section>

            {/* 3. EVENING REFLECTION */}
            <section className="space-y-4">
              <div className="flex items-center justify-between text-[#615b51]">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5" />
                  <h2 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
                    Evening Reflection
                  </h2>
                </div>
                <button
                  onClick={() => openCreateModal("evening")}
                  className="p-1.5 text-xs text-[#47624d] hover:bg-[#e4eadf] rounded-xl flex items-center gap-1 font-medium"
                >
                  <Plus className="w-4 h-4" /> Add Task
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-ambient border border-[#e4e2e1] space-y-3">
                {eveningTasks.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#737972] italic">
                    No evening rituals matching filter.
                  </div>
                ) : (
                  eveningTasks.map((task) => (
                    <TaskCardItem
                      key={task.id}
                      task={task}
                      onToggle={() => handleToggle(task.id, task.completed)}
                      onPin={() => pinTask(task.id)}
                      onEdit={() => openEditModal(task)}
                      onArchive={() => {
                        archiveTask(task.id);
                        showToast("Task archived");
                      }}
                      priorityColor={priorityColor}
                    />
                  ))
                )}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: TODAY'S CLARITY & INSIGHTS */}
          <div className="lg:col-span-5 space-y-6">
            {/* TODAY'S CLARITY PROGRESS RING CARD */}
            <div className="bg-white p-8 rounded-3xl shadow-ambient border border-[#e4e2e1] text-center space-y-6">
              <h3 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
                Today&apos;s Clarity
              </h3>

              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#f6f3f2"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#47624d"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="263.89"
                    animate={{ strokeDashoffset: 263.89 * (1 - percentage / 100) }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-serif-title text-4xl font-bold text-[#1b1c1c]">
                    {percentage}%
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#737972]">
                    COMPLETE
                  </span>
                </div>
              </div>

              {/* MOTIVATIONAL MESSAGE */}
              <div className="space-y-1">
                <p className="text-base font-serif-title font-bold text-[#47624d]">
                  &quot;{getMotivationalMessage(percentage)}&quot;
                </p>
                <p className="text-xs text-[#615b51]">
                  {completedCount}/{totalCount} actions performed today.
                </p>
              </div>

              <button
                onClick={() => setShowStatsModal(true)}
                className="w-full bg-[#f6f3f2] hover:bg-[#eae7e7] text-[#1b1c1c] text-xs font-semibold py-3 rounded-2xl transition-colors shadow-xs"
              >
                View Full Statistics & Streaks
              </button>
            </div>

            {/* DEEP FOCUS MOTIVATION */}
            <div className="bg-[#47624d] text-white p-8 rounded-3xl shadow-lg space-y-3 relative overflow-hidden">
              <h3 className="font-serif-title text-2xl font-bold">Deep Practice</h3>
              <p className="text-xs text-gray-100 leading-relaxed">
                Consistency in daily rituals creates profound neurological momentum. You are building a sanctuary of clarity step by intentional step.
              </p>
            </div>

            {/* CURRENT STREAK CARD */}
            <div className="bg-[#fcf9f8] p-6 rounded-3xl border border-[#e4e2e1] space-y-4">
              <div className="flex items-center gap-2 text-[#745b25]">
                <Sparkles className="w-5 h-5 text-[#745b25]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#745b25]">
                  Current Streak
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-serif-title text-5xl font-bold text-[#1b1c1c]">14</span>
                <span className="text-xl font-bold text-[#1b1c1c]">Days</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#e4e2e1] text-xs">
                <div>
                  <span className="text-[#737972] uppercase font-mono text-[10px] block">
                    CONSISTENCY
                  </span>
                  <span className="font-bold text-[#1b1c1c] text-sm">96%</span>
                </div>
                <div>
                  <span className="text-[#737972] uppercase font-mono text-[10px] block">
                    LONGEST STREAK
                  </span>
                  <span className="font-bold text-[#1b1c1c] text-sm">21 Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT TASK MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#e4e2e1]"
            >
              <div className="flex items-center justify-between border-b border-[#f0eded] pb-4">
                <h3 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
                  {editingTask ? "Edit Ritual Task" : "New Ritual Task"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-[#737972] hover:text-[#1b1c1c] rounded-full hover:bg-[#f6f3f2]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTask} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#1b1c1c] font-semibold mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15-Minute Somatic Movement"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#1b1c1c] font-semibold mb-1">
                    Optional Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Key focus areas, intentions, or notes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#1b1c1c] font-semibold mb-1">
                      Ritual Section
                    </label>
                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value as "morning" | "afternoon" | "evening")
                      }
                      className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none"
                    >
                      <option value="morning">Morning Rituals</option>
                      <option value="afternoon">Afternoon Momentum</option>
                      <option value="evening">Evening Reflection</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#1b1c1c] font-semibold mb-1">
                      Priority Level
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TaskPriority)}
                      className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none"
                    >
                      <option value="HIGH">High Priority</option>
                      <option value="MEDIUM">Medium Priority</option>
                      <option value="LOW">Low Priority</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#1b1c1c] font-semibold mb-1">
                      Est. Time (minutes)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={480}
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(Number(e.target.value))}
                      className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1b1c1c] font-semibold mb-1">
                      Repeat Frequency
                    </label>
                    <select
                      value={repeatFrequency}
                      onChange={(e) => setRepeatFrequency(e.target.value as RepeatFrequency)}
                      className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none"
                    >
                      <option value="NONE">None</option>
                      <option value="DAILY">Daily</option>
                      <option value="WEEKDAYS">Weekdays</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-[#f0eded]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-[#c2c8c0] text-[#1b1c1c] font-medium hover:bg-[#f6f3f2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#47624d] text-white font-medium hover:bg-[#38503d]"
                  >
                    {editingTask ? "Save Changes" : "Create Ritual Task"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STATISTICS MODAL */}
      <AnimatePresence>
        {showStatsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#e4e2e1]"
            >
              <div className="flex items-center justify-between border-b border-[#f0eded] pb-4">
                <h3 className="font-serif-title text-2xl font-bold text-[#1b1c1c] flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-[#47624d]" /> Practice Analytics
                </h3>
                <button
                  onClick={() => setShowStatsModal(false)}
                  className="p-2 text-[#737972] hover:text-[#1b1c1c] rounded-full hover:bg-[#f6f3f2]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-[#f6f3f2] rounded-2xl space-y-1">
                  <span className="text-[10px] font-mono text-[#737972] uppercase block">
                    DAILY %
                  </span>
                  <span className="text-2xl font-bold text-[#1b1c1c]">{percentage}%</span>
                </div>
                <div className="p-4 bg-[#f6f3f2] rounded-2xl space-y-1">
                  <span className="text-[10px] font-mono text-[#737972] uppercase block">
                    WEEKLY %
                  </span>
                  <span className="text-2xl font-bold text-[#1b1c1c]">92%</span>
                </div>
                <div className="p-4 bg-[#f6f3f2] rounded-2xl space-y-1">
                  <span className="text-[10px] font-mono text-[#737972] uppercase block">
                    CONSISTENCY
                  </span>
                  <span className="text-2xl font-bold text-[#47624d]">96%</span>
                </div>
                <div className="p-4 bg-[#f6f3f2] rounded-2xl space-y-1">
                  <span className="text-[10px] font-mono text-[#737972] uppercase block">
                    LONGEST STREAK
                  </span>
                  <span className="text-2xl font-bold text-[#745b25]">21 Days</span>
                </div>
              </div>

              {/* VISUAL COMPLETION CHART */}
              <div className="bg-[#fcf9f8] p-6 rounded-2xl border border-[#e4e2e1] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c]">
                  7-Day Consistency Progression
                </h4>
                <div className="flex items-end justify-between h-32 pt-6 px-2 border-b border-[#e4e2e1]">
                  {[
                    { day: "Mon", val: 80 },
                    { day: "Tue", val: 100 },
                    { day: "Wed", val: 90 },
                    { day: "Thu", val: 85 },
                    { day: "Fri", val: 100 },
                    { day: "Sat", val: 95 },
                    { day: "Sun", val: percentage },
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-6 bg-[#e4eadf] rounded-t-lg relative flex items-end justify-center overflow-hidden h-24">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${bar.val}%` }}
                          transition={{ duration: 0.5, delay: i * 0.05 }}
                          className="w-full bg-[#47624d] rounded-t-lg"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#737972]">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowStatsModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#47624d] text-white text-xs font-semibold hover:bg-[#38503d]"
                >
                  Close Analytics
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// INDIVIDUAL TASK CARD ITEM COMPONENT
function TaskCardItem({
  task,
  onToggle,
  onPin,
  onEdit,
  onArchive,
  priorityColor,
}: {
  task: DailyTask;
  onToggle: () => void;
  onPin: () => void;
  onEdit: () => void;
  onArchive: () => void;
  priorityColor: (p?: TaskPriority) => string;
}) {
  return (
    <div
      className={`p-4 rounded-2xl flex items-center justify-between transition-all border ${
        task.completed
          ? "bg-[#f6f3f2]/50 border-transparent text-[#737972]"
          : "bg-white border-[#f0eded] hover:border-[#c2c8c0] text-[#1b1c1c]"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
        {/* CHECKBOX */}
        <button
          onClick={onToggle}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
            task.completed
              ? "bg-[#47624d] text-white"
              : "border-2 border-[#c2c8c0] bg-white hover:border-[#47624d]"
          }`}
        >
          {task.completed && <CheckCircle2 className="w-4 h-4" />}
        </button>

        {/* TASK DETAILS */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium truncate ${
                task.completed ? "line-through text-[#737972]" : "text-[#1b1c1c]"
              }`}
            >
              {task.title}
            </span>

            {task.isPinned && (
              <Pin className="w-3.5 h-3.5 text-[#745b25] fill-current flex-shrink-0" />
            )}

            {task.priority && (
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border uppercase font-mono ${priorityColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-xs text-[#615b51] truncate mt-0.5">{task.description}</p>
          )}

          <div className="flex items-center gap-3 text-[10px] text-[#737972] mt-1">
            {task.estimatedTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#47624d]" /> {task.estimatedTime}m
              </span>
            )}
            {task.repeatFrequency && task.repeatFrequency !== "NONE" && (
              <span className="uppercase font-mono tracking-wider bg-[#f6f3f2] px-1.5 rounded-sm">
                🔁 {task.repeatFrequency}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-1 opacity-80 hover:opacity-100">
        <button
          onClick={onPin}
          title={task.isPinned ? "Unpin task" : "Pin task"}
          className={`p-1.5 rounded-xl hover:bg-[#f6f3f2] ${
            task.isPinned ? "text-[#745b25]" : "text-[#737972]"
          }`}
        >
          <Pin className="w-4 h-4" />
        </button>

        <button
          onClick={onEdit}
          title="Edit task"
          className="p-1.5 rounded-xl hover:bg-[#f6f3f2] text-[#737972] hover:text-[#1b1c1c]"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <button
          onClick={onArchive}
          title="Archive task"
          className="p-1.5 rounded-xl hover:bg-[#f6f3f2] text-[#737972] hover:text-amber-700"
        >
          <Archive className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
