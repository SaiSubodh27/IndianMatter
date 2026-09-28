import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import PublicLayout from "./layouts/PublicLayout";

import LandingPage from "./pages/public/LandingPage";
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Shell Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignInPage />} />
          </Route>

          {/* Authenticated Computational Workspace Routes */}
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
        <Route path="/predict" element={<Navigate to="/app/predict" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
  );
}
