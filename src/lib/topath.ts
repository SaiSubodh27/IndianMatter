// Research Atelier style reminder: make system state and provenance visible; a disconnected assistant must be clear, calm, and actionable.

/**
 * DEAD CODE — this module is defined but has NO consumers anywhere in src/.
 * It targets a `/chat` endpoint on VITE_TOPATH_URL that is not part of the
 * IndianMatter backend. Kept for reference only; safe to delete.
 */

export type ToPathResponse = {
  response: string;
  path_used?: number;
  routing_tier?: string;
  routing_reason?: string;
  model_used?: string;
  tokens_used?: number;
  total_cost_usd?: number;
  fallback_triggered?: boolean;
  fallback_reason?: string;
};

const topathUrl = (
  import.meta.env.VITE_TOPATH_URL || "http://localhost:8000"
).replace(/\/$/, "");

export async function askToPath(
  message: string,
  sessionId: string,
  signal?: AbortSignal,
): Promise<ToPathResponse> {
  const response = await fetch(`${topathUrl}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`To-Path returned ${response.status}`);
  }

  return response.json() as Promise<ToPathResponse>;
}

export { topathUrl };
