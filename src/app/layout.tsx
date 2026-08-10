import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumina | Personal Growth & Manifestation Sanctuary",
  description: "Bridge spiritual intention with psychological action through daily practice, habits, and neuro-alignment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F9F8F5] text-[#1b1c1c] font-sans">
        {children}
      </body>
    </html>
  );
}
