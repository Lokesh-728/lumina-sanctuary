"use client";

import { useEffect, useState } from "react";
import { useLuminaStore } from "@/store/useLuminaStore";
import { motion } from "framer-motion";
import {
  Sparkles,
  Flame,
  Smile,
  CheckCircle2,
  Calendar,
  BarChart3,
  TrendingUp,
  Award,
  ArrowUpRight,
  Lock,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { apiService } from "@/services/api";

const weeklyData = [
  { day: "Mon", score: 85, hours: 2.5 },
  { day: "Tue", score: 92, hours: 3.0 },
  { day: "Wed", score: 78, hours: 1.8 },
  { day: "Thu", score: 95, hours: 3.2 },
  { day: "Fri", score: 88, hours: 2.8 },
  { day: "Sat", score: 100, hours: 4.0 },
  { day: "Sun", score: 90, hours: 3.5 },
];

const moodData = [
  { week: "W1", alignment: 65, calm: 60 },
  { week: "W2", alignment: 72, calm: 68 },
  { week: "W3", alignment: 84, calm: 78 },
  { week: "W4", alignment: 91, calm: 88 },
];

export default function DashboardView() {
  const {
    dashboardView,
    setDashboardView,
    dailyTasks,
    toggleTask,
    gratitudeEntries,
    affirmations,
    toggleFavoriteAffirmation,
    showToast,
    setActiveTab,
    user,
    accessToken,
    openAuthModal,
  } = useLuminaStore();

  const [stats, setStats] = useState<{
    currentStreak: number;
    longestStreak: number;
    completionDates: string[];
    dailyPercentage: number;
    weeklyConsistency: number;
  }>({
    currentStreak: 0,
    longestStreak: 0,
    completionDates: [],
    dailyPercentage: 0,
    weeklyConsistency: 0,
  });

  useEffect(() => {
    if (accessToken) {
      apiService
        .getHabitStats(accessToken)
        .then((res) => {
          if (res) {
            setStats({
              currentStreak: res.currentStreak || 0,
              longestStreak: res.longestStreak || 0,
              completionDates: res.completionDates || [],
              dailyPercentage: res.dailyPercentage || 0,
              weeklyConsistency: res.weeklyConsistency || 0,
            });
          }
        })
        .catch((err) => console.error("Error fetching habit stats:", err));
    }
  }, [accessToken, dailyTasks]);

  const handleDashboardToggleTask = async (taskId: string) => {
    if (accessToken) {
      try {
        await apiService.toggleTask(accessToken, taskId);
      } catch (err) {
        console.error("API task toggle error from Dashboard:", err);
      }
    }
    toggleTask(taskId);
  };

  const completedTasksCount = dailyTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round(
    dailyTasks.length > 0 ? (completedTasksCount / dailyTasks.length) * 100 : 0
  );

  const featuredAffirmation =
    affirmations.find((a) => a.isTodayFeatured) || affirmations[0];

  const handleSpeakAffirmation = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  if (!user) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-[#5f7b65]/10 text-[#47624d] rounded-full flex items-center justify-center mx-auto p-4 border border-[#47624d]/20">
          <Lock className="w-8 h-8 mx-auto" />
        </div>
        <h2 className="font-serif-title text-3xl font-bold text-[#1b1c1c]">
          Private Growth Dashboard
        </h2>
        <p className="text-[#615b51] max-w-md mx-auto text-sm leading-relaxed">
          Your personal progress, habit streaks, and consistency metrics are private and protected. Please sign in to view your dashboard.
        </p>
        <button
          onClick={() => openAuthModal("login")}
          className="bg-[#47624d] hover:bg-[#38503d] text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg transition-all"
        >
          Sign In to Access Dashboard
        </button>
      </div>
    );
  }

  // Calculate dynamic 126-day Consistency Landscape
  const now = new Date();
  const completionSet = new Set(stats.completionDates);
  const matrixDays = Array.from({ length: 126 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (125 - i));
    const dateStr = d.toISOString().split("T")[0];
    const isCompleted = completionSet.has(dateStr);
    return { dateStr, isCompleted };
  });

  const userName = user.firstName || user.email.split("@")[0];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* TOP BAR WITH SWITCHER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#f0eded] pb-6">
        <div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1b1c1c]">
            Dashboard
          </h1>
          <p className="text-sm text-[#615b51]">
            Your daily sanctuary overview and progress tracking.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="bg-[#f6f3f2] p-1.5 rounded-full flex items-center border border-[#e4e2e1]">
          <button
            onClick={() => setDashboardView("overview")}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              dashboardView === "overview"
                ? "bg-[#47624d] text-white shadow-sm"
                : "text-[#424842] hover:text-[#1b1c1c]"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setDashboardView("analytics")}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              dashboardView === "analytics"
                ? "bg-[#47624d] text-white shadow-sm"
                : "text-[#424842] hover:text-[#1b1c1c]"
            }`}
          >
            Growth Analytics
          </button>
        </div>
      </div>

      {dashboardView === "overview" ? (
        /* OVERVIEW VIEW */
        <div className="space-y-10 animate-fade-in">
          {/* GREETING HEADER */}
          <div className="space-y-1">
            <h2 className="font-serif-title text-3xl font-bold text-[#1b1c1c] flex items-center gap-2">
              Welcome back, {userName} 🌿
            </h2>
            <p className="text-sm italic text-[#745b25]">
              Today&apos;s Intention: &quot;I am becoming consistent in small actions.&quot;
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT 7 COLS: DAILY PRACTICE QUICK CHECKLIST */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-ambient border border-[#e4e2e1] space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
                  Daily Practice
                </h3>
                <span className="text-xs font-semibold text-[#737972] bg-[#f6f3f2] px-3 py-1 rounded-full">
                  {completedTasksCount} of {dailyTasks.length} completed
                </span>
              </div>

              <div className="space-y-3">
                {dailyTasks.length === 0 ? (
                  <div className="bg-[#f6f3f2] p-6 rounded-2xl text-center text-xs text-[#737972]">
                    No daily practice tasks scheduled. Create one in Daily Practice!
                  </div>
                ) : (
                  dailyTasks.slice(0, 5).map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleDashboardToggleTask(task.id)}
                      className={`w-full text-left p-4 rounded-2xl flex items-center justify-between transition-all border ${
                        task.completed
                          ? "bg-[#f6f3f2]/60 border-transparent text-[#737972]"
                          : "bg-white border-[#f0eded] hover:border-[#c2c8c0] text-[#1b1c1c]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                            task.completed
                              ? "bg-[#47624d] text-white"
                              : "border-2 border-[#c2c8c0] bg-white"
                          }`}
                        >
                          {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span
                          className={`text-xs sm:text-sm font-medium ${
                            task.completed ? "line-through" : ""
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <button
                onClick={() => setActiveTab("daily")}
                className="w-full text-center text-xs font-semibold text-[#47624d] hover:text-[#38503d] pt-2 flex items-center justify-center gap-1"
              >
                Open Full Tracker <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* RIGHT 5 COLS: PROGRESS & STATS */}
            <div className="lg:col-span-5 space-y-6">
              {/* CIRCULAR PROGRESS */}
              <div className="bg-white p-6 rounded-3xl shadow-ambient border border-[#e4e2e1] text-center space-y-4">
                <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#f6f3f2" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#47624d"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="251.3"
                      strokeDashoffset={251.3 * (1 - progressPercent / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-serif-title text-3xl font-bold text-[#1b1c1c]">
                      {progressPercent}%
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#737972]">
                      DAILY PROGRESS
                    </span>
                  </div>
                </div>
              </div>

              {/* STATS GRID */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-[#e4e2e1] text-center space-y-1">
                  <Flame className="w-5 h-5 text-[#745b25] mx-auto mb-1" />
                  <span className="font-serif-title text-3xl font-bold text-[#1b1c1c]">
                    {stats.currentStreak}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-[#737972] block">
                    DAY STREAK
                  </span>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-[#e4e2e1] text-center space-y-1">
                  <Smile className="w-5 h-5 text-[#47624d] mx-auto mb-1" />
                  <span className="font-serif-title text-2xl font-bold text-[#1b1c1c]">Calm</span>
                  <span className="text-[10px] font-mono uppercase text-[#737972] block">
                    CURRENT MOOD
                  </span>
                </div>
              </div>

              {/* FEATURED AFFIRMATION WIDGET */}
              {featuredAffirmation && (
                <div className="bg-white p-6 rounded-3xl border border-[#e4e2e1] shadow-ambient space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest text-[#745b25] uppercase font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#745b25]" /> FEATURED AFFIRMATION
                    </span>
                    <button
                      onClick={() => setActiveTab("affirmations")}
                      className="text-[10px] font-semibold text-[#47624d] hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <p className="font-serif-title text-base font-medium text-[#1b1c1c] italic leading-snug">
                    &quot;{featuredAffirmation.text}&quot;
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] bg-[#f6f3f2] px-2.5 py-0.5 rounded-full text-[#615b51]">
                      {featuredAffirmation.categoryName}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeakAffirmation(featuredAffirmation.text)}
                        className="p-1.5 rounded-xl bg-[#f6f3f2] hover:bg-[#e4eadf] text-[#47624d] text-xs font-medium flex items-center gap-1"
                        title="Listen to Affirmation"
                      >
                        Play 🔊
                      </button>

                      <button
                        onClick={() => {
                          toggleFavoriteAffirmation(featuredAffirmation.id);
                          showToast("Favorites updated");
                        }}
                        className="p-1.5 rounded-xl bg-[#f6f3f2] hover:bg-[#fce8e8] text-rose-500"
                        title="Toggle Favorite"
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* YESTERDAY'S REFLECTION CARD */}
              <div className="bg-[#f6f3f2] p-6 rounded-3xl border border-[#eae7e7] space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-[#745b25] uppercase font-bold">
                  YESTERDAY&apos;S REFLECTION
                </span>
                <p className="text-xs italic text-[#424842] leading-relaxed">
                  &quot;
                  {gratitudeEntries[0]?.content ||
                    "I noticed the morning light reflecting off the coffee cup..."}
                  &quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* GROWTH ANALYTICS VIEW */
        <div className="space-y-10 animate-fade-in">
          {/* TOP 3 STATS HIGHLIGHTS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-ambient border border-[#e4e2e1] space-y-2">
              <div className="flex items-center justify-between text-[#745b25]">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Streak</span>
                <Flame className="w-5 h-5" />
              </div>
              <div className="font-serif-title text-4xl font-bold text-[#1b1c1c]">
                {stats.currentStreak} Days
              </div>
              <p className="text-xs text-[#737972]">Longest streak: {stats.longestStreak} days</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-ambient border border-[#e4e2e1] space-y-2">
              <div className="flex items-center justify-between text-[#47624d]">
                <span className="text-xs font-semibold uppercase tracking-wider">Reflections Logged</span>
                <Calendar className="w-5 h-5" />
              </div>
              <div className="font-serif-title text-4xl font-bold text-[#1b1c1c]">
                {gratitudeEntries.length} Entries
              </div>
              <p className="text-xs text-[#737972]">Gratitude entries anchored</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-ambient border border-[#e4e2e1] space-y-2">
              <div className="flex items-center justify-between text-[#745b25]">
                <span className="text-xs font-semibold uppercase tracking-wider">Weekly Consistency</span>
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="font-serif-title text-4xl font-bold text-[#1b1c1c]">
                {stats.weeklyConsistency}%
              </div>
              <p className="text-xs text-[#737972]">Task execution alignment</p>
            </div>
          </div>

          {/* 6-MONTH ACTIVITY MATRIX (Dynamic Consistency Landscape) */}
          <div className="bg-white p-8 rounded-3xl shadow-ambient border border-[#e4e2e1] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-title text-xl font-bold text-[#1b1c1c]">
                  Consistency Landscape
                </h3>
                <p className="text-xs text-[#737972]">6-Month activity and manifestation habit heat matrix.</p>
              </div>
              <span className="text-xs font-semibold text-[#47624d] bg-[#5f7b65]/10 px-3 py-1 rounded-full">
                {stats.completionDates.length} Total Active Days
              </span>
            </div>

            {/* Matrix Columns */}
            <div
              className="grid gap-1 pt-2 overflow-x-auto"
              style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}
            >
              {matrixDays.map((item, i) => (
                <div
                  key={i}
                  className={`h-5 rounded-md transition-colors ${
                    item.isCompleted
                      ? "bg-[#47624d]"
                      : "bg-[#f6f3f2] border border-[#e4e2e1]"
                  }`}
                  title={`${item.dateStr}: ${item.isCompleted ? "Completed daily tasks" : "No completion record"}`}
                />
              ))}
            </div>
          </div>

          {/* CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* BAR CHART: WEEKLY RHYTHMS */}
            <div className="bg-white p-8 rounded-3xl shadow-ambient border border-[#e4e2e1] space-y-6">
              <h3 className="font-serif-title text-xl font-bold text-[#1b1c1c]">
                Weekly Execution Rhythm
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="day" stroke="#737972" fontSize={12} tickLine={false} />
                    <YAxis stroke="#737972" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1b1c1c",
                        color: "#fff",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="score" fill="#47624d" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AREA SPLINE CHART: EMOTIONAL RESONANCE */}
            <div className="bg-white p-8 rounded-3xl shadow-ambient border border-[#e4e2e1] space-y-6">
              <h3 className="font-serif-title text-xl font-bold text-[#1b1c1c]">
                Emotional Resonance & Calm
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={moodData}>
                    <defs>
                      <linearGradient id="colorAlign" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#745b25" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#745b25" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="week" stroke="#737972" fontSize={12} tickLine={false} />
                    <YAxis stroke="#737972" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1b1c1c",
                        color: "#fff",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="alignment"
                      stroke="#745b25"
                      fillOpacity={1}
                      fill="url(#colorAlign)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* UNLOCKED BADGES */}
          <div className="bg-[#fcf9f8] p-8 rounded-3xl border border-[#e4e2e1] space-y-4">
            <h3 className="font-serif-title text-xl font-bold text-[#1b1c1c] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#745b25]" /> Unlocked Milestones
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { title: "First Intent", desc: "Set initial profile" },
                { title: "7-Day Warrior", desc: "Completed 7 days streak" },
                { title: "Gratitude Anchor", desc: "Logged 10 entries" },
                { title: "Visionary", desc: "Created 5 vision cards" },
              ].map((badge) => (
                <div
                  key={badge.title}
                  className="bg-white p-4 rounded-2xl border border-[#e4e2e1] text-center space-y-1"
                >
                  <Sparkles className="w-6 h-6 text-[#745b25] mx-auto" />
                  <h4 className="text-xs font-bold text-[#1b1c1c]">{badge.title}</h4>
                  <p className="text-[10px] text-[#737972]">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
