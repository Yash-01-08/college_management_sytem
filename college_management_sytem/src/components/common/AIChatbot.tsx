"use client";

import React, { useState } from "react";
import { Sparkles, Send, X, Bot, User, Loader2 } from "lucide-react";

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: "bot" | "user";
  text: string;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am your Campus AI Assistant. Ask me anything about attendance rules, placement drives, event QR passes, or library timings!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply || "Sorry, I couldn't process that request." }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", text: "Attendance Policy: Minimum 75% attendance is required per subject. You can mark attendance on the Attendance page by scanning the faculty QR code." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 glass-card shadow-2xl border border-indigo-200 dark:border-indigo-800 animate-in fade-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="p-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h4 className="text-xs font-bold">Campus AI Assistant</h4>
            <span className="text-[10px] text-indigo-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Online • Hackathon Edition
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg text-white/80 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="p-3 max-h-72 overflow-y-auto space-y-3 text-xs">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === "user" ? "bg-indigo-600 text-white" : "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
              }`}
            >
              {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`p-2.5 rounded-xl max-w-[80%] leading-relaxed ${
                m.sender === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 items-center text-slate-400 text-[11px]">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
            <span>AI Assistant thinking...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask AI campus FAQ..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl focus:outline-none text-slate-900 dark:text-white"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
