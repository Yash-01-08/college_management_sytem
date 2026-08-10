import "@/styles/globals.css";
import React from "react";

export const metadata = {
  title: "CampusPulse AI - Smart Campus Management Platform",
  description: "Centralized Smart Campus Platform connecting Students, Faculty, and Admins",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
