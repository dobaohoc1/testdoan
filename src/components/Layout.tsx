import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AuthButton } from "./AuthButton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { MobileBottomNav } from "./MobileBottomNav";
import { QuickActionFAB } from "./QuickActionFAB";
import { OnboardingTour } from "./OnboardingTour";
import { GlobalSearch } from "./GlobalSearch";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Pages that don't need sidebar (landing, auth)
  const noSidebarPages = ["/", "/auth", "/about", "/contact", "/pricing"];
  const isNoSidebarPage = noSidebarPages.includes(location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-soft">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || isNoSidebarPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Header - Mobile optimized */}
        <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 sm:px-6 shadow-xs">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h1 
              className="font-bold text-lg sm:text-xl gradient-text cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={() => navigate('/')}
            >
              ThucdonAI
            </h1>
          </div>
          
          {/* Global Search - Hidden on mobile, shown on md+ */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <GlobalSearch />
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/profile')}
              className="h-9 w-9 rounded-full hover:bg-muted hidden md:flex"
            >
              <User className="h-5 w-5" />
            </Button>
            <AuthButton />
          </div>
        </header>

        <AppSidebar />

        <main className="flex-1 pt-16 pb-20 md:pb-6">
          <div className="p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </main>

        {/* Mobile bottom navigation */}
        <MobileBottomNav />
        
        {/* Quick action FAB (desktop only) */}
        <QuickActionFAB />
        
        {/* Onboarding tour for new users */}
        <OnboardingTour />
      </div>
    </SidebarProvider>
  );
};
