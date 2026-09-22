import React, { createContext, useContext, useState, useEffect } from "react";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
