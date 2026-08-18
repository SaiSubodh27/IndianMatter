import { Link } from "react-router-dom";

const principles = [
  {
    icon: "science",
    title: "Research first",
    description:
      "We turn complex materials data into a clearer starting point for discovery, experimentation, and better decisions.",
  },
  {
    icon: "hub",
    title: "Connected by design",
    description:
      "IndianMatter brings calculations, structures, datasets, and saved work together in one focused workspace.",
  },
  {
    icon: "verified",
    title: "Built for confidence",
    description:
      "Every workflow is designed to make technical work easier to inspect, organize, and communicate.",
  },
];

const capabilities = [
  {
    value: "01",
    label: "Explore",
    detail: "Find materials and compare relevant information.",
  },
  {
    value: "02",
    label: "Calculate",
    detail: "Move from a question to a structured workflow.",
  },
  {
    value: "03",
    label: "Understand",
    detail: "Read results in a context that supports action.",
  },
];

export default function AboutUs() {
  return (
    <div className="enterprise-page relative flex w-full flex-1 flex-col overflow-hidden">
      <div className="pointer-events-none absolute right-[-12rem] top-[-8rem] h-[34rem] w-[34rem] rounded-full bg-orange-200/40 blur-[120px] dark:bg-orange-950/20" />
      <div className="pointer-events-none absolute bottom-[-12rem] left-[-10rem] h-[30rem] w-[30rem] rounded-full bg-gray-200/70 blur-[130px] dark:bg-neutral-800/40" />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 overflow-y-auto p-6 lg:p-10">
        <header className="mb-8 flex flex-col gap-5 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-orange-500">
              About IndianMatter
            </p>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-gray-900 dark:text-neutral-100 lg:text-6xl">
              Make materials research feel more connected.
            </h1>
          </div>
          <p className="max-w-sm text-sm leading-7 text-gray-500 dark:text-neutral-400">
            A focused workspace for researchers, engineers, and curious minds
            who want to move from materials data to meaningful insight.
          </p>
        </header>

        <section className="grid overflow-hidden rounded-3xl bg-black text-white shadow-xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative flex min-h-[28rem] flex-col justify-between overflow-hidden p-8 lg:p-12">
            <div className="pointer-events-none absolute right-[-5rem] top-[-5rem] h-72 w-72 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute right-[-2rem] top-[-2rem] h-56 w-56 rounded-full border border-orange-400/30" />
            <div className="pointer-events-none absolute bottom-[-7rem] left-[-5rem] h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-2xl">
                  biotech
                </span>
              </div>
              <h2 className="font-headline max-w-xl text-3xl font-bold leading-tight lg:text-4xl">
                Better tools create room for better questions.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-neutral-400">
                Materials science is full of possibilities, but the path from
                raw information to useful understanding can be fragmented. We
                are building IndianMatter to make that path more direct.
              </p>
            </div>

            <div className="relative z-10 mt-12 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              <span className="h-px w-10 bg-orange-500" />
              Explore. Calculate. Understand.
            </div>
          </div>

          <div className="bg-white p-8 text-gray-900 dark:bg-neutral-900 dark:text-neutral-100 lg:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-neutral-500">
              Our purpose
            </p>
            <p className="mt-5 text-2xl font-semibold leading-relaxed tracking-tight lg:text-3xl">
              IndianMatter exists to help people spend less time finding their
              way through tools and more time understanding materials.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-gray-200 pt-7 dark:border-neutral-800">
              {capabilities.map((capability) => (
                <div key={capability.value}>
                  <p className="text-2xl font-bold text-orange-500">
                    {capability.value}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-neutral-100">
                    {capability.label}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-neutral-400">
                    {capability.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {principles.map((principle) => (
            <article
              key={principle.title}
              className="enterprise-card group p-6 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/30">
                <span className="material-symbols-outlined">
                  {principle.icon}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-neutral-100">
                {principle.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-neutral-400">
                {principle.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8 flex flex-col gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-7 dark:border-neutral-800 dark:bg-neutral-900/70 lg:flex-row lg:items-center lg:justify-between lg:p-9">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Keep exploring
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-100">
              Have a question or an idea for IndianMatter?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-neutral-400">
              We would be glad to hear what would make your research workflow
              more useful.
            </p>
          </div>
          <Link
            to="/dashboard/contactus"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 active:scale-[0.98]"
          >
            Contact us
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
          </Link>
        </section>
      </main>
    </div>
  );
}

/*
  Design direction: warm editorial enterprise UI.
  The page reuses the existing neutral surfaces, orange accent, material icons,
  rounded cards, dark/light theme utilities, and Contact Us layout language.
*/
export const aboutUsDesignNotes = {
  visualStyle: "Warm editorial enterprise UI",
  primaryAccent: "orange-500",
  route: "/dashboard/aboutus",
};

// Keep the design notes export from being tree-shaken as an accidental page dependency.
void aboutUsDesignNotes;
