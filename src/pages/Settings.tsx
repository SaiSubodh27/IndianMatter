import { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="enterprise-page">
      <div className="enterprise-shell space-y-8">
        <div className="border-b border-gray-200 pb-6 dark:border-neutral-800">
          <h2 className="mb-2 font-headline text-4xl font-bold tracking-tight text-gray-900 dark:text-neutral-100">
            Settings
          </h2>
          <p className="text-lg text-gray-600 dark:text-neutral-400">
            Manage your account, preferences, and API access.
          </p>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Sidebar Nav */}
          <div className="w-full shrink-0 space-y-2 md:w-64">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full rounded-lg border px-4 py-3 text-left font-medium transition-colors ${activeTab === "profile" ? "border-gray-300 bg-gray-100 text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" : "border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"}`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">
                  person
                </span>
                Profile
              </div>
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full rounded-lg border px-4 py-3 text-left font-medium transition-colors ${activeTab === "notifications" ? "border-gray-300 bg-gray-100 text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" : "border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"}`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">
                  notifications
                </span>
                Notifications
              </div>
            </button>
            <button
              onClick={() => setActiveTab("api")}
              className={`w-full rounded-lg border px-4 py-3 text-left font-medium transition-colors ${activeTab === "api" ? "border-gray-300 bg-gray-100 text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" : "border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"}`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">key</span>
                API Keys
              </div>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="enterprise-panel space-y-6 p-8">
                <h3 className="border-b border-gray-200 pb-4 font-headline text-2xl font-bold text-gray-900 dark:border-neutral-800 dark:text-neutral-100">
                  Profile Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800">
                      <span className="material-symbols-outlined text-4xl text-gray-500 dark:text-neutral-400">
                        person
                      </span>
                    </div>
                    <button className="enterprise-button-secondary px-4 py-2 text-sm">
                      Change Avatar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-neutral-400">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Sai Subodh"
                        className="enterprise-input"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-neutral-400">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="sai@indianmatter.ai"
                        className="enterprise-input"
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-neutral-400">
                      Change Password
                    </label>
                    <input
                      type="password"
                      placeholder="New Password"
                      className="enterprise-input mb-2"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="enterprise-input"
                    />
                  </div>
                </div>
                <div className="pt-6">
                  <button className="enterprise-button-primary px-6 py-2.5 text-sm font-bold">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="enterprise-panel space-y-6 p-8">
                <h3 className="border-b border-gray-200 pb-4 font-headline text-2xl font-bold text-gray-900 dark:border-neutral-800 dark:text-neutral-100">
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 dark:border-neutral-800 dark:bg-neutral-950">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-neutral-100">
                        Job Completion Alerts
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        Get notified when long-running DFT or batch predictions
                        finish.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-5 w-5 cursor-pointer accent-gray-900 dark:accent-white"
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 dark:border-neutral-800 dark:bg-neutral-950">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-neutral-100">
                        Platform Updates
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        News about new models (ALIGNN, M3GNet) and database
                        additions.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-5 w-5 cursor-pointer accent-gray-900 dark:accent-white"
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 dark:border-neutral-800 dark:bg-neutral-950">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-neutral-100">
                        Security Alerts
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        Important notices about your account security and
                        logins.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      disabled
                      className="h-5 w-5 cursor-not-allowed opacity-50 accent-gray-900 dark:accent-white"
                    />
                  </label>
                </div>
              </div>
            )}

            {activeTab === "api" && (
              <div className="enterprise-panel space-y-6 p-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-neutral-800">
                  <h3 className="font-headline text-2xl font-bold text-gray-900 dark:text-neutral-100">
                    API Management
                  </h3>
                  <button className="enterprise-button-primary px-4 py-2 text-xs uppercase tracking-widest">
                    Generate New Key
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-neutral-100">
                          Production Key
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-neutral-400">
                          Created: July 1, 2026 &bull; Last used: Today
                        </p>
                      </div>
                      <button className="text-xs font-bold uppercase tracking-widest text-rose-700 hover:text-rose-900 dark:text-rose-300 dark:hover:text-rose-200">
                        Revoke
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 truncate rounded border border-gray-200 bg-gray-100 p-2 font-mono text-xs text-gray-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
                        im_live_9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p
                      </code>
                      <button
                        className="rounded bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                        title="Copy"
                      >
                        <span className="material-symbols-outlined text-sm">
                          content_copy
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
                    <span className="material-symbols-outlined text-gray-700 dark:text-neutral-300">
                      info
                    </span>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Use this key to authenticate with the IndianMatter API.
                      Pass it in the{" "}
                      <code className="text-primary font-mono">
                        Authorization: Bearer
                      </code>{" "}
                      header. See the{" "}
                      <a
                        href="/api-docs"
                        className="text-primary hover:underline"
                      >
                        API Documentation
                      </a>{" "}
                      for details.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
