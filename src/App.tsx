import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import PublicLayout from "./layouts/PublicLayout";

import LandingPage from "./pages/public/LandingPage";
import ResearchPapersPage from "./pages/public/ResearchPapersPage";
import SignInPage from "./pages/public/SignInPage";

import DashboardPage from "./pages/dashboard/DashboardPage";
import MaterialsSearchPage from "./pages/materials/MaterialsSearchPage";
import MaterialDetailsPage from "./pages/materials/MaterialDetailsPage";
import AdvancedSearchPage from "./pages/materials/AdvancedSearchPage";
import DFTValidationPage from "./pages/dft/DFTValidationPage";
import CIFGenerationPage from "./pages/cif/CIFGenerationPage";
import BatchPredictionPage from "./pages/prediction/BatchPredictionPage";
import PropertyPredictionPage from "./pages/prediction/PropertyPredictionPage";
import StructureVizPage from "./pages/structure/StructureVizPage";
import LiteraturePage from "./pages/literature/LiteraturePage";
import SavedResultsPage from "./pages/results/SavedResultsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import HelpPage from "./pages/help/HelpPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
/**
 * Root component and single source of truth for all client-side routes.
 *
 * Structure: <BrowserRouter> → <AuthProvider> → <Routes> nest three route
 * shells:
 *   • PublicLayout shell (/, /signin, plus /research which redirects into the
 *     authenticated literature page) — rendered when signed out.
 *   • /app shell — the canonical authenticated workspace: every child route is
 *     wrapped by <ProtectedRoute>, which renders <MainLayout> only if a user
 *     profile exists in localStorage (client-side auth only), otherwise
 *     redirects to /signin.
 *   • Top-level "product URL" shells (/dashboard, /materials-search,
 *     /materials/:id, /literature-diversity, /saved-results, /settings,
 *     /help-support) — aliases mounted at the bare root, each carrying its own
 *     ProtectedRoute+MainLayout pair and rendering the same page components as
 *     their /app counterparts, so shared/generated links hit canonical URLs
 *     while legacy /app links keep working.
 * A global catch-all "*" redirects unknown paths back to the landing page.
 *
 * Imported by src/main.tsx; imports all page components plus layouts,
 * AuthContext, and ProtectedRoute. Reads no external data itself.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* Supplies useAuth(); ProtectedRoute consumes it */}
        <Routes>
          {/* Public Shell Routes — PublicLayout provides the marketing chrome */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            {/* Legacy /research URL now lives behind auth; bounce to /app/literature */}
            <Route path="/research" element={<Navigate to="/app/literature" replace />} />
            <Route path="/signin" element={<SignInPage />} />
          </Route>

          {/* Authenticated Computational Workspace Routes — nested children
              render inside MainLayout's <Outlet />; ProtectedRoute gates access */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
          <Route path="materials" element={<MaterialsSearchPage />} />
          <Route path="materials/:id" element={<MaterialDetailsPage />} />
          <Route path="advanced-search" element={<AdvancedSearchPage />} />
          <Route path="dft" element={<DFTValidationPage />} />
          <Route path="cif-gen" element={<CIFGenerationPage />} />
          <Route path="predict" element={<PropertyPredictionPage />} />
          <Route path="structures" element={<StructureVizPage />} />
          <Route path="batch" element={<BatchPredictionPage />} />
          <Route path="literature" element={<LiteraturePage />} />
          <Route path="saved" element={<SavedResultsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="help" element={<HelpPage />} />
        </Route>

        {/* Canonical product URLs. Keep the original /app links working while
            exposing the routes used by shared materials-platform navigation. */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dft-validation" element={<DFTValidationPage />} />
          <Route path="cif-generation" element={<CIFGenerationPage />} />
          <Route
            path="property-prediction"
            element={<PropertyPredictionPage />}
          />
          <Route
            path="structure-visualization"
            element={<StructureVizPage />}
          />
          <Route path="batch-prediction" element={<BatchPredictionPage />} />
        </Route>
        <Route
          path="/materials-search"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MaterialsSearchPage />} />
          <Route path="advanced" element={<AdvancedSearchPage />} />
        </Route>
        <Route
          path="/materials"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path=":id" element={<MaterialDetailsPage />} />
        </Route>
        <Route
          path="/literature-diversity"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<LiteraturePage />} />
        </Route>
        <Route
          path="/saved-results"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SavedResultsPage />} />
        </Route>
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SettingsPage />} />
        </Route>
        <Route
          path="/help-support"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HelpPage />} />
        </Route>

        {/* Direct Shortcuts & Global Fallback */}
        {/* Shortcut redirects: /predict maps onto the canonical /app/predict;
            the catch-all sends any unmatched path to the public landing page */}
        <Route path="/predict" element={<Navigate to="/app/predict" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
  );
}
