import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Shared Supabase Client & Configuration
 *
 * NOTE: Environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * are read ONLY in this single shared module.
 *
 * DATA SAFETY CONTRACT:
 * - Uses strictly the read-only anonymous key (anon).
 * - Performs SELECT queries ONLY on the `papers` table.
 * - NEVER queries `discovery_checkpoints` or any other table.
 * - NEVER writes, updates, upserts, or deletes data from the client.
 */

const DEFAULT_SUPABASE_URL = "https://oyqjwtkaivigwwgiqxco.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cWp3dGthaXZpZ3d3Z2lxeGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0MzE0NDQsImV4cCI6MjEwNzAwNzQ0NH0.w8ocUueTKZdTNoMy93_kztACxlCDvFSIBCbroX-LfyA";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.DEV) {
    console.warn(
      "[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. " +
        "Ensure .env.local is populated with valid Supabase credentials."
    );
  }
}

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
 * Read-only fetch for published research papers from the `papers` table.
 */
export async function getPublishedPapers(): Promise<{
  data: Paper[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return {
      data: null,
      error: new Error(
        "Supabase credentials are not configured. Please verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
      ),
    };
  }

  try {
    const { data, error } = await supabase
      .from("papers")
      .select("*")
      .order("publication_date", { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: (data as Paper[]) || [], error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Failed to fetch papers"),
    };
  }
}
