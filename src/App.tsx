import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppStateProvider } from "@/lib/AppStateContext";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import Index from "./pages/Index.tsx";
import PhotoAlbums from "./pages/PhotoAlbums.tsx";
import PhotoVideoEdit from "./pages/PhotoVideoEdit.tsx";
import Auth from "./pages/Auth.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (!session) return <Navigate to="/auth" replace />;
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppStateProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/photo-albums" element={<ProtectedRoute><PhotoAlbums /></ProtectedRoute>} />
              <Route path="/photo-video-edit" element={<ProtectedRoute><PhotoVideoEdit /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppStateProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
