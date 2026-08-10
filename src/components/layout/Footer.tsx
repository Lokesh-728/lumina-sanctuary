"use client";

import { useLuminaStore } from "@/store/useLuminaStore";

export default function Footer() {
  const { setActiveTab } = useLuminaStore();

  return (
    <footer className="bg-[#f6f3f2] border-t border-[#e4e2e1] py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-[1240px] mx-auto text-center space-y-6">
        {/* Brand Name */}
        <div className="space-y-2">
          <h3 className="font-serif-title text-3xl font-bold text-[#1b1c1c] tracking-tight">
            Lumina
          </h3>
          <p className="text-sm text-[#424842] max-w-md mx-auto">
            Bridging the gap between spiritual intention and psychological action.
          </p>
        </div>

        {/* Footer Navigation */}
        <nav aria-label="Footer Navigation" className="flex flex-wrap justify-center items-center gap-6 text-sm text-[#615b51]">
          <button
            onClick={() => setActiveTab("basic")}
            className="hover:text-[#1b1c1c] transition-colors focus:outline-none focus-visible:underline"
          >
            Basic Principles
          </button>
          <button
            onClick={() => setActiveTab("daily")}
            className="hover:text-[#1b1c1c] transition-colors focus:outline-none focus-visible:underline"
          >
            Daily Practice
          </button>
          <a
            href="#privacy"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#1b1c1c] transition-colors focus:outline-none focus-visible:underline"
          >
            Privacy Policy
          </a>
          <a
            href="#terms"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#1b1c1c] transition-colors focus:outline-none focus-visible:underline"
          >
            Terms of Service
          </a>
          <a
            href="#contact"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#1b1c1c] transition-colors focus:outline-none focus-visible:underline"
          >
            Contact Us
          </a>
        </nav>

        {/* Copyright */}
        <div className="pt-4 border-t border-[#e4e2e1]/60 text-xs text-[#737972]">
          © {new Date().getFullYear()} Lumina Personal Growth. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
