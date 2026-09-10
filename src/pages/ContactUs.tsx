import { useState } from "react";

type SendState = "idle" | "sending" | "sent";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none";

// Social icon slots for the black panel — swap the href/aria-label pairs
// once real profile links exist.
const socialLinks: { icon: string; href: string; label: string }[] = [
  { icon: "public", href: "#", label: "Website" },
  { icon: "link", href: "#", label: "LinkedIn" },
  { icon: "photo_camera", href: "#", label: "Instagram" },
];

export default function ContactUs() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sendState, setSendState] = useState<SendState>("idle");

  const canSubmit = firstName.trim() && email.trim() && message.trim();

  // No backend endpoint exists for this yet — replace this handler with a
  // real POST to e.g. /api/contact once that route exists on the backend.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSendState("sending");
    setTimeout(() => setSendState("sent"), 600);
  };

  return (
    <div className="enterprise-page relative flex w-full flex-1 flex-col overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 h-[800px] w-[800px] rounded-full bg-gray-200/70 blur-[150px] dark:bg-neutral-800/40" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-gray-300/40 blur-[120px] dark:bg-neutral-700/30" />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 overflow-y-auto p-6 lg:p-10">
        <header className="mb-8">
          <h1 className="font-headline mb-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-neutral-100 lg:text-5xl">
            Contact us
          </h1>
        </header>

        {/* This card intentionally stays light/black regardless of app
            theme, matching the reference design exactly. */}
        <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-[360px_1fr]">
          {/* Left — info panel. Fill in real details below when ready. */}
          <div className="flex flex-col justify-between bg-black p-8 text-white lg:m-6 lg:rounded-2xl">
            <div>
              <h2 className="font-headline text-2xl font-bold">
                Contact information
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                If you have any questions, feel free to get in touch with us.
              </p>

              <div className="mt-10 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg text-neutral-400">
                    call
                  </span>
                  {/* TODO: replace with real phone number */}
                  <span className="text-sm text-neutral-300">
                    Add phone number
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg text-neutral-400">
                    mail
                  </span>
                  {/* TODO: replace with real email address */}
                  <span className="text-sm text-neutral-300">
                    Add email address
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg text-neutral-400">
                    location_on
                  </span>
                  {/* TODO: replace with real address */}
                  <span className="text-sm text-neutral-300">Add address</span>
                </div>
              </div>

              <div className="mt-10 flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-neutral-400">
                  schedule
                </span>
                <div>
                  {/* TODO: replace with real hours */}
                  <p className="text-xs text-neutral-500">Monday – Friday</p>
                  <p className="text-sm text-neutral-300">Add hours</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 text-neutral-300 transition-colors hover:border-neutral-400 hover:text-white"
                >
                  <span className="material-symbols-outlined text-base">
                    {s.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="p-8 lg:p-10">
            {sendState === "sent" ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
                <span className="material-symbols-outlined text-4xl text-gray-900">
                  check_circle
                </span>
                <p className="text-sm font-semibold text-gray-700">
                  Message sent.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setPhone("");
                    setMessage("");
                    setSendState("idle");
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-700"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                      First name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                      Last name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 0000 000 000"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message"
                    rows={5}
                    className={`${inputClass} resize-none`}
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={!canSubmit || sendState === "sending"}
                    className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {sendState === "sending" ? "Sending..." : "Send message"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
