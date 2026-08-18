import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeProvider";

function LandingNav() {
  const { theme, setTheme } = useTheme();
  const [userProfile, setUserProfile] = useState<{
    name?: string;
    picture?: string;
    email?: string;
  } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const profileObj = localStorage.getItem("userProfile");
    if (profileObj) {
      try {
        setUserProfile(JSON.parse(profileObj));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const links = [
    { name: "Discover", href: "#" },
    { name: "Datasets", href: "#" },
    { name: "API", href: "#" },
    { name: "Documentation", href: "#" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/70 dark:bg-neutral-950/60 backdrop-blur-xl flex items-center px-8 h-20 shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border-b border-outline-variant/10 dark:border-neutral-900">
      {/* Logo */}
      {/* Logo */}
      <div className="w-64 shrink-0 flex items-end gap-2.5 font-headline">
        <img
          src="/mi-icon-mark.png"
          alt="IndianMatter"
          className="w-10 h-10 shrink-0 object-contain"
        />
        <span className="text-xl tracking-tight whitespace-nowrap leading-none pb-0.5">
          <span className="text-orange-500 font-bold">Indian</span>
          <span className="text-on-surface font-bold">Matter</span>
        </span>
      </div>

      {/* Centered links */}
      <div className="hidden md:flex items-center justify-center gap-10 flex-1 font-headline tracking-tight">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="group relative py-2 text-on-surface-variant hover:text-on-surface dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200"
          >
            {link.name}
            <span className="absolute left-1/2 -bottom-[1px] h-[2px] bg-orange-500 rounded-full transition-all duration-300 ease-in-out -translate-x-1/2 w-0 group-hover:w-full" />
          </a>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center justify-end gap-4 w-64 shrink-0">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-on-surface-variant dark:text-neutral-400 hover:text-orange-500 transition-colors duration-200"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        {userProfile ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center"
            >
              <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-orange-400 transition-colors duration-200">
                <img
                  className="w-full h-full object-cover"
                  alt="User avatar"
                  src={
                    userProfile.picture ||
                    "https://ui-avatars.com/api/?name=" +
                      (userProfile.name || "User")
                  }
                />
              </div>
            </button>
            <div
              className={`absolute right-0 mt-3 w-56 bg-surface-container dark:bg-neutral-900 border border-outline-variant/20 dark:border-neutral-800 rounded-xl shadow-lg overflow-hidden origin-top-right transition-all duration-200 ${
                menuOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
              }`}
            >
              <div className="px-4 py-3 border-b border-outline-variant/10 dark:border-neutral-800">
                <p className="text-sm font-semibold text-on-surface dark:text-white truncate">
                  {userProfile.name || "User"}
                </p>
                <p className="text-xs text-on-surface-variant dark:text-neutral-500 truncate">
                  {userProfile.email || "Researcher"}
                </p>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant dark:text-neutral-300 hover:bg-surface-container-high dark:hover:bg-neutral-800 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  dashboard
                </span>
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <Link
            to="/signin"
            className="px-6 py-2 rounded-full font-headline text-sm font-semibold bg-gradient-to-br from-primary to-primary-container text-on-primary neon-glow-primary hover:scale-105 active:scale-95 transition-transform whitespace-nowrap"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default function Landing() {
  return (
    <div className="bg-background text-on-surface min-h-[200vh] overflow-x-hidden font-body selection:bg-primary/30 selection:text-white">
      <LandingNav />

      <header className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden lattice-bg">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-tertiary-container/10 rounded-full blur-[120px]"></div>

          <div
            className="absolute inset-0 opacity-20"
            data-alt="Futuristic 3D molecular lattice structure with glowing atomic bonds against a dark void background"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxpsjhneUlCjJi_VbgQdGXP4zDxeqmmk2Oguo0BDTW8uiPchSVN_wa0KK5KSXNNxnqkDmEINo3K9VroRwqfjUl7xbWxgsLzEKlQjCB0n1zSTjaF_OrlA_wchjQWW0hxCGBk8jt8oHXORMQ3Y-v8HTiYSlHrBCg6z3zY_vI9v7rGcMwQls04DXew8p8Ykbscg_Efs_GednA4kihJQNR4TVejpsDuilPvYchdsOAJxz4LUYc7RSYp1Znj3TJ623Z4-Lt-w2Uvm8BWbM')",
              backgroundSize: "cover",
              mixBlendMode: "overlay",
            }}
          ></div>
        </div>
        <div className="relative z-10 text-center max-w-4xl">
          <span className="inline-block py-1 px-3 mb-6 rounded-full bg-secondary-container/20 text-primary text-[0.6875rem] font-headline uppercase tracking-[0.2em] border border-outline-variant/30">
            Next-Gen Computational Science
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-headline font-bold text-on-surface tracking-tighter mb-6 leading-none"
          >
            IndianMatter <span className="text-primary text-neon">AI</span>
          </motion.h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            Accelerating materials discovery using AI and physics. A sovereign
            platform for multi-scale simulation and predictive synthesis of
            novel solid-state materials.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/trial"
              className="w-full sm:w-auto px-8 py-4 rounded-md font-headline font-bold bg-gradient-to-r from-primary to-primary-container text-on-primary neon-glow-primary hover:scale-105 transition-all text-center"
            >
              Trial Mode
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 rounded-md font-headline font-bold text-primary border border-primary/30 bg-surface-container-low/40 backdrop-blur-md hover:bg-surface-container-high transition-colors">
              Contact Us
            </button>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl w-full"
        >
          <div className="text-center">
            <div className="text-3xl font-headline font-bold text-primary">
              10M+
            </div>
            <div className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant font-headline mt-1">
              Simulations
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-headline font-bold text-primary">
              ~98%
            </div>
            <div className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant font-headline mt-1">
              Accuracy
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-headline font-bold text-primary">
              450x
            </div>
            <div className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant font-headline mt-1">
              Faster Cycles
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-headline font-bold text-primary">
              24/7
            </div>
            <div className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant font-headline mt-1">
              HPC Uptime
            </div>
          </div>
        </motion.div>
      </header>

      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-headline font-semibold text-on-surface mb-4">
              Precision Intelligence for Solid-State Physics
            </h2>
            <p className="text-on-surface-variant font-body">
              Leveraging transformer architectures and graph neural networks to
              predict material properties directly from crystal structures.
            </p>
          </div>
          <div className="h-px bg-outline-variant/20 flex-grow hidden md:block mx-12 mb-4"></div>
          <div className="flex items-center gap-2 text-primary font-headline text-sm uppercase tracking-wider">
            Explore Core{" "}
            <span
              className="material-symbols-outlined align-middle"
              data-icon="arrow_forward"
            >
              arrow_forward
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="md:col-span-7 glass-card rounded-xl p-8 group transition-all duration-500 overflow-hidden relative"
          >
            <div className="relative z-10">
              <span
                className="material-symbols-outlined text-primary mb-6 text-4xl"
                data-icon="auto_awesome"
              >
                auto_awesome
              </span>
              <h3 className="text-2xl font-headline font-bold text-on-surface mb-3">
                AI-Driven Property Prediction
              </h3>
              <p className="text-on-surface-variant font-body mb-8 max-w-md">
                Real-time prediction of electronic, mechanical, and
                thermodynamic properties with density functional theory (DFT)
                level accuracy.
              </p>
              <div className="flex gap-3">
                <span className="px-3 py-1 rounded bg-secondary-container/10 text-primary text-[0.6875rem] font-headline border border-outline-variant/20">
                  Elasticity
                </span>
                <span className="px-3 py-1 rounded bg-secondary-container/10 text-primary text-[0.6875rem] font-headline border border-outline-variant/20">
                  Band Gap
                </span>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700">
              <img
                className="w-full h-full object-cover"
                data-alt="Scientific data visualization showing complex heatmap and mesh of crystal lattice vibrational modes"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSqGpDh84C1vO_z8jDhLpIbph8pkGeJBoPL8kvOdq1x_3ABjCgki7s3QY5FGpghx1Dj2wtOa5VClsrxgjD2uh19rPYAeVNnDBWIlzDU8VN8iTiLHVBwuh6HVMZdrTK4nIlPRyF8JDyykECfbFdpuUAZVF9L7Vn6bYzCzCP2_NScqyijtfmLrHvtYNM3ImVzbYcRzq-iHwRS-aD9Qg8Tv5-hgk0uVIWiAnlZtjjd2nL9aXjrsATKBUNYIYC1ocHJEgXMLku5HXKZ3E"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="md:col-span-5 glass-card rounded-xl p-8 flex flex-col justify-between group transition-all duration-500"
          >
            <div>
              <span
                className="material-symbols-outlined text-primary mb-6 text-4xl"
                data-icon="electric_bolt"
              >
                electric_bolt
              </span>
              <h3 className="text-2xl font-headline font-bold text-on-surface mb-3">
                Ionic Conductivity
              </h3>
              <p className="text-on-surface-variant font-body">
                Profiling diffusion paths for next-gen solid-state batteries and
                fuel cells using nudged elastic band (NEB) simulations.
              </p>
            </div>
            <div className="mt-8 bg-surface-container-lowest rounded-lg p-4 border border-outline-variant/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[0.6875rem] text-on-surface-variant font-headline">
                  Conductivity (S/cm)
                </span>
                <span className="text-primary font-mono text-xs">10⁻³</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary w-4/5 shadow-[0_0_8px_#ff6600]"></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="md:col-span-5 glass-card rounded-xl p-8 group transition-all duration-500"
          >
            <span
              className="material-symbols-outlined text-primary mb-6 text-4xl"
              data-icon="grid_view"
            >
              grid_view
            </span>
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-3">
              Doping-based Design
            </h3>
            <p className="text-on-surface-variant font-body">
              Optimize carrier concentration by exploring combinatorial chemical
              spaces for impurity substitutions and defects.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="md:col-span-7 glass-card rounded-xl p-8 group transition-all duration-500 flex flex-col md:flex-row gap-8"
          >
            <div className="flex-1">
              <span
                className="material-symbols-outlined text-primary mb-6 text-4xl"
                data-icon="thermostat"
              >
                thermostat
              </span>
              <h3 className="text-2xl font-headline font-bold text-on-surface mb-3">
                Temperature Analysis
              </h3>
              <p className="text-on-surface-variant font-body">
                Phase transition monitoring and thermal expansion modeling
                across extreme temperature gradients (0K - 3000K).
              </p>
            </div>
            <div className="flex-1 bg-surface-container-lowest rounded-lg overflow-hidden flex items-center justify-center p-4 border border-outline-variant/10">
              <img
                className="w-full h-auto rounded opacity-70 group-hover:opacity-100 transition-opacity"
                data-alt="Macro view of molten metal cooling and crystallizing with glowing orange and deep violet hues"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC6yCdLtI7HX08IjKFF2pQmwXUWXWwA_3AAzT_sLVhCpweHSt5XDv7c2rbgE-EfFYdMwU0HGdWiAsYSZ0P15SD-t8IVQz3kA4sumshS6PAQXD7FkCl3hCFq21cOguLpCPgiYvHYrCtMZ5NiZ2EYxxNUQKRJiLMwdIjAndZSRheTFWtsqhqy_DBQLkWqPbwdb5_8hQPo8TKNN9Ugegc21IueHSPVAl403rfZzvpKayV2_koKWWOVEBlOKbykOtjTK6wcgJLGUCP7hs"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-surface-container-lowest relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,102,0,0.03)_0%,transparent_70%)]"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-headline font-bold text-on-surface mb-6"
            >
              Autonomous Workflow
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-on-surface-variant max-w-2xl mx-auto"
            >
              From raw structural data to actionable scientific insights in a
              seamless, physics-informed pipeline.
            </motion.p>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center text-center w-48"
            >
              <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center border border-primary/20 mb-4 group-hover:border-primary transition-colors">
                <span
                  className="material-symbols-outlined text-primary text-3xl"
                  data-icon="description"
                >
                  description
                </span>
              </div>
              <div className="font-headline font-bold text-on-surface">CIF</div>
              <div className="text-[0.6875rem] text-on-surface-variant uppercase tracking-tighter mt-1">
                Crystal Data Input
              </div>
            </motion.div>
            <div className="hidden lg:block h-px flex-grow bg-gradient-to-r from-primary/40 to-transparent mx-4 relative">
              <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-primary/40 animate-pulse"></div>
            </div>
            <span
              className="lg:hidden material-symbols-outlined text-outline-variant my-4"
              data-icon="arrow_downward"
            >
              arrow_downward
            </span>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center text-center w-48"
            >
              <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center border border-primary/20 mb-4">
                <span
                  className="material-symbols-outlined text-primary text-3xl"
                  data-icon="hub"
                >
                  hub
                </span>
              </div>
              <div className="font-headline font-bold text-on-surface">
                Extraction
              </div>
              <div className="text-[0.6875rem] text-on-surface-variant uppercase tracking-tighter mt-1">
                Feature Mapping
              </div>
            </motion.div>
            <div className="hidden lg:block h-px flex-grow bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-4"></div>
            <span
              className="lg:hidden material-symbols-outlined text-outline-variant my-4"
              data-icon="arrow_downward"
            >
              arrow_downward
            </span>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center text-center w-48"
            >
              <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center shadow-[0_0_20px_rgba(255,102,0,0.4)] mb-4">
                <span
                  className="material-symbols-outlined text-on-primary text-4xl"
                  data-icon="memory"
                >
                  memory
                </span>
              </div>
              <div className="font-headline font-bold text-primary">
                ML Models
              </div>
              <div className="text-[0.6875rem] text-on-surface-variant uppercase tracking-tighter mt-1">
                Neural Prediction
              </div>
            </motion.div>
            <div className="hidden lg:block h-px flex-grow bg-gradient-to-r from-transparent to-primary/40 mx-4"></div>
            <span
              className="lg:hidden material-symbols-outlined text-outline-variant my-4"
              data-icon="arrow_downward"
            >
              arrow_downward
            </span>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6000000000000001 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center text-center w-48"
            >
              <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center border border-primary/20 mb-4">
                <span
                  className="material-symbols-outlined text-primary text-3xl"
                  data-icon="functions"
                >
                  functions
                </span>
              </div>
              <div className="font-headline font-bold text-on-surface">
                Physics
              </div>
              <div className="text-[0.6875rem] text-on-surface-variant uppercase tracking-tighter mt-1">
                Validation
              </div>
            </motion.div>
            <div className="hidden lg:block h-px flex-grow bg-gradient-to-r from-primary/40 to-transparent mx-4"></div>
            <span
              className="lg:hidden material-symbols-outlined text-outline-variant my-4"
              data-icon="arrow_downward"
            >
              arrow_downward
            </span>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center text-center w-48"
            >
              <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center border border-primary/20 mb-4">
                <span
                  className="material-symbols-outlined text-primary text-3xl"
                  data-icon="insights"
                >
                  insights
                </span>
              </div>
              <div className="font-headline font-bold text-on-surface">
                Output
              </div>
              <div className="text-[0.6875rem] text-on-surface-variant uppercase tracking-tighter mt-1">
                Actionable Reports
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1 rounded-full text-sm font-headline">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Active Lab Insights
          </div>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface leading-tight">
            Unlock the Secrets of{" "}
            <span className="text-primary italic">Atomic Space</span>.
          </h2>
          <p className="text-on-surface-variant text-lg font-body leading-relaxed">
            Our platform provides a deep-dive Crystal Explorer, allowing
            researchers to visualize bonding potentials, energy surfaces, and
            electron density maps in high-fidelity 3D environments.
          </p>
          <div className="pt-4 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <span
                className="material-symbols-outlined text-primary mt-1"
                data-icon="check_circle"
              >
                check_circle
              </span>
              <div>
                <div className="font-headline font-bold text-on-surface">
                  High-Precision Grids
                </div>
                <p className="text-sm text-on-surface-variant">
                  Sub-angstrom resolution for complex crystalline systems.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span
                className="material-symbols-outlined text-primary mt-1"
                data-icon="check_circle"
              >
                check_circle
              </span>
              <div>
                <div className="font-headline font-bold text-on-surface">
                  Sovereign Data Storage
                </div>
                <p className="text-sm text-on-surface-variant">
                  Secure, Indian-hosted infrastructure for sensitive research
                  data.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full">
          <div className="relative glass-card rounded-2xl overflow-hidden shadow-2xl p-4">
            <img
              className="w-full h-[400px] object-cover rounded-xl"
              data-alt="High-end server room with glowing orange LED lights reflecting off sleek black hardware racks"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5sTGkykBj3qjZqSorzCEKZ8B9CEvTnPKlMiHR2YNAWIYws_xN-UD2pxv5zgX1KaF_0tCspAqiWf9s9rD3Y6v-b_5s-PQIm9MSGK3kValNZkWQcJojc28FU1ImEC2BF8sQWiE7rdOJtcEssPYB5_JrJNLecRct4J87V_SH7Ioc4-ePUgWLMSaNh7GnXbqMmEN5jt0DiRSqmmoCXNdJExo8usQp23jKtw_5vfJC5jRAfopS5rWZZ0AVJDk4BvRn2QUqfxRShd5rkyo"
            />
            <div className="absolute inset-x-8 bottom-8 glass-card border border-primary/20 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="font-headline text-on-surface font-bold">
                  Research Portal v4.2
                </div>
                <div className="text-primary text-[0.6875rem] font-headline uppercase tracking-widest">
                  Active Connection
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-1 flex-1 bg-primary/40 rounded-full"></div>
                <div className="h-1 flex-1 bg-primary/40 rounded-full"></div>
                <div className="h-1 flex-1 bg-primary rounded-full"></div>
                <div className="h-1 flex-1 bg-primary/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-transparent to-surface-container-low/30 border-y border-outline-variant/10 text-center px-8">
        <h2 className="text-4xl md:text-5xl font-headline font-bold mb-8">
          Ready to Advance Material Science?
        </h2>
        <p className="text-on-surface-variant max-w-xl mx-auto mb-12">
          Join hundreds of researchers leveraging IndianMatter to pioneer the
          future of semiconductors, energy storage, and aerospace alloys.
        </p>
        <Link
          to="/trial"
          className="inline-block px-10 py-5 rounded-md font-headline font-bold text-lg bg-primary text-on-primary shadow-[0_0_20px_rgba(255,102,0,0.3)] hover:scale-105 transition-transform"
        >
          Start Free Trial
        </Link>
      </section>

      <footer className="w-full py-12 border-t border-neutral-900 bg-neutral-950 flex flex-col items-center gap-4 px-8">
        <div className="flex flex-wrap justify-center gap-8 mb-4">
          <a
            className="text-neutral-600 hover:text-orange-300 transition-colors font-headline text-xs uppercase tracking-widest"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-neutral-600 hover:text-orange-300 transition-colors font-headline text-xs uppercase tracking-widest"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-neutral-600 hover:text-orange-300 transition-colors font-headline text-xs uppercase tracking-widest"
            href="#"
          >
            Research Ethics
          </a>
          <a
            className="text-neutral-600 hover:text-orange-300 transition-colors font-headline text-xs uppercase tracking-widest"
            href="#"
          >
            Contact
          </a>
        </div>
        <div className="text-neutral-600 font-headline text-[10px] uppercase tracking-widest text-center">
          © 2024 IndianMatter. Engineered for Scientific Discovery.
        </div>
      </footer>
    </div>
  );
}
