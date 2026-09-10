// Research Atelier style reminder: use editorial hierarchy, paper-like surfaces, and one clear route into the contextual research assistant.

import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Database,
  FlaskConical,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#ebe6dc] text-[#24231f]">
      <header className="flex h-16 items-center justify-between border-b border-[#d8d2c7] px-5 md:px-10">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center bg-[#f47a20] text-[#fffdf8]">
            <FlaskConical size={17} />
          </span>
          <span className="font-display text-xl tracking-[-0.03em]">
            IndianMatter
          </span>
        </div>
        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-[#77736b] md:block">
          Materials research workspace
        </span>
      </header>
      <main className="mx-auto grid max-w-[1240px] gap-12 px-5 py-14 md:px-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:py-24">
        <section>
          <div className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#77736b]">
            <span className="text-[#f47a20]">IndianMatter / 00</span>
            <span>Research intelligence</span>
          </div>
          <h1 className="max-w-3xl font-display text-6xl leading-[0.9] tracking-[-0.06em] md:text-8xl">
            From paper to <span className="text-[#f47a20]">pathway.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#68645c]">
            Explore materials research, inspect results, and ask better
            questions with a contextual assistant built around the paper—not
            apart from it.
          </p>
          <Link
            to="/dashboard/ai-copilot"
            className="mt-9 inline-flex items-center gap-3 bg-[#24231f] px-5 py-3.5 text-sm font-semibold text-[#fffdf8] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Open AI Research Copilot{" "}
            <ArrowRight size={16} className="text-[#f47a20]" />
          </Link>
        </section>
        <section className="relative overflow-hidden border border-[#d8d2c7] bg-[#fffdf8] p-6 shadow-[12px_14px_0_#d8d2c7] md:p-9">
          <img
            src="/manus-storage/indianmatter-material-study_b6204996.png"
            alt="Materials research study desk"
            className="absolute inset-0 h-full w-full object-cover opacity-[0.09] mix-blend-multiply"
          />
          <div className="relative z-10 absolute right-5 top-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#b5aea2]">
            <span className="research-marker">[·]</span> Field note / 001
          </div>
          <div className="relative z-10 mb-10 flex h-24 w-24 items-center justify-center border border-[#f47a20] text-[#f47a20]">
            <span className="text-2xl tracking-[-0.2em]">[·]</span>
          </div>
          <h2 className="relative z-10 max-w-md font-display text-4xl leading-[0.98] tracking-[-0.04em]">
            A reading desk for the next material breakthrough.
          </h2>
          <p className="relative z-10 mt-4 max-w-sm text-xs uppercase tracking-[0.12em] text-[#77736b]">
            Paper → result → question
          </p>
          <div className="mt-10 grid grid-cols-3 border-t border-[#d8d2c7] pt-5">
            <div>
              <BookOpen size={16} className="mb-3 text-[#f47a20]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#77736b]">
                Daily papers
              </p>
            </div>
            <div>
              <Database size={16} className="mb-3 text-[#f47a20]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#77736b]">
                Result tables
              </p>
            </div>
            <div>
              <Sparkles size={16} className="mb-3 text-[#f47a20]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#77736b]">
                Ask context
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
