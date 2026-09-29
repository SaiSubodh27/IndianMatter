import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sun,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, signIn, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const redirectTarget =
    new URLSearchParams(location.search).get("redirect") || "/app";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const err = params.get("error");
    if (err) {
      setErrorMsg(`Login failed (${err}). Please try again.`);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.search]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("token=")) {
      const token = hash.replace("#token=", "");
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
      
      setLoading(true);
      fetch("http://localhost:8000/api/users/profile", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then(profile => {
        const isGoogle = profile.provider === "google" || profile.providers?.includes("google");
        const isGithub = profile.provider === "github" || profile.providers?.includes("github");
        const userProfile = {
           name: profile.name || profile.email,
           email: profile.email,
           provider: profile.provider || "email",
           isGoogle,
           isGithub,
           avatar: isGoogle ? "https://lh3.googleusercontent.com/a/default-user=s96-c" : (isGithub ? `https://avatars.githubusercontent.com/u/${profile.github_id || '0'}` : undefined)
        };
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userProfile", JSON.stringify(userProfile));
        window.location.href = redirectTarget; // Force reload to update AuthContext
      })
      .catch(err => {
        console.error(err);
        setErrorMsg("Failed to retrieve user profile after login.");
        setLoading(false);
      });
    } else if (isAuthenticated) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isAuthenticated, redirectTarget, navigate]);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Any random id or password keeps the user signed in
    const trimmed = email.trim() || "researcher@indianmatter.org";
    signIn({
      email: trimmed,
      name: trimmed.includes("@") ? trimmed.split("@")[0] : trimmed,
      isGoogle:
        trimmed.toLowerCase().includes("gmail.com") ||
        trimmed.toLowerCase().includes("google.com"),
    });

    setLoading(false);
    // Replace current history entry so the Back button goes back to before the sign in page
    navigate(redirectTarget, { replace: true });
  };

  const handleGoogleSuccess = () => {
    // Left empty, handled by backend redirect now
  };

  const handleGoogleQuickSignIn = () => {
    signInWithGoogle({
      name: "Dr. Subodh Kumar",
      email: "subodh.matter@gmail.com",
      isGoogle: true,
    });
    // Replace current history entry so the Back button goes back to before the sign in page
    navigate(redirectTarget, { replace: true });
  };

  return (
    <>
      <div className="min-h-screen bg-white text-[#1E2227] flex flex-col justify-between relative overflow-x-hidden font-sans selection:bg-[#F1641D]/20 selection:text-[#F1641D]">
        {/* Decorative Organic Wave Shapes on Margins */}
        <div className="fixed top-0 left-[-120px] w-[320px] h-[750px] bg-[#F8DFCB]/40 rounded-[100%] blur-3xl pointer-events-none -z-10 transform -rotate-12" />
        <div className="fixed top-[40%] right-[-140px] w-[380px] h-[850px] bg-[#F8DFCB]/50 rounded-[100%] blur-3xl pointer-events-none -z-10 transform rotate-12" />
        <div className="fixed bottom-0 left-[-80px] w-[340px] h-[600px] bg-[#F8DFCB]/30 rounded-[100%] blur-3xl pointer-events-none -z-10" />

        {/* Floating Amber Molecule on Bottom Right */}
        <div className="fixed bottom-0 right-0 w-44 md:w-64 opacity-80 pointer-events-none -z-10">
          <img
            src="/assets/signin_molecule.png"
            alt=""
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Header Bar */}
        <header className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 h-20 flex items-center justify-between border-b border-[#F0E5D9]/50">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/mi-icon-mark.png"
              alt="IndianMatter"
              className="w-8 h-8 object-contain"
            />
            <span className="font-headline font-bold text-xl tracking-tight text-[#1E2227]">
              Indian<span className="text-[#F1641D]">Matter</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#5F6771]">
            <Link to="/" className="hover:text-[#F1641D] transition-colors">
              Home
            </Link>
            <Link
              to="/#explore"
              className="hover:text-[#F1641D] transition-colors"
            >
              Explore
            </Link>
            <Link
              to="/#about"
              className="hover:text-[#F1641D] transition-colors"
            >
              About
            </Link>
            <Link
              to="/#resources"
              className="hover:text-[#F1641D] transition-colors"
            >
              Resources
            </Link>
            <Link
              to="/#contact"
              className="hover:text-[#F1641D] transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              aria-label="Theme toggle"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#5F6771] hover:text-[#1E2227] hover:bg-black/5 transition-all"
            >
              <Sun size={18} strokeWidth={1.8} />
            </button>
            <button className="bg-[#F1641D] text-white px-6 py-2 rounded-full text-[14px] font-medium opacity-90 cursor-default">
              Sign In
            </button>
          </div>
        </header>

        {/* Center Sign In Container */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
          <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-white overflow-hidden flex flex-col md:flex-row min-h-[580px]">
            {/* Left Panel (Soft Peach with Mineral Image & Notes) */}
            <div className="md:w-5/12 bg-[#FAF4EE] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="w-10 h-1 bg-[#F1641D] rounded-full" />
                <div>
                  <p className="text-xs font-semibold text-[#8C929C] uppercase tracking-wider">
                    Welcome to
                  </p>
                  <h1 className="text-3xl font-headline font-bold text-[#1E2227] tracking-tight mt-1">
                    Indian<span className="text-[#F1641D]">Matter</span>
                  </h1>
                  <p className="text-xs font-medium text-[#5F6771] mt-0.5">
                    Materials for a Brighter Tomorrow
                  </p>
                </div>

                <p className="text-xs text-[#6C737E] leading-relaxed max-w-[260px]">
                  Sign in to explore, predict and accelerate materials discovery
                  with the power of data and crystal structures.
                </p>
              </div>

              {/* Natural Crystal Graphic + Cursive Note */}
              <div className="relative mt-8 flex items-end justify-between">
                <div className="w-48 sm:w-56 -ml-4 -mb-4">
                  <img
                    src="/assets/signin_crystal.png"
                    alt="Crystal Specimen"
                    className="w-full h-auto object-contain drop-shadow-lg select-none pointer-events-none"
                  />
                </div>

                <div className="text-right pb-4 -mr-2">
                  <p className="font-handwriting text-[#5B636E] text-xl leading-tight -rotate-3">
                    Science
                    <br />
                    Today
                    <br />
                    A Brighter
                    <br />
                    Tomorrow
                  </p>
                  <div className="w-8 h-[2px] bg-[#F1641D] ml-auto mt-1" />
                </div>
              </div>
            </div>

            {/* Right Panel (Clean Sign In Form) */}
            <div className="md:w-7/12 bg-white p-8 sm:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-headline font-bold text-[#1E2227] tracking-tight">
                Sign In
              </h2>
              <p className="text-xs text-[#6C737E] mt-1 mb-6">
                Welcome back! Continue your journey with IndianMatter.
              </p>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                  <AlertCircle size={14} /> {errorMsg}
                </div>
              )}

              {/* Google OAuth & GitHub Login */}
              <div className="space-y-3 mb-6">
                <div className="w-full flex justify-center mb-3">
                  <a
                    href="http://localhost:8000/api/auth/google/login"
                    className="flex items-center justify-center gap-2.5 py-3 w-full border border-[#E9DFD4] rounded-full hover:bg-[#FAF4EE] text-sm font-medium text-[#1E2227] transition-all active:scale-98"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    Sign in with Google
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleQuickSignIn}
                    className="flex items-center justify-center gap-2.5 py-2.5 px-4 border border-[#E9DFD4] rounded-xl hover:bg-[#FAF4EE] text-xs font-semibold text-[#1E2227] transition-all active:scale-98"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="w-4 h-4"
                    />
                    Quick Google Sign In
                  </button>

                  <a
                    href="http://localhost:8000/api/auth/github/login"
                    className="flex items-center justify-center gap-2.5 py-2.5 px-4 border border-[#E9DFD4] rounded-xl hover:bg-[#FAF4EE] text-xs font-semibold text-[#1E2227] transition-all active:scale-98"
                  >
                    <img
                      src="https://www.svgrepo.com/show/512317/github-142.svg"
                      alt="GitHub"
                      className="w-4 h-4"
                    />
                    Continue with GitHub
                  </a>
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#EFE5DC]" />
                </div>
                <span className="relative bg-white px-3 text-[11px] text-[#9EA4AD]">
                  or with email
                </span>
              </div>

              {/* Email / Password Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#1E2227] mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C929C]"
                      size={16}
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="researcher@university.edu"
                      className="w-full bg-[#FAF4EE]/40 border border-[#E9DFD4] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#1E2227] outline-none focus:border-[#F1641D] transition-colors placeholder:text-[#9EA4AD]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1E2227] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C929C]"
                      size={16}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-[#FAF4EE]/40 border border-[#E9DFD4] rounded-xl py-2.5 pl-10 pr-10 text-xs text-[#1E2227] outline-none focus:border-[#F1641D] transition-colors placeholder:text-[#9EA4AD]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C929C] hover:text-[#1E2227]"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-[#F1641D] rounded cursor-pointer"
                    />
                    <span className="text-[#6C737E]">Remember me</span>
                  </label>
                  <a
                    href="#forgot"
                    className="text-[#F1641D] font-medium hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#F1641D] text-white py-3 rounded-xl text-xs font-semibold hover:bg-[#D9520F] transition-all shadow-soft flex items-center justify-center gap-2 active:scale-98 mt-2 disabled:opacity-50"
                >
                  {loading ? "Authenticating..." : "Sign In"}{" "}
                  <ArrowRight size={14} />
                </button>
              </form>

              <p className="text-center text-xs text-[#6C737E] mt-6">
                Don't have an account?{" "}
                <Link
                  to="/signin"
                  className="text-[#F1641D] font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </main>

        {/* Footer Tagline */}
        <footer className="py-6 text-center">
          <p className="text-[10px] tracking-[0.25em] font-bold text-[#9EA4AD] uppercase font-headline">
            MATERIALS FOR A BRIGHTER TOMORROW
          </p>
          <div className="w-10 h-[2px] bg-[#F1641D] mx-auto mt-2" />
        </footer>
      </div>
    </>
  );
}
