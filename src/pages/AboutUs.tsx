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
    <div className="relative w-full overflow-hidden bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* Background Decorative Glows */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-[20rem] w-[20rem] rounded-full bg-orange-200/30 blur-[100px] dark:bg-orange-950/15" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-[18rem] w-[18rem] rounded-full bg-gray-200/50 blur-[100px] dark:bg-neutral-800/30" />

      {/* Main Container - Removed fixed height/flex-1 scrolling constraints */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
              About IndianMatter
            </p>
            <h1 className="font-headline text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-100 sm:text-3xl lg:text-4xl">
              Make materials research feel more connected.
            </h1>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-gray-500 dark:text-neutral-400 sm:text-sm lg:max-w-xs">
            A focused workspace for researchers, engineers, and curious minds
            who want to move from materials data to meaningful insight.
          </p>
        </header>

        {/* Purpose / Feature Hero Block */}
        <section className="grid overflow-hidden rounded-2xl bg-black text-white shadow-lg lg:grid-cols-2">
          {/* Left Column */}
          <div className="relative flex min-h-[18rem] flex-col justify-between overflow-hidden p-6 lg:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full border border-orange-400/30" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-orange-500/20 blur-2xl" />

            <div className="relative z-10">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white shadow-md shadow-orange-500/20">
                <span className="material-symbols-outlined text-lg">
                  biotech
                </span>
              </div>
              <h2 className="font-headline max-w-md text-xl font-bold leading-snug lg:text-2xl">
                Better tools create room for better questions.
              </h2>
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-neutral-400">
                Materials science is full of possibilities, but the path from
                raw information to useful understanding can be fragmented. We
                are building IndianMatter to make that path more direct.
              </p>
            </div>

            <div className="relative z-10 mt-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              <span className="h-px w-6 bg-orange-500" />
              Explore. Calculate. Understand.
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-white p-6 text-gray-900 dark:bg-neutral-900 dark:text-neutral-100 lg:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-neutral-500">
              Our purpose
            </p>
            <p className="mt-3 text-lg font-semibold leading-snug tracking-tight lg:text-xl">
              IndianMatter exists to help people spend less time finding their
              way through tools and more time understanding materials.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-gray-200 pt-5 dark:border-neutral-800">
              {capabilities.map((capability) => (
                <div key={capability.value}>
                  <p className="text-lg font-bold text-orange-500">
                    {capability.value}
                  </p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-gray-900 dark:text-neutral-100">
                    {capability.label}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-gray-500 dark:text-neutral-400">
                    {capability.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Principles Grid */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle) => (
            <article
              key={principle.title}
              className="group  border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-950/30">
                <span className="material-symbols-outlined text-lg">
                  {principle.icon}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-neutral-100">
                {principle.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-neutral-400">
                {principle.description}
              </p>
            </article>
          ))}
        </section>

        {/* Contact CTA Section */}
        <section className="mt-6 flex flex-col gap-4  border border-gray-200 bg-gray-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/70 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-500">
              Keep exploring
            </p>
            <h2 className="mt-1 text-lg font-bold tracking-tight text-gray-900 dark:text-neutral-100">
              Have a question or an idea for IndianMatter?
            </h2>
            <p className="mt-1 max-w-xl text-xs text-gray-500 dark:text-neutral-400">
              We would be glad to hear what would make your research workflow
              more useful.
            </p>
          </div>
          <Link
            to="/dashboard/contactus"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-orange-600 active:scale-[0.98]"
          >
            Contact us
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </Link>
        </section>
      </main>
    </div>
  );
}

export const aboutUsDesignNotes = {
  visualStyle: "Warm editorial enterprise UI",
  primaryAccent: "orange-500",
  route: "/dashboard/aboutus",
};

void aboutUsDesignNotes;
