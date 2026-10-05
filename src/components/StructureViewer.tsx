import { useEffect, useRef, useState } from "react";
import { Layers } from "lucide-react";

declare global {
  interface Window {
    $3Dmol?: any;
  }
}

const THREE_DMOL_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.4.2/3Dmol-min.js";

let threeDMolLoadPromise: Promise<any> | null = null;

export function loadThreeDMol(): Promise<any> {
  if (window.$3Dmol) return Promise.resolve(window.$3Dmol);
  if (threeDMolLoadPromise) return threeDMolLoadPromise;

  threeDMolLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${THREE_DMOL_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(window.$3Dmol));
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load 3Dmol.js")),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = THREE_DMOL_SRC;
    script.async = true;
    script.onload = () => resolve(window.$3Dmol);
    script.onerror = () => reject(new Error("Failed to load 3Dmol.js"));
    document.body.appendChild(script);
  });

  return threeDMolLoadPromise;
}

export default function StructureViewer({ cifText }: { cifText: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );

  useEffect(() => {
    if (!cifText || !containerRef.current) {
      setStatus("idle");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    loadThreeDMol()
      .then(($3Dmol) => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = "";

        const viewer = $3Dmol.createViewer(containerRef.current, {
          backgroundColor: "white",
        });
        viewerRef.current = viewer;

        viewer.addModel(cifText, "cif");
        viewer.setStyle(
          {},
          { sphere: { scale: 0.28 }, stick: { radius: 0.1 } },
        );
        try {
          viewer.addUnitCell();
        } catch {
          // unit-cell overlay is best-effort; some CIFs omit full symmetry
        }
        viewer.zoomTo();
        viewer.render();
        if (!cancelled) setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      if (viewerRef.current) {
        try {
          viewerRef.current.clear();
        } catch {
          // no-op
        }
        viewerRef.current = null;
      }
    };
  }, [cifText]);

  if (!cifText) {
    return (
      <div className="text-center space-y-2 p-4 h-full flex flex-col items-center justify-center">
        <Layers className="mx-auto text-[#F1641D]" size={32} />
        <p className="text-xs font-medium text-[#1E2227]">
          Upload a CIF file to preview the 3D crystal structure.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative min-h-[400px]">
      <div ref={containerRef} className="w-full h-full absolute inset-0" />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-[#6C737E] bg-white/70">
          Loading structure viewer…
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-red-600 bg-white/90 px-4 text-center">
          Couldn't load the 3D structure viewer. Check your network
          connection and try again.
        </div>
      )}
    </div>
  );
}
