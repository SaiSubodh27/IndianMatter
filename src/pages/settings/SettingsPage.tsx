/**
 * SettingsPage — STATIC/MOCK page.
 * Route: /app/settings. Static form; save shows an alert. No backend call.
 */
import { useState } from "react";
import { Settings, Key } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Dr. Srinivasan");
  const [email, setEmail] = useState("researcher@lab.edu");
  const [lab, setLab] = useState("Solid State Ionics Laboratory");
  const [apiKey, setApiKey] = useState("mp_live_9481940184029481");

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1">
          <Settings size={14} /> Workspace Configuration
        </div>
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]">
          Researcher Settings
        </h1>
        <p className="text-sm text-[#6C737E] max-w-2xl mt-1">
          Manage your laboratory affiliation, API access tokens, units of measurement, and cluster credentials.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-4">
          <h3 className="font-headline font-bold text-lg text-[#1E2227]">Researcher Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#1E2227] mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2.5 outline-none focus:border-[#F1641D]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1E2227] mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2.5 outline-none focus:border-[#F1641D]"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-[#1E2227] mb-1.5">Laboratory Affiliation</label>
            <input
              type="text"
              value={lab}
              onChange={(e) => setLab(e.target.value)}
              className="w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl px-3 py-2.5 outline-none focus:border-[#F1641D]"
            />
          </div>
        </div>

        {/* API Tokens Card */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-4">
          <h3 className="font-headline font-bold text-lg text-[#1E2227]">API Credentials</h3>
          <p className="text-xs text-[#6C737E]">
            Connect your Materials Project API Key to enable automated cross-federation querying.
          </p>
          <div>
            <label className="block font-semibold text-[#1E2227] mb-1.5">Materials Project API Key</label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C929C]" size={15} />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-[#FAF4EE]/50 border border-[#E9DFD4] rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono outline-none focus:border-[#F1641D]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => alert("Settings saved successfully.")}
            className="px-6 py-2.5 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F] transition-all shadow-soft"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
