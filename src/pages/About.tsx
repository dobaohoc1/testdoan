import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Sparkles, Users, Target, Award, Heart, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">ThucdonAI</span>
          </Link>
          <Button asChild>
            <Link to="/app">Bắt Đầu Ngay</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 nutrition-gradient text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="bg-white/20 border-white/30 text-white mb-6">
            Về Chúng Tôi
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Sứ Mệnh Của Chúng Tôi
          </h1>
          <p className="text-xl text-white/90 leading-relaxed">
            ThucdonAI ra đời với sứ mệnh mang đến giải pháp dinh dưỡng thông minh, 
            giúp mọi người Việt Nam dễ dàng tiếp cận chế độ ăn uống khoa học và cá nhân hóa.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6 text-lg text-muted-foreground">
            <p>
              Trong thời đại công nghệ 4.0, chúng tôi nhận thấy rằng việc duy trì một chế độ 
              ăn uống lành mạnh vẫn là thách thức lớn đối với nhiều người. Thông tin dinh dưỡng 
              phức tạp, thời gian hạn chế, và thiếu sự tư vấn cá nhân hóa khiến nhiều người khó 
              đạt được mục tiêu sức khỏe của mình.
            </p>
            <p>
              ThucdonAI được phát triển bởi đội ngũ chuyên gia dinh dưỡng và kỹ sư AI hàng đầu, 
              kết hợp kiến thức khoa học dinh dưỡng với công nghệ trí tuệ nhân tạo tiên tiến. 
              Chúng tôi tin rằng mỗi người đều xứng đáng có một chế độ dinh dưỡng phù hợp với 
              cơ thể và lối sống riêng của mình.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 card-gradient">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Giá Trị Cốt Lõi</h2>
            <p className="text-xl text-muted-foreground">
              Những giá trị định hướng mọi hành động của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:shadow-nutrition transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Con Người Là Trung Tâm</CardTitle>
                <CardContent className="px-0">
                  <p className="text-muted-foreground">
                    Sức khỏe và hạnh phúc của người dùng là ưu tiên hàng đầu trong mọi quyết định
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-nutrition transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Khoa Học & Chính Xác</CardTitle>
                <CardContent className="px-0">
                  <p className="text-muted-foreground">
                    Mọi khuyến nghị đều dựa trên nghiên cứu khoa học và dữ liệu chính xác
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-nutrition transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <CardTitle>Cải Tiến Liên Tục</CardTitle>
                <CardContent className="px-0">
                  <p className="text-muted-foreground">
                    Không ngừng học hỏi và phát triển để mang đến giải pháp tốt nhất
                  </p>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Người dùng tin tưởng</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Thực đơn được tạo</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Tỷ lệ hài lòng</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Hỗ trợ AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 nutrition-gradient text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-6">
            Cùng Chúng Tôi Xây Dựng Cộng Đồng Khỏe Mạnh
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Hàng ngàn người đã thay đổi cuộc sống của họ. Bạn cũng có thể!
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link to="/auth">Bắt Đầu Miễn Phí</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
