import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Sparkles, Heart, Brain, Target, TrendingUp, Users, 
  CheckCircle, Star, ArrowRight, Zap, Shield, Clock
} from "lucide-react";
import heroImage from "@/assets/nutrition-hero.jpg";
import { AuthButton } from "@/components/AuthButton";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[100vh] sm:min-h-[600px] md:h-[700px] pb-16 sm:pb-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 nutrition-gradient opacity-90" />
          
          {/* Navigation */}
          <nav className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-6 py-4">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <span className="text-lg sm:text-xl font-bold text-white">ThucdonAI</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <Link to="/about" className="text-white hover:text-yellow-300 transition-colors hidden md:inline-block text-sm">
                  Về Chúng Tôi
                </Link>
                <Link to="/pricing" className="text-white hover:text-yellow-300 transition-colors hidden md:inline-block text-sm">
                  Giá Cả
                </Link>
                <Link to="/contact" className="text-white hover:text-yellow-300 transition-colors hidden md:inline-block text-sm">
                  Liên Hệ
                </Link>
                <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs px-2 sm:px-4">
                  <Link to="/app">App</Link>
                </Button>
                <div className="scale-90 sm:scale-100">
                  <AuthButton />
                </div>
              </div>
            </div>
          </nav>
          
          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-center justify-center text-center px-4 pt-20 sm:pt-0">
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-fade-in">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-3 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                Công Nghệ AI Dinh Dưỡng Tiên Tiến
              </Badge>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight px-2">
                Thực Đơn Dinh Dưỡng
                <br />
                <span className="text-yellow-300">Cá Nhân Hóa 100%</span>
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed px-4">
                Để AI phân tích và tạo thực đơn hoàn hảo cho riêng bạn. 
                Tối ưu hóa sức khỏe, đạt mục tiêu nhanh chóng với khoa học dinh dưỡng hiện đại.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2 px-4">
                <Button asChild size="lg" className="bg-yellow-400 text-primary hover:bg-yellow-300 shadow-lg text-sm sm:text-base px-6 py-4 sm:px-8 sm:py-5 w-full sm:w-auto">
                  <Link to="/app">
                    Tạo Thực Đơn Ngay <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 text-sm sm:text-base px-6 py-4 sm:px-8 sm:py-5 w-full sm:w-auto">
                  <Link to="#features">
                    Tìm Hiểu Thêm
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 sm:pt-8 max-w-2xl mx-auto px-2">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-5">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300">10K+</div>
                  <div className="text-xs sm:text-sm md:text-base text-white/80 mt-1">Người dùng</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-5">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300">50K+</div>
                  <div className="text-xs sm:text-sm md:text-base text-white/80 mt-1">Thực đơn</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-5">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300">98%</div>
                  <div className="text-xs sm:text-sm md:text-base text-white/80 mt-1">Hài lòng</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[80px]">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              Tính Năng Nổi Bật
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tại Sao Chọn <span className="text-primary">ThucdonAI?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Giải pháp dinh dưỡng toàn diện, được hỗ trợ bởi công nghệ AI tiên tiến
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-nutrition transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>AI Phân Tích Thông Minh</CardTitle>
                <CardDescription>
                  Công nghệ AI phân tích sâu về cơ thể, lối sống và mục tiêu của bạn
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-nutrition transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-success/10 flex items-center justify-center mb-3 sm:mb-4">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                </div>
                <CardTitle className="text-base sm:text-lg">Tối Ưu Sức Khỏe</CardTitle>
                <CardDescription className="text-sm">
                  Thực đơn được thiết kế phù hợp với tình trạng sức khỏe và dị ứng của bạn
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-nutrition transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3 sm:mb-4">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <CardTitle className="text-base sm:text-lg">Mục Tiêu Rõ Ràng</CardTitle>
                <CardDescription className="text-sm">
                  Giảm cân, tăng cơ, duy trì - mọi mục tiêu đều có lộ trình cụ thể
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-nutrition transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-warning/10 flex items-center justify-center mb-3 sm:mb-4">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
                </div>
                <CardTitle className="text-base sm:text-lg">Quét Thực Phẩm</CardTitle>
                <CardDescription className="text-sm">
                  Chụp ảnh món ăn, AI tự động phân tích dinh dưỡng và calories
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-nutrition transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg">Theo Dõi Tiến Độ</CardTitle>
                <CardDescription className="text-sm">
                  Thống kê chi tiết, biểu đồ trực quan giúp bạn thấy sự thay đổi
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-nutrition transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-success/10 flex items-center justify-center mb-3 sm:mb-4">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                </div>
                <CardTitle className="text-base sm:text-lg">Cộng Đồng Recipes</CardTitle>
                <CardDescription className="text-sm">
                  Hàng ngàn công thức nấu ăn healthy được chia sẻ từ cộng đồng
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 card-gradient">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <Badge variant="outline" className="mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
              Quy Trình
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4">
              Chỉ 3 Bước Đơn Giản
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto px-2 sm:px-0">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full nutrition-gradient text-white flex items-center justify-center text-2xl font-bold mx-auto shadow-nutrition">
                1
              </div>
              <h3 className="text-2xl font-bold">Nhập Thông Tin</h3>
              <p className="text-muted-foreground">
                Cung cấp chiều cao, cân nặng, mục tiêu và thói quen ăn uống của bạn
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full nutrition-gradient text-white flex items-center justify-center text-2xl font-bold mx-auto shadow-nutrition">
                2
              </div>
              <h3 className="text-2xl font-bold">AI Phân Tích</h3>
              <p className="text-muted-foreground">
                Hệ thống AI xử lý và tạo thực đơn phù hợp 100% với bạn
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full nutrition-gradient text-white flex items-center justify-center text-2xl font-bold mx-auto shadow-nutrition">
                3
              </div>
              <h3 className="text-2xl font-bold">Theo Dõi & Đạt Mục Tiêu</h3>
              <p className="text-muted-foreground">
                Thực hiện thực đơn, ghi nhận tiến độ và đạt được kết quả mong muốn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <Badge variant="outline" className="mb-2 px-4 py-2">
                Lợi Ích
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold">
                Khác Biệt So Với Cách Truyền Thống
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">Cá nhân hóa 100%</h4>
                    <p className="text-muted-foreground">Không còn thực đơn chung chung, mọi thứ đều được tính toán riêng cho bạn</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">Tiết kiệm thời gian</h4>
                    <p className="text-muted-foreground">Không cần tìm kiếm, tính toán calories - AI làm tất cả trong vài giây</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">Hiệu quả đã chứng minh</h4>
                    <p className="text-muted-foreground">98% người dùng đạt mục tiêu trong 3 tháng đầu tiên</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg">An toàn & khoa học</h4>
                    <p className="text-muted-foreground">Dựa trên nghiên cứu dinh dưỡng mới nhất từ các chuyên gia</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="border-2">
                <CardHeader className="text-center">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-2" />
                  <CardTitle className="text-2xl">An Toàn</CardTitle>
                  <CardDescription>Dữ liệu được bảo mật tuyệt đối</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2">
                <CardHeader className="text-center">
                  <Clock className="w-12 h-12 text-accent mx-auto mb-2" />
                  <CardTitle className="text-2xl">Nhanh Chóng</CardTitle>
                  <CardDescription>Kết quả trong vài giây</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2">
                <CardHeader className="text-center">
                  <Star className="w-12 h-12 text-warning mx-auto mb-2" />
                  <CardTitle className="text-2xl">Chất Lượng</CardTitle>
                  <CardDescription>Đánh giá 4.9/5 sao</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2">
                <CardHeader className="text-center">
                  <Heart className="w-12 h-12 text-destructive mx-auto mb-2" />
                  <CardTitle className="text-2xl">Hiệu Quả</CardTitle>
                  <CardDescription>Kết quả thật, lâu dài</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 nutrition-gradient">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white px-4">
              Sẵn Sàng Thay Đổi Cuộc Sống?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 px-4">
              Hãy để AI tạo thực đơn hoàn hảo cho bạn ngay hôm nay. Miễn phí, không cần thẻ tín dụng.
            </p>
            <Button asChild size="lg" className="bg-yellow-400 text-primary hover:bg-yellow-300 shadow-lg text-base sm:text-lg px-8 sm:px-12 py-5 sm:py-6 w-full sm:w-auto">
              <Link to="/auth">
                Bắt Đầu Ngay - Miễn Phí <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </Button>
            <p className="text-xs sm:text-sm text-white/70">
              Đã có 10,000+ người thay đổi cuộc sống với ThucdonAI
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/5 py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">ThucdonAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Giải pháp dinh dưỡng thông minh được hỗ trợ bởi AI
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Sản Phẩm</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/app" className="hover:text-primary">Tạo thực đơn</Link></li>
                <li><Link to="/pricing" className="hover:text-primary">Giá cả</Link></li>
                <li><Link to="/recipes" className="hover:text-primary">Công thức</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Công Ty</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary">Về chúng tôi</Link></li>
                <li><Link to="/contact" className="hover:text-primary">Liên hệ</Link></li>
                <li><Link to="/contact" className="hover:text-primary">Liên hệ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Hỗ Trợ</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/help" className="hover:text-primary">Trợ giúp</Link></li>
                <li><Link to="/privacy" className="hover:text-primary">Chính sách</Link></li>
                <li><Link to="/terms" className="hover:text-primary">Điều khoản</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 ThucdonAI. Phát triển với ❤️ từ Việt Nam</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
