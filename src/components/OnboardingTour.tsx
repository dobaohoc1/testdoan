import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Utensils, 
  Calendar, 
  Camera, 
  Droplets, 
  Scale, 
  ShoppingCart,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string;
}

const tourSteps: TourStep[] = [
  {
    title: "Chào mừng đến ThucdonAI!",
    description: "Hãy để chúng tôi hướng dẫn bạn khám phá các tính năng chính của ứng dụng.",
    icon: <Sparkles className="h-12 w-12 text-primary" />,
  },
  {
    title: "Quét thực phẩm bằng AI",
    description: "Chụp ảnh món ăn để AI phân tích dinh dưỡng tự động. Nhận thông tin về calo, protein, carb và nhiều hơn nữa.",
    icon: <Camera className="h-12 w-12 text-primary" />,
    highlight: "food-scanner",
  },
  {
    title: "Lập kế hoạch bữa ăn",
    description: "Tạo kế hoạch bữa ăn hàng tuần với sự hỗ trợ của AI. Đảm bảo chế độ ăn cân bằng và phù hợp với mục tiêu.",
    icon: <Calendar className="h-12 w-12 text-primary" />,
    highlight: "meal-plans",
  },
  {
    title: "Khám phá công thức",
    description: "Tìm kiếm và lưu các công thức nấu ăn lành mạnh. Xem hướng dẫn chi tiết và thông tin dinh dưỡng.",
    icon: <Utensils className="h-12 w-12 text-primary" />,
    highlight: "recipes",
  },
  {
    title: "Theo dõi nước uống",
    description: "Đặt mục tiêu và theo dõi lượng nước uống hàng ngày. Nhận nhắc nhở uống nước đều đặn.",
    icon: <Droplets className="h-12 w-12 text-primary" />,
    highlight: "water-tracking",
  },
  {
    title: "Theo dõi cân nặng",
    description: "Ghi lại và theo dõi cân nặng theo thời gian. Xem biểu đồ tiến trình để đạt mục tiêu.",
    icon: <Scale className="h-12 w-12 text-primary" />,
    highlight: "weight-tracking",
  },
  {
    title: "Danh sách mua sắm",
    description: "Tự động tạo danh sách mua sắm từ kế hoạch bữa ăn. Không bao giờ quên mua nguyên liệu nữa!",
    icon: <ShoppingCart className="h-12 w-12 text-primary" />,
    highlight: "shopping-list",
  },
];

const TOUR_COMPLETED_KEY = "thucdonai_tour_completed";

export const OnboardingTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY);
    if (!tourCompleted) {
      // Delay showing tour to let the app load
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(TOUR_COMPLETED_KEY, "true");
    setIsOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem(TOUR_COMPLETED_KEY, "true");
    setIsOpen(false);
  };

  // Reset tour for testing
  const resetTour = () => {
    localStorage.removeItem(TOUR_COMPLETED_KEY);
    setCurrentStep(0);
    setIsOpen(true);
  };

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleSkip}
      />
      
      {/* Tour Card */}
      <Card className="relative z-10 w-full max-w-md animate-scale-in shadow-2xl border-primary/20">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 rounded-full"
          onClick={handleSkip}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
            {step.icon}
          </div>
          <CardTitle className="text-xl">{step.title}</CardTitle>
          <CardDescription className="text-base mt-2">
            {step.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-2">
          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? "w-6 bg-primary" 
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between gap-2 pt-2">
          <Button
            variant="ghost"
            onClick={isFirstStep ? handleSkip : handlePrev}
            className="flex-1"
          >
            {isFirstStep ? (
              "Bỏ qua"
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Trước
              </>
            )}
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1"
          >
            {isLastStep ? (
              "Bắt đầu!"
            ) : (
              <>
                Tiếp
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Export reset function for settings page
export const resetOnboardingTour = () => {
  localStorage.removeItem(TOUR_COMPLETED_KEY);
  window.location.reload();
};
