import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success
        console.log("Login successful:", data);
        localStorage.setItem(
          "userProfile",
          JSON.stringify({
            name: email.split("@")[0], // Fallback name
            email: email,
            picture: "https://ui-avatars.com/api/?name=" + email.split("@")[0],
          }),
        );
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        // Error from backend
        setError(data.detail || "Authentication failed");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      // Typically, you send codeResponse.access_token to your backend to verify
      // For now, we will simulate a success login flow and enter dashboard
      console.log("Google Login Success:", codeResponse);

      // Let's create a quick route or simulate here
      try {
        // Fetch user profile info from Google API
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${codeResponse.access_token}` },
          },
        );
        const userInfo = await userInfoResponse.json();
        console.log("Google User Info: ", userInfo);
        localStorage.setItem(
          "userProfile",
          JSON.stringify({
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
          }),
        );
        // Automatically create user in FirstDb or mock login
        // For now, allow direct entry
        navigate("/dashboard");
      } catch (err) {
        setError("Error fetching Google profile");
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      setError("Google Login failed");
    },
  });

  return (
    <div className="enterprise-page selection:bg-gray-900 selection:text-white dark:selection:bg-white dark:selection:text-gray-900">
      <main className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-lg">
          <div className="mb-8 flex flex-col items-center text-center">
            <Link
              to="/"
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm transition-transform hover:scale-105 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
            >
              <span className="material-symbols-outlined text-3xl font-bold">
                science
              </span>
            </Link>
            <h1 className="font-headline text-3xl font-bold tracking-tight text-gray-900 dark:text-neutral-100">
              IndianMatter
            </h1>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-neutral-400 font-label">
              Scientific Intelligence Portal
            </p>
          </div>

          <div className="enterprise-panel p-8 md:p-10">
            <div className="mb-8">
              <h2 className="mb-1 font-headline text-2xl font-semibold text-gray-900 dark:text-neutral-100">
                Welcome Back
              </h2>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Access the advanced materials repository
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSignIn}>
              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  className="font-label text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400"
                  htmlFor="email"
                >
                  Research Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 transition-colors pointer-events-none group-focus-within:text-gray-700 dark:text-neutral-500 dark:group-focus-within:text-neutral-200">
                    <span className="material-symbols-outlined text-xl">
                      alternate_email
                    </span>
                  </div>
                  <input
                    className="enterprise-input pl-12 text-sm"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@institution.edu"
                    type="email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    className="font-label text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400"
                    htmlFor="password"
                  >
                    Access Key
                  </label>
                  <a
                    className="text-[10px] font-label uppercase tracking-widest text-gray-600 transition-colors hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    href="#"
                  >
                    Forgot Key?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 transition-colors pointer-events-none group-focus-within:text-gray-700 dark:text-neutral-500 dark:group-focus-within:text-neutral-200">
                    <span className="material-symbols-outlined text-xl">
                      lock
                    </span>
                  </div>
                  <input
                    className="enterprise-input pl-12 text-sm"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    type="password"
                    required
                  />
                </div>
              </div>

              {/* Primary Action */}
              <button
                className="enterprise-button-primary w-full py-4 font-headline font-bold disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Sign In"}
                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-neutral-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] font-label">
                <span className="bg-transparent px-4 text-gray-400 dark:text-neutral-500">
                  OR PROTOCOL
                </span>
              </div>
            </div>

            {/* Secondary Auth Options */}
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => loginWithGoogle()}
                type="button"
                className="enterprise-button-secondary flex items-center justify-center gap-3 py-3.5 text-sm"
              >
                <img
                  alt="Google"
                  className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc9nPJOkPDH_Yvtna2uO5oFdm_L9bspQY4xr64pohr6jkgvgS4fCQ_NdfwIvJAuWgn3gbTJxrFIZm1bNLVYqe9GFKPLNYYboQ0RT85R3LMg1gbiGRvtdPwRBTFqBr7gq7DmYZqbYBIAZDGM-IENh_lAsHXPbTU--yK78_t-eSTpQsDyvTQ1__B51jIeRmP4wppYcNi9OmGvt_NrnSgqYvymAzeNQ_5QzryUiYB4h9aq2ypjrtHxq7zR6iTm3xulCWmDFex6UWhpz8"
                />
                Continue with Google
              </button>
            </div>

            {/* Signup Prompt */}
            <p className="mt-8 text-center text-xs text-gray-500 dark:text-neutral-400">
              New researcher?
              <Link
                to="/trial"
                className="ml-1 font-semibold text-gray-900 underline-offset-4 hover:underline dark:text-neutral-100"
              >
                Request laboratory access
              </Link>
            </p>
          </div>

          {/* Security Footer */}
          <div className="mt-8 flex items-center justify-center gap-6 text-[10px] uppercase tracking-[0.15em] text-gray-400 dark:text-neutral-500 font-label">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">
                verified_user
              </span>
              SECURE 256-BIT ENCRYPTION
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">gavel</span>
              RESEARCH ETHICS COMPLIANT
            </div>
          </div>
        </div>
      </main>

      {/* Visual Specimen Decor */}
      <div className="hidden lg:block fixed bottom-12 right-12 max-w-xs p-6 glass-card rounded-lg border-l-4 border-primary">
        <div className="flex items-start gap-4">
          <div className="text-primary-container">
            <span className="material-symbols-outlined text-3xl">
              analytics
            </span>
          </div>
          <div>
            <p className="text-[10px] font-label text-primary uppercase tracking-widest mb-1">
              Live Telemetry
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed italic">
              "AI processing active for 1.4M molecular structures across the
              IndianMatter Database."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
