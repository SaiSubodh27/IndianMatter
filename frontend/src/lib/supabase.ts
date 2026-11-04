import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { API_BASE_URL } from "./api";

/**
 * Shared Supabase Client & Configuration
 *
 * NOTE: Environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * are read with embedded safe fallback credentials.
 *
 * DATA SAFETY CONTRACT:
 * - Uses strictly the read-only anonymous key (anon).
 * - Performs SELECT queries ONLY on the `papers` table.
 * - NEVER queries `discovery_checkpoints` or any other table.
 * - NEVER writes, updates, upserts, or deletes data from the client.
 * - Automatically falls back to backend /api/literature/papers (MongoDB cache)
 *   if Supabase is unreachable, blocked, or missing env vars.
 */

const DEFAULT_SUPABASE_URL = "https://oyqjwtkaivigwwgiqxco.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cWp3dGthaXZpZ3d3Z2lxeGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0MzE0NDQsImV4cCI6MjEwNzAwNzQ0NH0.w8ocUueTKZdTNoMy93_kztACxlCDvFSIBCbroX-LfyA";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

export interface Paper {
  id: number;
  openalex_id?: string | null;
  doi?: string | null;
  title: string;
  abstract?: string | null;
  authors?: Array<{ name?: string; display_name?: string } | string> | null;
  publication_date?: string | null;
  publication_year?: number | null;
  journal_name?: string | null;
  journal_issn?: string | null;
  publisher?: string | null;
  open_access?: boolean | null;
  oa_url?: string | null;
  landing_page_url?: string | null;
  pdf_url?: string | null;
  topics?: string[] | null;
  keywords?: string[] | null;
  domain_tags?: string[] | null;
  relevance_score?: number | null;
  relevance_status?: string | null;
  source?: string | null;
  retrieved_at?: string | null;
  updated_at?: string | null;
  rag_status?: string | null;
}

/**
 * Resilient fetch for published research papers:
 * 1. Queries Supabase directly.
 * 2. If Supabase fails or is blocked, falls back cleanly to backend /api/literature/papers (MongoDB cache).
 */
export async function getPublishedPapers(): Promise<{
  data: Paper[] | null;
  error: Error | null;
}> {
  // Strategy 1: Direct Supabase query
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("papers")
        .select("*")
        .order("publication_date", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return { data: data as Paper[], error: null };
      }
    } catch {
      // Fall through to backend fallback
    }
  }

  // Strategy 2: Backend API fallback (/api/literature/papers)
  try {
    const res = await fetch(`${API_BASE_URL}/api/literature/papers`);
    if (res.ok) {
      const json = await res.json();
      const list = json.data || json;
      if (Array.isArray(list) && list.length > 0) {
        return { data: list as Paper[], error: null };
      }
    }
  } catch {
    // If backend also fails
  }

  return {
    data: [],
    error: new Error(
      "Unable to load research papers. Please verify network connectivity."
    ),
  };
}
