import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "./contexts/ThemeProvider";

// Note: Replace this with your actual Google Client ID from the Google Cloud Console
const GOOGLE_CLIENT_ID =
  "635274602034-pjssntimvqimvijg8t0murgnpmvdus0o.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
