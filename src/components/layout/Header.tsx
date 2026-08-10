"use client";

import { useState } from "react";
import { useLuminaStore, NavTab } from "@/store/useLuminaStore";
import { Menu, X, Bell, User as UserIcon, Sparkles, LogOut, LogIn } from "lucide-react";

export default function Header() {
  const {
    activeTab,
    setActiveTab,
    user,
    logout,
    openAuthModal,
    showToast,
  } = useLuminaStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; tab: NavTab }[] = [
    { label: "Basic", tab: "basic" },
    { label: "Daily Practice", tab: "daily" },
    { label: "Affirmations", tab: "affirmations" },
    { label: "Techniques", tab: "techniques" },
    { label: "Journal", tab: "journal" },
    { label: "Vision Board", tab: "vision" },
    { label: "Dashboard", tab: "dashboard" },
  ];

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    logout();
    showToast("Signed out safely.");
  };

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleTabClick("landing")}
          className="flex items-center gap-2 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47624d] rounded-lg p-1"
          aria-label="Lumina Home"
        >
          <span className="font-serif-title text-2xl sm:text-3xl font-bold tracking-tight text-[#1b1c1c] group-hover:text-[#47624d] transition-colors">
            Lumina
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-5 lg:space-x-7" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleTabClick(item.tab)}
                className={`relative py-1 text-sm font-medium transition-colors hover:text-[#1b1c1c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47624d] rounded-md px-1 ${
                  isActive
                    ? "text-[#1b1c1c] font-semibold"
                    : "text-[#616660]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#47624d] rounded-full animate-fade-in" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Auth Buttons & Profile */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3 bg-[#eae7e7]/70 p-1.5 pl-3 rounded-full border border-[#e4e2e1]">
              <span className="text-xs font-semibold text-[#1b1c1c]">
                Hi, {user.firstName || user.email.split("@")[0]}
              </span>
              <button
                onClick={() => handleTabClick("profile")}
                className="p-1.5 rounded-full bg-white text-[#47624d] hover:bg-[#47624d] hover:text-white transition-all shadow-sm"
                title="Future Self Profile"
              >
                <UserIcon className="w-4 h-4" />
              </button>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-full text-[#737972] hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => openAuthModal("login")}
                className="text-xs font-semibold text-[#47624d] hover:text-[#38503d] px-4 py-2 rounded-full border border-[#47624d]/30 hover:border-[#47624d] transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="bg-[#47624d] hover:bg-[#38503d] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ffdb99]" />
                <span>Get Started</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#1b1c1c] hover:bg-[#eae7e7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47624d]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F9F8F5]/95 backdrop-blur-xl border-b border-[#e4e2e1] px-4 pt-2 pb-6 space-y-3 animate-fade-in shadow-lg">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleTabClick(item.tab)}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? "bg-[#47624d] text-white font-semibold shadow-sm"
                    : "text-[#424842] hover:bg-[#eae7e7]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#e4e2e1] space-y-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-700 text-center py-3 rounded-xl font-medium shadow-sm flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({user.email})</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    openAuthModal("login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#eae7e7] text-[#1b1c1c] text-center py-3 rounded-xl font-medium shadow-sm flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => {
                    openAuthModal("register");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#47624d] text-white text-center py-3 rounded-xl font-medium shadow-sm flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#ffdb99]" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
