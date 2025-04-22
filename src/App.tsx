import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/context/QueryContext";
import { CommunityProvider } from "@/context/CommunityContext";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import AskQuery from "./pages/AskQuery";
import QueryDetail from "./pages/QueryDetail";
import Profile from "./pages/Profile";
import ShareMaterials from "./pages/ShareMaterials";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CommunityProvider>
          <QueryProvider>
            <BrowserRouter>
              <Navbar />
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/ask" element={<AskQuery />} />
                <Route path="/share-materials" element={<ShareMaterials />} />
                <Route path="/query/:id" element={<QueryDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </QueryProvider>
        </CommunityProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
