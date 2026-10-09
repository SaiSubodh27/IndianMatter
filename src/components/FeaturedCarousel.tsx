import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Atom } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tools = [
  {
    id: "01",
    title: "DFT Validation",
    desc: "Validate properties against density functional theory calculations.",
    features: ["High Accuracy", "Ab Initio", "Energy & Forces"],
    path: "/app/predict",
    buttonLeft: false
  },
  {
    id: "02",
    title: "CIF Generation",
    desc: "Generate accurate CIF files from compounds and known structures.",
    features: ["VASP Ready", "Space Groups", "Lattice Params"],
    path: "/app/cif-gen",
    buttonLeft: true
  },
  {
    id: "03",
    title: "Property Prediction",
    desc: "Predict intrinsic material properties using state-of-the-art ML.",
    features: ["Band Gap", "Formation Energy", "Conductivity"],
    path: "/app/predict",
    buttonLeft: false
  },
  {
    id: "04",
    title: "Structure Visualization",
    desc: "Interactive 3D viewing for molecules and crystal lattices.",
    features: ["Bonds & Atoms", "Supercells", "Unit Cell"],
    path: "/app/structures",
    buttonLeft: true
  },
  {
    id: "05",
    title: "Batch Prediction",
    desc: "Process multiple materials simultaneously for rapid screening.",
    features: ["High Throughput", "Export Results", "Multi-model"],
    path: "/app/batch",
    buttonLeft: false
  }
];

export default function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const next = () => setCurrentIndex((p) => (p + 1) % tools.length);
  const prev = () => setCurrentIndex((p) => (p - 1 + tools.length) % tools.length);

  return (
    <div className="relative w-full max-w-5xl mx-auto py-12">
      <div className="flex items-center justify-between mb-8 px-4">
        <h2 className="text-3xl font-headline font-bold text-im-text">Featured Tools</h2>
        <div className="flex gap-3">
          <button onClick={prev} className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-im-textLight hover:text-im-primary transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-im-textLight hover:text-im-primary transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative h-96 overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out h-full" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {tools.map((tool) => (
            <div key={tool.id} className="min-w-full px-4 h-full flex items-center justify-center">
              {/* Back Frame */}
              <div className="relative w-full max-w-4xl h-72 bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/40 shadow-sm flex items-center">
                
                {/* Front Card (Slightly rotated) */}
                <div className={`absolute inset-y-0 w-3/5 bg-white rounded-2xl shadow-card p-10 flex flex-col justify-between transition-transform transform hover:-translate-y-2 ${
                  tool.buttonLeft ? "right-8" : "left-8"
                }`}>
                  
                  <div>
                    <span className="text-im-primary font-bold text-lg mb-2 block">{tool.id}</span>
                    <h3 className="text-2xl font-headline font-bold text-im-text mb-3">{tool.title}</h3>
                    <p className="text-im-textLight text-sm leading-relaxed mb-6">{tool.desc}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {tool.features.map(f => (
                        <span key={f} className="px-3 py-1 bg-im-bg rounded-full text-xs font-medium text-im-textLight">{f}</span>
                      ))}
                    </div>
                  </div>

                  <div className={`mt-8 flex ${tool.buttonLeft ? "justify-start" : "justify-end"}`}>
                    <button 
                      onClick={() => navigate(tool.path)}
                      className="flex items-center gap-2 bg-im-primary text-white px-6 py-3 rounded-full font-medium hover:bg-im-primaryHover transition-colors shadow-soft"
                    >
                      Launch Tool <ArrowRight size={18} />
                    </button>
                  </div>

                </div>

                {/* Decorative side space inside back frame */}
                <div className={`absolute w-2/5 h-full flex flex-col items-center justify-center p-8 ${
                  tool.buttonLeft ? "left-0" : "right-0"
                }`}>
                  <div className="w-32 h-32 rounded-full border border-dashed border-im-primary/30 flex items-center justify-center">
                    <Atom size={48} className="text-im-primary/40" />
                  </div>
                  <p className="mt-6 font-handwriting text-im-primary/60 text-sm">Precision insights</p>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
