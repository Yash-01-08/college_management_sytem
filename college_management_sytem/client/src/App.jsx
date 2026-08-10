import React, { useState, useEffect } from "react";
import {
  Server,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Zap,
  Globe,
  Shield,
  Layers,
  Code2,
  Terminal,
  Cpu,
  Database,
  ArrowUpRight,
} from "lucide-react";

export default function App() {
  const [backendStatus, setBackendStatus] = useState(null);
  const [backendHealth, setBackendHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latency, setLatency] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchBackendStatus = async () => {
    setLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      // Primary status call
      const statusRes = await fetch("http://localhost:5000/api/status");
      if (!statusRes.ok) throw new Error(`HTTP error! status: ${statusRes.status}`);
      const statusData = await statusRes.json();

      // Health call
      const healthRes = await fetch("http://localhost:5000/api/health");
      const healthData = await healthRes.json();

      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setBackendStatus(statusData);
      setBackendHealth(healthData);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to connect to backend:", err);
      setError("Unable to reach Express Backend on http://localhost:5000");
      setBackendStatus(null);
      setBackendHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendStatus();
    const interval = setInterval(fetchBackendStatus, 10000); // Auto ping every 10 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="w-full glass-card rounded-none border-b border-slate-800 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
                CampusPulse <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700/50">Full-Stack Architecture</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Smart Campus Platform • DevFusion 4.O</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchBackendStatus}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto px-6 py-10 space-y-8 flex-1">
        {/* Backend Connection Banner */}
        <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
                <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>Real-Time Node.js Express Server Diagnostics</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Backend Connection Status
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                React Frontend (<span className="text-indigo-400 font-semibold">Port 3000</span>) is connected to Express Backend Server (<span className="text-emerald-400 font-semibold">Port 5000</span>) via CORS API bridge.
              </p>
            </div>

            {/* Live Connection Badge */}
            <div className="glass-card p-5 border-2 border-slate-800 bg-slate-900/90 text-center space-y-2 min-w-[200px] shrink-0">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live System Status</div>
              {loading && !backendStatus ? (
                <div className="flex items-center justify-center gap-2 text-amber-400 text-sm font-bold py-1">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Connecting...
                </div>
              ) : backendStatus ? (
                <div className="flex items-center justify-center gap-2 text-emerald-400 text-lg font-extrabold py-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span>ONLINE</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-rose-500 text-lg font-extrabold py-1">
                  <XCircle className="w-6 h-6 text-rose-500" />
                  <span>OFFLINE</span>
                </div>
              )}

              <div className="text-[11px] text-slate-400 font-medium">
                Last checked: {lastChecked || "Just now"}
              </div>
            </div>
          </div>
        </div>

        {/* System Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>API Latency</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">
              {latency !== null ? `${latency} ms` : "--"}
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">Response Time (HTTP GET)</div>
          </div>

          <div className="glass-card p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>Server Uptime</span>
              <Activity className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">
              {backendStatus?.uptimeSeconds !== undefined ? `${backendStatus.uptimeSeconds}s` : "--"}
            </div>
            <div className="text-[10px] text-indigo-400 font-semibold">Express Node Process Uptime</div>
          </div>

          <div className="glass-card p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>Memory Usage</span>
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">
              {backendHealth?.memoryUsageMB ? `${backendHealth.memoryUsageMB} MB` : "--"}
            </div>
            <div className="text-[10px] text-purple-400 font-semibold">V8 Heap Allocation</div>
          </div>

          <div className="glass-card p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>Database Engine</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">
              {backendStatus?.database?.connected ? "CONNECTED" : "Standby"}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold">MongoDB / Prisma Repository</div>
          </div>
        </div>

        {/* Live Microservice Health Checklist */}
        {backendStatus?.services && (
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" /> Backend Microservices Status
            </h3>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {backendStatus.services.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">{s.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2-Developer Architecture Section */}
        <div className="glass-card p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-purple-400" /> 2-Developer Full-Stack Collaboration Architecture
            </h3>
            <p className="text-xs text-slate-400">Contracts and division of work for parallel backend & frontend development</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-indigo-300 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" /> Developer 1 (You) • Backend Lead
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-900 text-indigo-200">Express / Node</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>REST API Routes (`/api/status`, `/api/auth`, `/api/attendance`, `/api/assignments`)</li>
                <li>JWT / Cookie Sessions & Role Middleware</li>
                <li>MongoDB / PostgreSQL Schema & Repositories (`server/index.js`)</li>
                <li>OpenAPI Documentation & CORS Security</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-purple-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" /> Developer 2 (Friend) • Frontend Lead
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900 text-purple-200">React + Tailwind</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>React App Shell (`client/src/App.jsx`)</li>
                <li>4 Role Dashboards (Student, Faculty, Coordinator, Admin)</li>
                <li>QR Code Generator & Scanner UI Interface</li>
                <li>Spotlight Search (Ctrl+K) & Campus AI Chatbot widget</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Live Payload Viewer */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" /> Live Response JSON from GET <code className="text-emerald-400 bg-slate-900 px-2 py-0.5 rounded font-mono text-xs">/api/status</code>
            </h3>
            <span className="text-xs text-slate-400 font-mono">http://localhost:5000/api/status</span>
          </div>

          <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-64 leading-relaxed">
            {backendStatus ? JSON.stringify(backendStatus, null, 2) : error || "Waiting for response..."}
          </pre>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 py-6 text-center text-xs text-slate-500 font-medium">
        CampusPulse Smart Campus Platform • DevFusion 4.O Hackathon Solution • Connected React & Express Server
      </footer>
    </div>
  );
}
