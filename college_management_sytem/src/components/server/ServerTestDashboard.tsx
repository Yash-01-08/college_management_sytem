"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Server,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FolderTree,
  FileCode,
  Folder,
  Send,
  Zap,
  Cpu,
  Clock,
  ChevronRight,
  ChevronDown,
  Globe,
  Terminal,
  Layers,
} from "lucide-react";

interface ServerStatus {
  connected: boolean;
  serverType?: string;
  uptimeSeconds?: number;
  nodeVersion?: string;
  memoryUsageMB?: number;
  latencyMs?: number;
  timestamp?: string;
  rawResponse?: any;
}

interface FileNode {
  name: string;
  type: "directory" | "file";
  path: string;
  sizeBytes?: number;
  extension?: string;
  children?: FileNode[];
}

export const ServerTestDashboard: React.FC = () => {
  const [status, setStatus] = useState<ServerStatus>({ connected: false });
  const [loading, setLoading] = useState<boolean>(true);
  const [testPayload, setTestPayload] = useState<string>(
    JSON.stringify(
      {
        message: "Axios Frontend-to-Backend Connectivity Test",
        clientLib: "axios",
        timestamp: new Date().toISOString(),
      },
      null,
      2
    )
  );
  const [postResponse, setPostResponse] = useState<any>(null);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("/api/health");
  const [endpointResult, setEndpointResult] = useState<any>(null);
  const [endpointLoading, setEndpointLoading] = useState<boolean>(false);

  // Ping backend server using Axios
  const checkServerHealth = async () => {
    setLoading(true);
    const startTime = performance.now();
    try {
      // Axios GET request to backend health check
      let res;
      try {
        res = await axios.get("http://localhost:5000/api/health", { timeout: 3000 });
      } catch {
        res = await axios.get("/api/health", { timeout: 3000 });
      }

      const endTime = performance.now();
      const data = res.data;

      setStatus({
        connected: true,
        serverType: data.server || "Node.js Express / Next.js Backend",
        uptimeSeconds: data.uptimeSeconds,
        nodeVersion: data.nodeVersion,
        memoryUsageMB: data.memoryUsageMB,
        latencyMs: Math.round(endTime - startTime),
        timestamp: data.timestamp,
        rawResponse: data,
      });
    } catch (err: any) {
      setStatus({
        connected: false,
        rawResponse: { error: err.message || "Failed to reach Node.js server via Axios" },
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch file structure from Node.js backend using Axios
  const fetchFileStructure = async () => {
    try {
      let res;
      try {
        res = await axios.get("http://localhost:5000/api/file-structure", { timeout: 3000 });
      } catch {
        res = await axios.get("/api/file-structure", { timeout: 3000 });
      }

      if (res.data && res.data.success && res.data.structure) {
        setFileTree(res.data.structure);
      }
    } catch (err) {
      console.error("Failed to load file structure via Axios", err);
    }
  };

  useEffect(() => {
    checkServerHealth();
    fetchFileStructure();
  }, []);

  // Send POST payload via Axios
  const handleTestPostPayload = async () => {
    setPostLoading(true);
    const startTime = performance.now();
    try {
      let parsedBody;
      try {
        parsedBody = JSON.parse(testPayload);
      } catch {
        parsedBody = { rawText: testPayload };
      }

      let res;
      try {
        res = await axios.post("http://localhost:5000/api/server-test", parsedBody, {
          headers: { "Content-Type": "application/json" },
          timeout: 4000,
        });
      } catch {
        res = await axios.post("/api/server-test", parsedBody, {
          headers: { "Content-Type": "application/json" },
          timeout: 4000,
        });
      }

      const endTime = performance.now();
      setPostResponse({
        httpStatus: res.status,
        roundtripMs: Math.round(endTime - startTime),
        headers: res.headers,
        body: res.data,
      });
    } catch (err: any) {
      setPostResponse({
        error: err.message || "Failed to execute POST request via Axios",
      });
    } finally {
      setPostLoading(false);
    }
  };

  // Execute endpoint GET test via Axios
  const testEndpoint = async (pathStr: string) => {
    setSelectedEndpoint(pathStr);
    setEndpointLoading(true);
    const startTime = performance.now();
    try {
      let res;
      try {
        res = await axios.get(`http://localhost:5000${pathStr}`, { timeout: 4000 });
      } catch {
        res = await axios.get(pathStr, { timeout: 4000 });
      }
      const endTime = performance.now();
      setEndpointResult({
        endpoint: pathStr,
        httpStatus: res.status,
        latencyMs: Math.round(endTime - startTime),
        data: res.data,
      });
    } catch (err: any) {
      setEndpointResult({
        endpoint: pathStr,
        error: err.message,
      });
    } finally {
      setEndpointLoading(false);
    }
  };

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folderPath]: !prev[folderPath] }));
  };

  const getFileBadge = (filename: string, filePath: string) => {
    if (filePath.includes("server.js")) return { label: "Express Server", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" };
    if (filePath.includes("/api/")) return { label: "Node API Route", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" };
    if (filePath.includes("/components/")) return { label: "React Component", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" };
    if (filePath.includes("/app/")) return { label: "React Page", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" };
    if (filePath.includes("/lib/")) return { label: "Database / Auth", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
    return { label: "Config/Data", color: "bg-slate-500/10 text-slate-500 border-slate-500/20" };
  };

  const renderTree = (node: FileNode, level = 0) => {
    const isFolder = node.type === "directory";
    const isOpen = expandedFolders[node.path] !== false;
    const badge = getFileBadge(node.name, node.path);

    return (
      <div key={node.path} style={{ paddingLeft: `${level * 14}px` }} className="py-0.5">
        {isFolder ? (
          <div>
            <button
              onClick={() => toggleFolder(node.path)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors w-full text-left"
            >
              {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              <Folder className="w-4 h-4 text-amber-500 fill-amber-500/20" />
              <span>{node.name}/</span>
              {node.children && (
                <span className="text-[10px] text-slate-400 font-normal">({node.children.length})</span>
              )}
            </button>
            {isOpen && node.children && (
              <div className="border-l border-slate-200 dark:border-slate-800 ml-3 pl-1">
                {node.children.map((child) => renderTree(child, level + 1))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-mono text-[11px]">{node.name}</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${badge.color}`}>
              {badge.label}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
              <span>Powered by Axios & Node.js Express</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Axios Server Connection & File Structure Tester
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-2xl">
              Verifies real-time communication between React Frontend and Node.js Backend using Axios client.
            </p>
          </div>

          <button
            onClick={checkServerHealth}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Test Axios Ping</span>
          </button>
        </div>

        {/* Live Metrics */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status.connected ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
              {status.connected ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Node.js Server</div>
              <div className={`text-base font-extrabold ${status.connected ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {loading ? "Testing..." : status.connected ? "Connected" : "Disconnected"}
              </div>
            </div>
          </div>

          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Axios Ping Latency</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {status.connected ? `${status.latencyMs} ms` : "N/A"}
              </div>
            </div>
          </div>

          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Node.js Version</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {status.nodeVersion || "v24.x"}
              </div>
            </div>
          </div>

          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Server Uptime</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {status.uptimeSeconds !== undefined ? `${status.uptimeSeconds}s` : "Active"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Axios API Testers */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Axios GET API Requests</h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600">axios.get()</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { name: "Health Check", path: "/api/health" },
                { name: "Server Test", path: "/api/server-test?echo=AxiosTestPayload" },
                { name: "Users List", path: "/api/users" },
                { name: "File Structure", path: "/api/file-structure" },
                { name: "Admin Analytics", path: "/api/admin" },
                { name: "Events API", path: "/api/events" },
              ].map((ep) => (
                <button
                  key={ep.path}
                  onClick={() => testEndpoint(ep.path)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    selectedEndpoint === ep.path
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                      : "glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="font-bold">{ep.name}</div>
                  <div className={`text-[10px] font-mono truncate ${selectedEndpoint === ep.path ? "text-indigo-100" : "text-slate-400"}`}>
                    {ep.path}
                  </div>
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 text-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
                <span className="text-indigo-400">Axios Endpoint: {selectedEndpoint}</span>
                {endpointResult && (
                  <span className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      HTTP {endpointResult.httpStatus || 200} OK
                    </span>
                    <span className="text-amber-400 text-[10px]">{endpointResult.latencyMs} ms</span>
                  </span>
                )}
              </div>
              <pre className="text-xs font-mono overflow-x-auto max-h-60 p-2 text-emerald-400 leading-relaxed">
                {endpointLoading
                  ? "// Fetching data via axios.get()..."
                  : endpointResult
                  ? JSON.stringify(endpointResult.data || endpointResult, null, 2)
                  : "// Click an endpoint above to send an Axios GET request"}
              </pre>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Axios POST Request Tester</h3>
              </div>
              <span className="text-[11px] font-semibold text-purple-600">axios.post()</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
                JSON Body Payload:
              </label>
              <textarea
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={handleTestPostPayload}
              disabled={postLoading}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-2"
            >
              <Send className={`w-4 h-4 ${postLoading ? "animate-pulse" : ""}`} />
              <span>{postLoading ? "Sending via Axios..." : "Send Axios POST Request to Backend"}</span>
            </button>

            {postResponse && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-purple-400">Response Status: {postResponse.httpStatus || 200}</span>
                  <span className="text-amber-400">{postResponse.roundtripMs} ms</span>
                </div>
                <pre className="text-xs font-mono overflow-x-auto max-h-48 text-indigo-300 leading-relaxed">
                  {JSON.stringify(postResponse.body || postResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: File Structure Tree */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Project File Structure</h3>
              </div>
              <button
                onClick={fetchFileStructure}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3 max-h-[520px] overflow-y-auto font-sans">
              {fileTree ? (
                renderTree(fileTree)
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 space-y-2">
                  <RefreshCw className="w-5 h-5 mx-auto animate-spin text-amber-500" />
                  <div>Loading file structure tree via Axios...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
