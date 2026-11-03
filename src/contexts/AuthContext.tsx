import React, { createContext, useContext, useState, useEffect } from "react";
/**
 * AuthContext — client-side-only authentication provider.
 *
 * There is NO backend auth: the "session" is just a JSON user profile in
 * localStorage ("userProfile") plus a fake timestamp token ("accessToken").
 * A default developer identity ("Dr. Subodh Kumar") is auto-seeded whenever no
 * stored profile exists, so app pages render immediately during development.
 * Consumers: ProtectedRoute (auth gate), TopHeader/Sidebar (profile display and
 * sign-out), SignInPage (form + Google credential handoff).
 */
/** Shape of the persisted user object: display name, email, optional avatar
 *  URL, and the provider that supplied ("signed in") the identity. */
export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  isGoogle?: boolean;
  provider?: "google" | "email" | "github";
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  signIn: (data: Partial<UserProfile>) => void;
  signInWithGoogle: (data?: Partial<UserProfile>) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "userProfile";
const TOKEN_KEY = "accessToken";

const DEFAULT_DEV_USER: UserProfile = {
  name: "Dr. Subodh Kumar",
  email: "researcher@indianmatter.org",
  provider: "email",
};

/**
 * AuthProvider — holds the single source of auth state and persists it to
 * localStorage on every change. Wraps the whole router in App.tsx so any
 * component can call useAuth().
 */
// ══════════════════════════════════════════════════════════════════════════════
// SECTION — AUTH CONTEXT (client-side only: localStorage userProfile + accessToken)
// ══════════════════════════════════════════════════════════════════════════════

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializer: reads the stored profile; if none exists (or storage
  // throws, e.g. private mode), seeds DEFAULT_DEV_USER + a fake dev token so
  // the app behaves as "signed in" out of the box in development.
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      // Auto-initialize default researcher user in local development
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DEV_USER));
      localStorage.setItem(TOKEN_KEY, "dev_token_" + Date.now());
      return DEFAULT_DEV_USER;
    } catch {
      return DEFAULT_DEV_USER;
    }
  });

  // Keep state in sync with localStorage across browser tabs/windows
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  /**
   * signIn — generic email/name sign-in used by the SignInPage form (and by
   * Google credential fallbacks). Accepts partial profile data and normalizes
   * it: guesses "google vs email" flavor from the address, appends a domain to
   * bare usernames, derives a display name from the email local-part if none
   * was typed, and picks a default avatar for Google identities. Writes both
   * localStorage keys and flips React state to authenticated.
   */
  const signIn = (data: Partial<UserProfile>) => {
    const rawEmail = (data.email || "").trim();
    const isGoogle =
      data.isGoogle ??
      (rawEmail.toLowerCase().includes("gmail.com") ||
        rawEmail.toLowerCase().includes("google.com"));

    let email = rawEmail;
    if (!email) {
      email = isGoogle ? "subodh.matter@gmail.com" : "researcher@indianmatter.org";
    } else if (!email.includes("@")) {
      email = `${email}@${isGoogle ? "gmail.com" : "indianmatter.org"}`;
    }

    let name = (data.name || "").trim();
    if (!name) {
      name = email.includes("@") ? email.split("@")[0] : email;
      // Capitalize first letter
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }

    const newUser: UserProfile = {
      name,
      email,
      isGoogle,
      provider: data.provider || (isGoogle ? "google" : "email"),
      avatar:
        data.avatar ||
        (isGoogle
          ? "https://lh3.googleusercontent.com/a/default-user=s96-c"
          : undefined),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    localStorage.setItem(TOKEN_KEY, "token_" + Date.now());
    setUser(newUser);
  };

  /**
   * signInWithGoogle — handoff point for the Google One Tap / OAuth credential
   * flow (SignInPage). Uses the decoded credential fields if provided, else
   * falls back to the Dr. Subodh Kumar identity; stores the profile with a
   * "google_token_*" fake token and sets state.
   */
  const signInWithGoogle = (data?: Partial<UserProfile>) => {
    const googleUser: UserProfile = {
      name: data?.name || "Dr. Subodh Kumar",
      email: data?.email || "subodh.matter@gmail.com",
      avatar:
        data?.avatar ||
        "https://lh3.googleusercontent.com/a/default-user=s96-c",
      isGoogle: true,
      provider: "google",
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(googleUser));
    localStorage.setItem(TOKEN_KEY, "google_token_" + Date.now());
    setUser(googleUser);
  };

  // signOut — clears both localStorage keys and nulls the user, which makes
  // isAuthenticated false, so ProtectedRoute immediately redirects the next
  // navigation (and current render) to /signin.
  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        signIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** useAuth — hook accessor for the auth context. Throws if a component tries
 *  to consume it outside <AuthProvider>, surfacing wiring mistakes early. */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
