import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
// import { jwtDecode } from "jwt-decode";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      console.log("Google Login Success:", codeResponse);
      try {
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
    <div className="min-h-screen w-full flex bg-background text-on-surface font-body selection:bg-primary/30 selection:text-white">
      {/* LEFT — Visual / brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-neutral-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-container/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-tertiary-container/10 rounded-full blur-[120px]"></div>
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxpsjhneUlCjJi_VbgQdGXP4zDxeqmmk2Oguo0BDTW8uiPchSVN_wa0KK5KSXNNxnqkDmEINo3K9VroRwqfjUl7xbWxgsLzEKlQjCB0n1zSTjaF_OrlA_wchjQWW0hxCGBk8jt8oHXORMQ3Y-v8HTiYSlHrBCg6z3zY_vI9v7rGcMwQls04DXew8p8Ykbscg_Efs_GednA4kihJQNR4TVejpsDuilPvYchdsOAJxz4LUYc7RSYp1Znj3TJ623Z4-Lt-w2Uvm8BWbM')",
              backgroundSize: "cover",
              mixBlendMode: "overlay",
            }}
          ></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          <Link to="/" className="flex items-center gap-3 w-fit group">
            <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-white text-xl">
                science
              </span>
            </div>
            <span className="text-white font-headline font-bold text-xl tracking-tight">
              IndianMatter
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-md"
          >
            <span className="inline-block py-1 px-3 mb-6 rounded-full bg-white/5 text-orange-400 text-[0.6875rem] font-headline uppercase tracking-[0.2em] border border-white/10">
              Scientific Intelligence Portal
            </span>
            <h1 className="text-4xl font-headline font-bold text-white tracking-tight leading-tight mb-4">
              Materials discovery,{" "}
              <span className="text-orange-400 italic">accelerated.</span>
            </h1>
            <p className="text-neutral-400 leading-relaxed">
              Sign in to access simulations, crystal structure analysis, and
              predictive models built for solid-state research.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass-card rounded-xl border-l-4 border-orange-500 p-6 max-w-sm"
          >
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-orange-400 text-2xl">
                analytics
              </span>
              <div>
                <p className="text-[10px] font-headline text-orange-400 uppercase tracking-widest mb-1">
                  Live Telemetry
                </p>
                <p className="text-xs text-neutral-300 leading-relaxed italic">
                  AI processing active for 1.4M molecular structures across the
                  IndianMatter Database.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT — Form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile-only logo */}
          <Link
            to="/"
            className="lg:hidden mb-8 flex items-center gap-3 w-fit mx-auto"
          >
            <div className="w-9 h-9 shrink-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">
                science
              </span>
            </div>
            <span className="text-on-surface font-headline font-bold text-lg tracking-tight">
              IndianMatter
            </span>
          </Link>

          <div className="mb-8">
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-on-surface-variant">
              Access the advanced materials repository
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSignIn}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300"
              >
                <span className="material-symbols-outlined text-base">
                  error
                </span>
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium uppercase tracking-wider text-on-surface-variant"
                htmlFor="email"
              >
                Research Email
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg text-neutral-400 group-focus-within:text-orange-500 transition-colors">
                  alternate_email
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.edu"
                  className="w-full bg-surface-container-low dark:bg-neutral-900 border border-outline-variant/30 dark:border-neutral-800 rounded-lg pl-12 pr-4 py-3 text-sm text-on-surface placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label
                  className="text-xs font-medium uppercase tracking-wider text-on-surface-variant"
                  htmlFor="password"
                >
                  Access Key
                </label>
                <a
                  href="#"
                  className="text-[11px] font-medium text-on-surface-variant hover:text-orange-500 transition-colors"
                >
                  Forgot key?
                </a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg text-neutral-400 group-focus-within:text-orange-500 transition-colors">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-container-low dark:bg-neutral-900 border border-outline-variant/30 dark:border-neutral-800 rounded-lg pl-12 pr-11 py-3 text-sm text-on-surface placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-on-surface transition-colors"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-headline font-semibold py-3.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,102,0,0.25)]"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">
                    progress_activity
                  </span>
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/20 dark:border-neutral-800"></div>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-[0.2em]">
              <span className="bg-background px-4 text-neutral-500">
                or continue with
              </span>
            </div>
          </div>

          {/* Google */}
          <button
            onClick={() => loginWithGoogle()}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-lg border border-outline-variant/30 dark:border-neutral-800 bg-surface-container-low dark:bg-neutral-900 hover:bg-surface-container dark:hover:bg-neutral-800 text-sm font-medium text-on-surface transition-colors"
          >
            <img
              alt="Google"
              className="w-5 h-5"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc9nPJOkPDH_Yvtna2uO5oFdm_L9bspQY4xr64pohr6jkgvgS4fCQ_NdfwIvJAuWgn3gbTJxrFIZm1bNLVYqe9GFKPLNYYboQ0RT85R3LMg1gbiGRvtdPwRBTFqBr7gq7DmYZqbYBIAZDGM-IENh_lAsHXPbTU--yK78_t-eSTpQsDyvTQ1__B51jIeRmP4wppYcNi9OmGvt_NrnSgqYvymAzeNQ_5QzryUiYB4h9aq2ypjrtHxq7zR6iTm3xulCWmDFex6UWhpz8"
            />
            Continue with Google
          </button>

          {/* Signup */}
          <p className="mt-8 text-center text-xs text-on-surface-variant">
            New researcher?{" "}
            <Link
              to="/trial"
              className="font-semibold text-orange-500 hover:text-orange-600 hover:underline underline-offset-4 transition-colors"
            >
              Request laboratory access
            </Link>
          </p>

          {/* Security footer */}
          <div className="mt-10 flex items-center justify-center gap-6 text-[10px] uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-600">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">
                verified_user
              </span>
              256-bit encryption
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">gavel</span>
              Ethics compliant
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
