import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import MyMealPlans from "./pages/MyMealPlans";
import NutritionTracking from "./pages/NutritionTracking";
import Recipes from "./pages/Recipes";
import Dashboard from "./pages/Dashboard";
import RecipeDetail from "./pages/RecipeDetail";
import MealPlanDetail from "./pages/MealPlanDetail";
import CreateMealPlan from "./pages/CreateMealPlan";
import CommunityRecipes from "./pages/CommunityRecipes";
import MealCategories from "./pages/MealCategories";
import { FoodScanner } from "./components/FoodScanner";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import HealthTools from "./pages/HealthTools";
import ShoppingList from "./pages/ShoppingList";
import WaterTracking from "./pages/WaterTracking";
import WeightTracking from "./pages/WeightTracking";
import MySubscription from "./pages/MySubscription";
import Ingredients from "./pages/Ingredients";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/nutrition-tracking" element={<NutritionTracking />} />
            <Route path="/my-meal-plans" element={<MyMealPlans />} />
            <Route path="/meal-plan/:id" element={<MealPlanDetail />} />
            <Route path="/create-meal-plan" element={<CreateMealPlan />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/community-recipes" element={<CommunityRecipes />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/food-scanner" element={<FoodScanner />} />
            <Route path="/health-tools" element={<HealthTools />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
            <Route path="/water-tracking" element={<WaterTracking />} />
            <Route path="/weight-tracking" element={<WeightTracking />} />
            <Route path="/my-subscription" element={<MySubscription />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AdminDashboard />} />
            <Route path="/admin/recipes" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<AdminDashboard />} />
            <Route path="/admin/meal-categories" element={<MealCategories />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
