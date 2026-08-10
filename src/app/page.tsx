"use client";

import { useLuminaStore } from "@/store/useLuminaStore";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LandingView from "@/components/views/LandingView";
import BasicView from "@/components/views/BasicView";
import DailyPracticeView from "@/components/views/DailyPracticeView";
import TechniquesView from "@/components/views/TechniquesView";
import JournalView from "@/components/views/JournalView";
import VisionBoardView from "@/components/views/VisionBoardView";
import DashboardView from "@/components/views/DashboardView";
import ProfileView from "@/components/views/ProfileView";
import AffirmationsView from "@/components/views/AffirmationsView";
import AuthModal from "@/components/auth/AuthModal";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

import { useEffect } from "react";
import { hydrateUserData } from "@/services/dataHydration";

export default function Home() {
  const { activeTab, toastMessage, clearToast, accessToken, user } = useLuminaStore();

  useEffect(() => {
    if (user && accessToken) {
      hydrateUserData(accessToken);
    }
  }, [user, accessToken]);

  const renderActiveView = () => {
    switch (activeTab) {
      case "landing":
        return <LandingView />;
      case "basic":
      case "learn":
      case "mistakes":
        return <BasicView />;
      case "daily":
        return <DailyPracticeView />;
      case "techniques":
        return <TechniquesView />;
      case "journal":
        return <JournalView />;
      case "vision":
        return <VisionBoardView />;
      case "dashboard":
        return <DashboardView />;
      case "profile":
        return <ProfileView />;
      case "affirmations":
        return <AffirmationsView />;
      default:
        return <LandingView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F5]">
      {/* Global Auth Modal */}
      <AuthModal />

      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-4 z-50 bg-[#47624d] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/20 text-xs font-medium"
          >
            <CheckCircle2 className="w-4 h-4 text-[#ffdb99]" />
            <span>{toastMessage}</span>
            <button
              onClick={clearToast}
              className="ml-2 text-white/80 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Semantic Glass Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Semantic Footer */}
      <Footer />
    </div>
  );
}
