import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "./contexts/ThemeProvider";
/**
 * Application entry point.
 *
 * Role: mounts the React root onto #root and wraps <App /> in the two global
 * providers the entire SPA depends on:
 *   1. <GoogleOAuthProvider> — supplies the OAuth client ID used by
 *      @react-oauth/google (consumed by SignInPage for "Sign in with Google").
 *   2. <ThemeProvider> — dark/light theme context read by MainLayout,
 *      PublicLayout, and most leaf components.
 *
 * React.StrictMode double-invokes renders/effects in development only; it is
 * a safety net for side-effect bugs. Importing ./index.css applies the global
 * Tailwind/base styles. No routes are registered here — see ./App.
 */

// Note: Replace this with your actual Google Client ID from the Google Cloud Console
const GOOGLE_CLIENT_ID =
  "635274602034-pjssntimvqimvijg8t0murgnpmvdus0o.apps.googleusercontent.com";

// Non-null assertion: index.html is guaranteed to contain the #root div.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
