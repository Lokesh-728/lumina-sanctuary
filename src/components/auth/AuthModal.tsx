"use client";

import { useState } from "react";
import { useLuminaStore } from "@/store/useLuminaStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Lock, Mail, User as UserIcon, ArrowRight, CheckCircle, Trash2, AlertTriangle } from "lucide-react";

import { hydrateUserData } from "@/services/dataHydration";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authMode,
    openAuthModal,
    setAuthData,
    showToast,
    user,
    accessToken,
    logout,
  } = useLuminaStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
    const endpoint = authMode === "login" ? `${apiUrl}/auth/login` : `${apiUrl}/auth/register`;

    const payload =
      authMode === "login"
        ? { email, password }
        : { email, password: password || undefined, firstName, lastName };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsgString = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message;
        throw new Error(errorMsgString || "Operation failed. Please check details.");
      }

      setAuthData(data.user, data.tokens.accessToken);
      await hydrateUserData(data.tokens.accessToken);
      showToast(authMode === "login" ? "Welcome back to your Sanctuary!" : "Instant registration complete! Welcome.");
      closeAuthModal();
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
    } catch (err: any) {
      setErrorMsg(err.message || "Could not connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

    try {
      const res = await fetch(`${apiUrl}/users/me`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete account.");
      }

      logout();
      showToast("Your account & all associated data have been permanently deleted.");
      setShowDeleteConfirm(false);
      closeAuthModal();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#F9F8F5] rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl border border-[#e4e2e1] relative overflow-hidden"
        >
          {/* Top Background Glow Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#47624d] to-transparent" />

          {/* Close Button */}
          <button
            onClick={() => {
              setShowDeleteConfirm(false);
              closeAuthModal();
            }}
            className="absolute top-5 right-5 p-2 text-[#737972] hover:text-[#1b1c1c] rounded-full hover:bg-[#eae7e7] transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Delete Account Confirmation View */}
          {showDeleteConfirm ? (
            <div className="space-y-5 text-center py-2 animate-fade-in">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-title text-2xl font-bold text-red-600">Delete Account?</h3>
                <p className="text-xs text-[#615b51] mt-2">
                  This action is permanent and cannot be undone. All your journal entries, vision board items, and daily habit stats will be deleted from MongoDB.
                </p>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-[#eae7e7] hover:bg-[#dedada] text-[#1b1c1c] text-xs font-semibold rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-2xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isLoading ? "Deleting..." : "Permanently Delete"}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ffdb99]/40 border border-[#745b25]/20 text-[#745b25] text-xs font-semibold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" /> LUMINA SANCTUARY
                </div>
                <h2 className="font-serif-title text-3xl font-bold text-[#1b1c1c]">
                  {authMode === "login" ? "Welcome Back" : "Instant Sign Up"}
                </h2>
                <p className="text-xs text-[#615b51]">
                  {authMode === "login"
                    ? "Enter your credentials to log into your account."
                    : "No complex authentication required during registration. Get started instantly!"}
                </p>
              </div>

              {/* Switcher Pills */}
              <div className="bg-[#eae7e7] p-1 rounded-2xl flex items-center border border-[#e4e2e1]">
                <button
                  type="button"
                  onClick={() => {
                    openAuthModal("login");
                    setErrorMsg(null);
                  }}
                  className={`w-1/2 py-2 text-xs font-semibold rounded-xl transition-all ${
                    authMode === "login"
                      ? "bg-white text-[#1b1c1c] shadow-sm"
                      : "text-[#737972] hover:text-[#1b1c1c]"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    openAuthModal("register");
                    setErrorMsg(null);
                  }}
                  className={`w-1/2 py-2 text-xs font-semibold rounded-xl transition-all ${
                    authMode === "register"
                      ? "bg-white text-[#1b1c1c] shadow-sm"
                      : "text-[#737972] hover:text-[#1b1c1c]"
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Error Message Alert */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-2xl">
                  {errorMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === "register" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1b1c1c] mb-1">
                        First Name
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737972]" />
                        <input
                          type="text"
                          placeholder="Lokesh"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full bg-white text-xs text-[#1b1c1c] pl-10 pr-3 py-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1b1c1c] mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Panchal"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-white text-xs text-[#1b1c1c] px-3.5 py-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1b1c1c] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737972]" />
                    <input
                      type="email"
                      required
                      placeholder="lokesh@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white text-xs text-[#1b1c1c] pl-10 pr-3.5 py-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1b1c1c] mb-1">
                    Password {authMode === "register" && <span className="text-[10px] text-[#737972] font-normal">(Optional)</span>}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737972]" />
                    <input
                      type="password"
                      required={authMode === "login"}
                      placeholder={authMode === "login" ? "••••••••••••" : "Optional (Default pass auto-generated)"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white text-xs text-[#1b1c1c] pl-10 pr-3.5 py-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#47624d] hover:bg-[#38503d] text-white text-xs font-semibold py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>{authMode === "login" ? "Sign In to Sanctuary" : "Register Instantly"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Delete Account Link if logged in */}
              {user && (
                <div className="pt-2 border-t border-[#e4e2e1] text-center">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-xs text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete My User Account</span>
                  </button>
                </div>
              )}

              {/* Bottom Security Badge */}
              <div className="text-center flex items-center justify-center gap-1.5 text-[10px] text-[#737972]">
                <CheckCircle className="w-3.5 h-3.5 text-[#47624d]" />
                <span>Instant single-step registration connected to MongoDB</span>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
