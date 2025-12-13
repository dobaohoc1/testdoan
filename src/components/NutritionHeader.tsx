import heroImage from "@/assets/nutrition-hero.jpg";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Heart, Brain } from "lucide-react";
import { AuthButton } from "./AuthButton";

export const NutritionHeader = () => {
  return (
    <header className="relative overflow-hidden">
      {/* Background Image với Overlay */}
      <div className="relative h-[500px] sm:h-[600px] md:h-[700px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 hero-gradient" />
        
        {/* Auth Button - Mobile Optimized */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
          <AuthButton />
        </div>
        
        {/* Content - Mobile First */}
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-fade-in">
            <div className="space-y-3 sm:space-y-4">
              <Badge className="glass-card text-primary-foreground border-0 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base shadow-glow animate-float">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                AI Dinh Dưỡng Thông Minh
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
                Thực Đơn Dinh Dưỡng
                <br />
                <span className="text-accent">Cá Nhân Hóa</span>
              </h1>
              
              <p className="text-base sm:text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed px-4">
                Ứng dụng AI tạo thực đơn dinh dưỡng phù hợp với cơ thể và mục tiêu của bạn
              </p>
            </div>

            {/* Features - Mobile Optimized Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 px-2 sm:px-0">
              <div className="glass-card rounded-2xl p-4 sm:p-5 text-primary-foreground transition-smooth hover-lift">
                <Heart className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-destructive animate-bounce-soft" />
                <h3 className="font-bold text-base sm:text-lg mb-1">Sức Khỏe Tối Ưu</h3>
                <p className="text-xs sm:text-sm text-primary-foreground/80">Phù hợp với tình trạng sức khỏe cá nhân</p>
              </div>
              
              <div className="glass-card rounded-2xl p-4 sm:p-5 text-primary-foreground transition-smooth hover-lift">
                <Brain className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-secondary animate-bounce-soft" />
                <h3 className="font-bold text-base sm:text-lg mb-1">AI Thông Minh</h3>
                <p className="text-xs sm:text-sm text-primary-foreground/80">Phân tích và đưa ra gợi ý chính xác</p>
              </div>
              
              <div className="glass-card rounded-2xl p-4 sm:p-5 text-primary-foreground transition-smooth hover-lift sm:col-span-1 col-span-1">
                <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-accent animate-bounce-soft" />
                <h3 className="font-bold text-base sm:text-lg mb-1">Cá Nhân Hóa</h3>
                <p className="text-xs sm:text-sm text-primary-foreground/80">Thực đơn riêng cho từng người</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[40px] sm:h-[60px] md:h-[80px]"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </header>
  );
};