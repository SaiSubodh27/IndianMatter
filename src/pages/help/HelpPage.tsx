/**
 * HelpPage — STATIC/MOCK page.
 * Route: /app/help. Static FAQ. No backend call.
 */
import { HelpCircle } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      q: "What graph neural network architectures power property predictions?",
      a: "IndianMatter utilizes M3GNet, ALIGNN, and CHGNet pre-trained on Materials Project 2024.1 datasets, calibrated with 95% confidence intervals.",
    },
    {
      q: "How does DFT validation work?",
      a: "Calculations are dispatched using Quantum ESPRESSO / VASP backend clusters employing PBE, PBEsol, and SCAN meta-GGA exchange-correlation functionals.",
    },
    {
      q: "Which CIF format versions are supported for batch screening?",
      a: "The parser supports standard CIF 1.1, CIF3, and CIF5 specifications. Malformed files are flagged in the pre-flight verification queue.",
    },
  ];

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-8 px-4 sm:px-8 py-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F1641D] font-headline mb-1">
          <HelpCircle size={14} /> Knowledge & Documentation
        </div>
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-[#1E2227]">
          Help & Scientific Support
        </h1>
        <p className="text-sm text-[#6C737E] max-w-2xl mt-1">
          Reference documentation on crystallographic conventions, machine learning model benchmarks, and computational methodology.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* FAQs */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-card border border-[#EFE5DC] space-y-5">
          <h3 className="font-headline font-bold text-lg text-[#1E2227]">Frequently Asked Questions</h3>
          <div className="space-y-4 text-xs">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#FAF4EE] p-4 rounded-xl border border-[#EFE5DC] space-y-1.5">
                <p className="font-bold text-[#1E2227]">{faq.q}</p>
                <p className="text-[#5F6771] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Lab Support */}
        <div className="bg-[#FAF4EE] rounded-[2rem] p-6 sm:p-8 border border-[#EFE5DC] flex items-center justify-between gap-4">
          <div>
            <h4 className="font-headline font-bold text-base text-[#1E2227]">Need Dedicated Research Support?</h4>
            <p className="text-xs text-[#6C737E] mt-0.5">
              Contact our computational physics advisory team for custom functional setup or large-scale batch processing.
            </p>
          </div>
          <button
            onClick={() => alert("Support ticket created. A computational scientist will respond within 4 hours.")}
            className="px-5 py-2.5 bg-[#F1641D] text-white rounded-xl text-xs font-semibold hover:bg-[#D9520F] transition-all shadow-soft shrink-0"
          >
            Submit Research Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
