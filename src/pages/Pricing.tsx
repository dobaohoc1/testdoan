import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Sparkles, Check, Zap } from "lucide-react";

const Pricing = () => {
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
      <section className="py-20 px-6 text-center">
        <div className="container mx-auto max-w-4xl">
          <Badge variant="outline" className="mb-6">Giá Cả</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Chọn Gói Phù Hợp <span className="text-primary">Với Bạn</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Bắt đầu miễn phí, nâng cấp khi bạn cần thêm tính năng
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-6 pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="border-2 hover:shadow-nutrition transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">Miễn Phí</CardTitle>
                <CardDescription>Hoàn hảo để bắt đầu</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">0đ</span>
                  <span className="text-muted-foreground">/tháng</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full" variant="outline">
                  <Link to="/auth">Bắt Đầu Miễn Phí</Link>
                </Button>
                <div className="space-y-3 pt-4">
                  <div className="flex gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">3 thực đơn AI/tháng</span>
                  </div>
                  <div className="flex gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">Quét thực phẩm cơ bản</span>
                  </div>
                  <div className="flex gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">Theo dõi dinh dưỡng</span>
                  </div>
                  <div className="flex gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">Truy cập công thức cộng đồng</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-primary shadow-nutrition-strong relative overflow-hidden">
              <Badge className="absolute top-4 right-4 bg-primary">
                Phổ Biến
              </Badge>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>Cho người dùng nghiêm túc</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">199K</span>
                  <span className="text-muted-foreground">/tháng</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link to="/auth">Nâng Cấp Ngay</Link>
                </Button>
                <div className="space-y-3 pt-4">
                  <div className="flex gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm font-semibold">Thực đơn AI không giới hạn</span>
                  </div>
                  <div className="flex gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">Quét thực phẩm nâng cao</span>
                  </div>
                  <div className="flex gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">Phân tích dinh dưỡng chi tiết</span>
                  </div>
                  <div className="flex gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">Chatbot tư vấn 24/7</span>
                  </div>
                  <div className="flex gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">Lưu công thức yêu thích</span>
                  </div>
                  <div className="flex gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">Báo cáo tiến độ hàng tuần</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 hover:shadow-nutrition transition-all">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  Premium <Zap className="w-5 h-5 text-warning" />
                </CardTitle>
                <CardDescription>Trải nghiệm VIP hoàn hảo</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">399K</span>
                  <span className="text-muted-foreground">/tháng</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full" variant="secondary">
                  <Link to="/auth">Nâng Cấp Premium</Link>
                </Button>
                <div className="space-y-3 pt-4">
                  <div className="flex gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm font-semibold">Tất cả tính năng Pro</span>
                  </div>
                  <div className="flex gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">Tư vấn 1-1 với chuyên gia</span>
                  </div>
                  <div className="flex gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">Thực đơn gia đình (4 người)</span>
                  </div>
                  <div className="flex gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">Kế hoạch tập luyện tích hợp</span>
                  </div>
                  <div className="flex gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">Ưu tiên hỗ trợ 24/7</span>
                  </div>
                  <div className="flex gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">Truy cập sớm tính năng mới</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 card-gradient">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Câu Hỏi Thường Gặp</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tôi có thể hủy bất cứ lúc nào không?</CardTitle>
                <CardDescription>
                  Có, bạn có thể hủy gói Pro hoặc Premium bất cứ lúc nào. Không có phí ràng buộc.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Có thể thử nghiệm trước khi mua không?</CardTitle>
                <CardDescription>
                  Gói Miễn Phí cho phép bạn trải nghiệm đầy đủ tính năng cơ bản trước khi quyết định nâng cấp.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Có chính sách hoàn tiền không?</CardTitle>
                <CardDescription>
                  Chúng tôi có chính sách hoàn tiền 100% trong vòng 7 ngày đầu tiên nếu bạn không hài lòng.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
