import { useEffect, useRef, useState } from "react";

// 3Dmol.js is loaded from its CDN build at runtime rather than bundled via
// npm — its official build targets a global `$3Dmol`, and pulling it in as
// an ES import tends to fight with Vite/webpack over its internal jQuery-ish
// dependencies. This keeps the component drop-in with zero extra installs.
declare global {
  interface Window {
    $3Dmol: any;
  }
}

const THREEDMOL_SRC = "https://3Dmol.org/build/3Dmol-min.js";

let loadPromise: Promise<any> | null = null;

function load3Dmol(): Promise<any> {
  if (window.$3Dmol) return Promise.resolve(window.$3Dmol);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${THREEDMOL_SRC}"]`,
    ) as HTMLScriptElement | null;

    const onLoad = () => resolve(window.$3Dmol);
    const onError = () => reject(new Error("Failed to load 3Dmol.js"));

    if (existing) {
      existing.addEventListener("load", onLoad, { once: true });
      existing.addEventListener("error", onError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = THREEDMOL_SRC;
    script.async = true;
    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
    document.head.appendChild(script);
  });

  return loadPromise;
}

export type ViewerStyle = "sphere" | "stick" | "line";

export interface ViewerControls {
  resetView: () => void;
  toggleUnitCell: () => void;
  setStyle: (style: ViewerStyle) => void;
}

export interface ElementLegendEntry {
  symbol: string;
  color: string; // CSS hex, as assigned by 3Dmol's default (Jmol/CPK) scheme
  count: number;
}

interface StructureViewerProps {
  /** Raw CIF file contents for the structure to render. */
  cifData: string;
  backgroundColor?: string;
  initialStyle?: ViewerStyle;
  showUnitCell?: boolean;
  /** Fired once the viewer is initialized, exposing imperative controls
   * for parent components (Reset View / Toggle Unit Cell buttons, etc). */
  onViewerReady?: (controls: ViewerControls) => void;
  /** Fired once atoms are loaded, listing each element present and the
   * exact color 3Dmol assigned it — build a color legend from this rather
   * than hardcoding a color table, so it always matches what's on screen. */
  onElementsResolved?: (elements: ElementLegendEntry[]) => void;
}

export default function StructureViewer({
  cifData,
  backgroundColor = "#f4f4f5",
  initialStyle = "sphere",
  showUnitCell = true,
  onViewerReady,
  onElementsResolved,
}: StructureViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const unitCellOnRef = useRef(showUnitCell);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setErrorMessage(null);

    const applyStyle = (viewer: any, style: ViewerStyle) => {
      if (style === "sphere") {
        viewer.setStyle(
          {},
          { sphere: { scale: 0.35 }, stick: { radius: 0.12 } },
        );
      } else if (style === "stick") {
        viewer.setStyle({}, { stick: { radius: 0.18 } });
      } else {
        viewer.setStyle({}, { line: { linewidth: 2 } });
      }
    };

    const redrawUnitCell = (viewer: any, $3Dmol: any) => {
      // 3Dmol doesn't expose a single "remove unit cell" call, so the
      // reliable way to toggle it is to clear shapes and re-add if needed.
      viewer.removeAllShapes();
      if (unitCellOnRef.current) {
        viewer.addUnitCell(viewer.getModel(), {
          box: { color: "gray" },
        });
      }
      viewer.render();
      void $3Dmol;
    };

    load3Dmol()
      .then(($3Dmol) => {
        if (cancelled || !containerRef.current) return;

        const viewer = $3Dmol.createViewer(containerRef.current, {
          backgroundColor,
        });
        viewerRef.current = viewer;

        viewer.addModel(cifData, "cif");

        const atomCount = viewer.getModel().selectedAtoms({}).length;
        if (atomCount === 0) {
          // 3Dmol parsed the file without throwing, but produced zero
          // atoms — usually means the CIF relies on symmetry operators
          // or a loop layout its parser doesn't expand automatically.
          console.error(
            "3Dmol loaded this CIF but found 0 atoms. Raw CIF:",
            cifData,
          );
          if (!cancelled) {
            setErrorMessage(
              "This CIF loaded, but no atoms could be read from it. It may rely on symmetry operators the viewer doesn't expand — try a CIF with explicit atom_site coordinates for every atom.",
            );
            setStatus("error");
          }
          return;
        }

        applyStyle(viewer, initialStyle);
        unitCellOnRef.current = showUnitCell;
        if (showUnitCell) {
          viewer.addUnitCell(viewer.getModel(), { box: { color: "gray" } });
        }

        viewer.zoomTo();
        viewer.render();
        setStatus("ready");

        if (onElementsResolved) {
          const atoms = viewer.getModel().selectedAtoms({});
          const bySymbol = new Map<string, { color: string; count: number }>();

          for (const atom of atoms) {
            const symbol: string = atom.elem;
            const colorNum: number =
              typeof atom.color === "number" ? atom.color : 0x888888;
            const hex = `#${colorNum.toString(16).padStart(6, "0")}`;

            const existing = bySymbol.get(symbol);
            if (existing) {
              existing.count += 1;
            } else {
              bySymbol.set(symbol, { color: hex, count: 1 });
            }
          }

          const legend: ElementLegendEntry[] = Array.from(
            bySymbol.entries(),
          ).map(([symbol, { color, count }]) => ({ symbol, color, count }));

          onElementsResolved(legend);
        }

        if (onViewerReady) {
          onViewerReady({
            resetView: () => {
              viewer.zoomTo();
              viewer.render();
            },
            toggleUnitCell: () => {
              unitCellOnRef.current = !unitCellOnRef.current;
              redrawUnitCell(viewer, $3Dmol);
            },
            setStyle: (style) => {
              applyStyle(viewer, style);
              viewer.render();
            },
          });
        }
      })
      .catch((err) => {
        console.error("3Dmol viewer failed to initialize:", err);
        if (!cancelled) {
          setErrorMessage(
            "Couldn't load the 3D viewer engine — check your internet connection (it loads from 3Dmol.org) and reload.",
          );
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
      if (viewerRef.current) {
        viewerRef.current.clear();
        viewerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cifData]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-neutral-950/80">
          <span className="material-symbols-outlined animate-spin text-3xl text-gray-400 dark:text-neutral-600">
            progress_activity
          </span>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-neutral-950">
          <p className="max-w-xs text-center text-sm text-rose-600 dark:text-rose-400">
            {errorMessage ?? "Couldn't render this structure."}
          </p>
        </div>
      )}
    </div>
  );
}
