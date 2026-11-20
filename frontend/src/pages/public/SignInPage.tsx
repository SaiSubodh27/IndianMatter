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
  CheckCircle2,
  User,
  Phone,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

type AuthMode = "signin" | "signup" | "otp";

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, signIn, signInWithGoogle } = useAuth();

  // Mode: "signin" | "signup" | "otp"
  const [mode, setMode] = useState<AuthMode>("signin");

  // Sign In & Sign Up Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP Verification States
  const [otp, setOtp] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Status & Feedback States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const redirectTarget =
    new URLSearchParams(location.search).get("redirect") || "/app";

  // Resend OTP countdown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const err = params.get("error");
    if (err) {
      setErrorMsg(`Login failed (${err}). Please try again.`);
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
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch profile");
          return res.json();
        })
        .then((profile) => {
          const isGoogle = profile.provider === "google" || profile.providers?.includes("google");
          const isGithub = profile.provider === "github" || profile.providers?.includes("github");
          const userProfile = {
            name: profile.name || profile.email,
            email: profile.email,
            phone: profile.phone,
            provider: profile.provider || "email",
            isGoogle,
            isGithub,
            avatar: isGoogle
              ? "https://lh3.googleusercontent.com/a/default-user=s96-c"
              : isGithub
              ? `https://avatars.githubusercontent.com/u/${profile.github_id || "0"}`
              : undefined,
          };
          localStorage.setItem("accessToken", token);
          localStorage.setItem("userProfile", JSON.stringify(userProfile));
          window.location.href = redirectTarget;
        })
        .catch((err) => {
          console.error(err);
          setErrorMsg("Failed to retrieve user profile after login.");
          setLoading(false);
        });
    } else if (isAuthenticated) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isAuthenticated, redirectTarget, navigate]);

  // -------------------------------------------------------------
  // 1. SIGN IN (Requests OTP email)
  // -------------------------------------------------------------
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Authentication failed. Please check your credentials.");
      }

      // Backend returned OTP challenge
      setOtpEmail(trimmedEmail);
      setOtp("");
      setMode("otp");
      setResendTimer(30);
      setSuccessMsg(`Verification code sent to ${trimmedEmail}. Please check your inbox.`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 2. SIGN UP (Registers user with Name, Email, Phone, Password)
  // -------------------------------------------------------------
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedEmail || !password) {
      setErrorMsg("Email and password are required.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName || undefined,
          email: trimmedEmail,
          phone: trimmedPhone || undefined,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Registration failed. An account may already exist.");
      }

      // Registration successful! Now switch to Sign In and trigger OTP
      setSuccessMsg("Account registered successfully! Now please sign in to verify your email.");
      setMode("signin");
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 3. VERIFY OTP (Submits 6-digit code for JWT token)
  // -------------------------------------------------------------
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const targetEmail = otpEmail || email.trim();
    const trimmedOtp = otp.trim();

    if (!trimmedOtp || trimmedOtp.length < 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, otp: trimmedOtp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Invalid or expired verification code.");
      }

      // Authentication complete! Save profile and access token
      const userProfile = {
        name: data.user?.name || targetEmail.split("@")[0],
        email: data.user?.email || targetEmail,
        phone: data.user?.phone,
        provider: data.user?.provider || "email",
      };

      signIn(userProfile, data.access_token);
      navigate(redirectTarget, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 4. RESEND OTP
  // -------------------------------------------------------------
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setErrorMsg("");

    const targetEmail = otpEmail || email.trim();

    try {
      const res = await fetch("http://localhost:8000/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await res.json();
      setSuccessMsg(data.message || `A new verification code was sent to ${targetEmail}.`);
      setResendTimer(30);
    } catch (err: any) {
      setErrorMsg("Failed to resend code. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleQuickSignIn = () => {
    signInWithGoogle({
      name: "Dr. Subodh Kumar",
      email: "subodh.matter@gmail.com",
      phone: "+91 98765 43210",
      isGoogle: true,
    });
    navigate(redirectTarget, { replace: true });
  };

  return (
    <div className="min-h-screen bg-white text-[#1E2227] flex flex-col justify-between relative overflow-x-hidden font-sans selection:bg-accent/20 selection:text-accent">
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
            Indian<span className="text-accent">Matter</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#5F6771]">
          <Link to="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <Link to="/#explore" className="hover:text-accent transition-colors">
            Explore
          </Link>
          <Link to="/#about" className="hover:text-accent transition-colors">
            About
          </Link>
          <Link to="/#resources" className="hover:text-accent transition-colors">
            Resources
          </Link>
          <Link to="/#contact" className="hover:text-accent transition-colors">
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
          <button
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className="bg-accent text-white px-6 py-2 rounded-full text-[14px] font-medium hover:bg-accent-hover transition-all shadow-sm active:scale-98"
          >
            {mode === "signup" ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </header>

      {/* Center Auth Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-[#F0E5D9]/70 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          {/* Left Panel (Soft Peach with Mineral Image & Notes) */}
          <div className="md:w-5/12 bg-[#FAF4EE] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="w-10 h-1 bg-accent rounded-full" />
              <div>
                <p className="text-xs font-semibold text-[#8C929C] uppercase tracking-wider">
                  Welcome to
                </p>
                <h1 className="text-3xl font-headline font-bold text-[#1E2227] tracking-tight mt-1">
                  Indian<span className="text-accent">Matter</span>
                </h1>
                <p className="text-xs font-medium text-[#5F6771] mt-0.5">
                  Materials for a Brighter Tomorrow
                </p>
              </div>

              <p className="text-xs text-[#6C737E] leading-relaxed max-w-[260px]">
                {mode === "signup"
                  ? "Create an account to save custom crystal structures, run ML predictions, and track your materials synthesis projects."
                  : mode === "otp"
                  ? "Protecting your research. Multi-factor verification ensures secure access to materials data and computational tools."
                  : "Sign in to explore, predict and accelerate materials discovery with the power of data and crystal structures."}
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
                <p className="font-handwriting text-[#5B636E] text-xl leading-tight">
                  Science
                  <br />
                  Today
                  <br />
                  A Brighter
                  <br />
                  Tomorrow
                </p>
                <div className="w-8 h-[2px] bg-accent ml-auto mt-1" />
              </div>
            </div>
          </div>

          {/* Right Panel (Forms) */}
          <div className="md:w-7/12 bg-white p-8 sm:p-12 flex flex-col justify-center">
            {/* Feedback Notifications */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-start gap-2">
                <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 1: SIGN IN MODE */}
            {/* ======================================================== */}
            {mode === "signin" && (
              <div>
                <h2 className="text-3xl font-headline font-bold text-[#1E2227] tracking-tight">
                  Sign In
                </h2>
                <p className="text-xs text-[#6C737E] mt-1 mb-6">
                  Welcome back! Continue your journey with IndianMatter.
                </p>

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
                    or with email & OTP
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
                        className="w-full bg-[#FAF4EE]/40 border border-[#E9DFD4] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#1E2227] outline-none focus:border-accent transition-colors placeholder:text-[#9EA4AD]"
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
                        className="w-full bg-[#FAF4EE]/40 border border-[#E9DFD4] rounded-xl py-2.5 pl-10 pr-10 text-xs text-[#1E2227] outline-none focus:border-accent transition-colors placeholder:text-[#9EA4AD]"
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
                        className="accent-accent rounded cursor-pointer"
                      />
                      <span className="text-[#6C737E]">Remember me</span>
                    </label>
                    <span className="text-xs text-[#8C929C]">
                      OTP sent upon password verification
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent text-white py-3 rounded-xl text-xs font-semibold hover:bg-accent-hover transition-all shadow-soft flex items-center justify-center gap-2 active:scale-98 mt-2 disabled:opacity-50"
                  >
                    {loading ? "Sending verification code..." : "Sign In & Get OTP"}{" "}
                    <ArrowRight size={14} />
                  </button>
                </form>

                <p className="text-center text-xs text-[#6C737E] mt-6">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-accent font-semibold hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 2: SIGN UP MODE */}
            {/* ======================================================== */}
            {mode === "signup" && (
              <div>
                <h2 className="text-3xl font-headline font-bold text-[#1E2227] tracking-tight">
                  Sign Up
                </h2>
                <p className="text-xs text-[#6C737E] mt-1 mb-6">
                  Create your IndianMatter account to access materials intelligence.
                </p>

                <form onSubmit={handleSignUp} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-[#1E2227] mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C929C]"
                        size={16}
                      />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. Saisubodh Kumar"
                        className="w-full bg-[#FAF4EE]/40 border border-[#E9DFD4] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#1E2227] outline-none focus:border-accent transition-colors placeholder:text-[#9EA4AD]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1E2227] mb-1">
                      Email Address
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
                        className="w-full bg-[#FAF4EE]/40 border border-[#E9DFD4] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#1E2227] outline-none focus:border-accent transition-colors placeholder:text-[#9EA4AD]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1E2227] mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C929C]"
                        size={16}
                      />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#FAF4EE]/40 border border-[#E9DFD4] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#1E2227] outline-none focus:border-accent transition-colors placeholder:text-[#9EA4AD]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1E2227] mb-1">
                      Create Password
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
                        placeholder="Minimum 6 characters"
                        className="w-full bg-[#FAF4EE]/40 border border-[#E9DFD4] rounded-xl py-2.5 pl-10 pr-10 text-xs text-[#1E2227] outline-none focus:border-accent transition-colors placeholder:text-[#9EA4AD]"
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent text-white py-3 rounded-xl text-xs font-semibold hover:bg-accent-hover transition-all shadow-soft flex items-center justify-center gap-2 active:scale-98 mt-3 disabled:opacity-50"
                  >
                    {loading ? "Creating Account..." : "Create Account & Continue"}{" "}
                    <ArrowRight size={14} />
                  </button>
                </form>

                <p className="text-center text-xs text-[#6C737E] mt-6">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-accent font-semibold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 3: OTP VERIFICATION MODE */}
            {/* ======================================================== */}
            {mode === "otp" && (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                  <KeyRound size={24} />
                </div>

                <h2 className="text-3xl font-headline font-bold text-[#1E2227] tracking-tight">
                  Enter Verification Code
                </h2>
                <p className="text-xs text-[#6C737E] mt-1 mb-4">
                  We've sent a 6-digit security code to:
                  <span className="block font-semibold text-[#1E2227] mt-0.5">
                    {otpEmail || email}
                  </span>
                </p>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#1E2227] mb-1.5">
                      6-Digit Security Code
                    </label>
                    <div className="relative">
                      <KeyRound
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C929C]"
                        size={16}
                      />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="••••••"
                        className="w-full bg-[#FAF4EE]/40 border border-[#E9DFD4] rounded-xl py-3 pl-10 pr-4 text-center text-lg font-bold tracking-[0.4em] text-[#1E2227] outline-none focus:border-accent transition-colors placeholder:text-[#9EA4AD]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full bg-accent text-white py-3 rounded-xl text-xs font-semibold hover:bg-accent-hover transition-all shadow-soft flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                  >
                    {loading ? "Verifying Code..." : "Verify & Sign In"}{" "}
                    <ArrowRight size={14} />
                  </button>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <button
                      type="button"
                      disabled={resendTimer > 0 || loading}
                      onClick={handleResendOtp}
                      className="text-accent font-medium hover:underline flex items-center gap-1.5 disabled:opacity-50 disabled:no-underline"
                    >
                      <RotateCcw size={13} />
                      {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend Code"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                      className="text-[#6C737E] hover:text-[#1E2227] font-medium"
                    >
                      Change email
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Tagline */}
      <footer className="py-6 text-center">
        <p className="text-[10px] tracking-[0.25em] font-bold text-[#9EA4AD] uppercase font-headline">
          MATERIALS FOR A BRIGHTER TOMORROW
        </p>
        <div className="w-10 h-[2px] bg-accent mx-auto mt-2" />
      </footer>
    </div>
  );
}
