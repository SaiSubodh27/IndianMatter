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
    <div className="font-body selection:bg-primary-container selection:text-white overflow-hidden min-h-screen bg-background relative text-on-surface">
      {/* Background Decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-tertiary-container/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-secondary-container/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      {/* Main Content Canvas */}
      <main className="relative z-10 min-h-screen flex items-center justify-center p-6">
        {/* Login Container */}
        <div className="w-full max-w-[480px]">
          {/* Branding Anchor */}
          <div className="flex flex-col items-center mb-10 space-y-2">
            <Link
              to="/"
              className="w-12 h-12 bg-gradient-to-br from-primary to-primary-container rounded-xl flex items-center justify-center mb-4 neon-glow hover:scale-105 transition-transform"
            >
              <span className="material-symbols-outlined text-on-primary text-3xl font-bold">
                science
              </span>
            </Link>
            <h1 className="font-headline text-3xl font-bold tracking-tighter text-on-surface">
              IndianMatter
            </h1>
            <p className="font-label text-on-surface-variant tracking-[0.2em] uppercase text-[10px]">
              Scientific Intelligence Portal
            </p>
          </div>

          {/* Glassmorphic Card */}
          <div className="glass-card rounded-xl p-8 md:p-10 border border-outline-variant/20 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <div className="mb-8">
              <h2 className="font-headline text-2xl font-semibold text-primary mb-1">
                Welcome Back
              </h2>
              <p className="text-on-surface-variant text-sm">
                Access the advanced materials repository
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSignIn}>
              {/* Error Message */}
              {error && (
                <div className="bg-error/10 border border-error/50 text-error px-4 py-3 rounded-lg text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  className="font-label text-xs font-medium text-on-surface-variant uppercase tracking-wider"
                  htmlFor="email"
                >
                  Research Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      alternate_email
                    </span>
                  </div>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg py-3.5 pl-12 pr-4 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container transition-all placeholder:text-on-surface-variant/30 text-sm"
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
                    className="font-label text-xs font-medium text-on-surface-variant uppercase tracking-wider"
                    htmlFor="password"
                  >
                    Access Key
                  </label>
                  <a
                    className="text-[10px] font-label text-primary hover:text-primary-container transition-colors uppercase tracking-widest"
                    href="#"
                  >
                    Forgot Key?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      lock
                    </span>
                  </div>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg py-3.5 pl-12 pr-4 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container transition-all placeholder:text-on-surface-variant/30 text-sm"
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
                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold py-4 rounded-lg neon-glow-btn transition-all active:scale-[0.98] flex items-center justify-center gap-2 group hover:shadow-[0_0_20px_rgba(255,102,0,0.4)] disabled:opacity-50"
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
                <div className="w-full border-t border-outline-variant/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] font-label">
                <span className="bg-transparent px-4 text-on-surface-variant/40">
                  OR PROTOCOL
                </span>
              </div>
            </div>

            {/* Secondary Auth Options */}
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => loginWithGoogle()}
                type="button"
                className="flex items-center justify-center gap-3 bg-surface-container-highest/30 hover:bg-surface-container-highest/60 border border-outline-variant/10 rounded-lg py-3.5 transition-all text-sm font-medium text-on-surface group"
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
            <p className="mt-8 text-center text-xs text-on-surface-variant">
              New researcher?
              <Link
                to="/trial"
                className="text-primary font-semibold hover:underline decoration-primary-container/30 underline-offset-4 ml-1"
              >
                Request laboratory access
              </Link>
            </p>
          </div>

          {/* Security Footer */}
          <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-label text-on-surface-variant/40 uppercase tracking-[0.15em]">
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
