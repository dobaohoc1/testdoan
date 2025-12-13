import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Sparkles, Mail, MessageSquare, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Đã gửi tin nhắn!",
      description: "Chúng tôi sẽ phản hồi trong vòng 24 giờ.",
    });
  };

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

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h1>
            <p className="text-xl text-muted-foreground">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Gửi Tin Nhắn</CardTitle>
                <CardDescription>
                  Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại sớm nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input id="name" placeholder="Nguyễn Văn A" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@example.com" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" type="tel" placeholder="0912345678" />
                  </div>
                  <div>
                    <Label htmlFor="message">Tin nhắn</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Bạn cần hỗ trợ gì?" 
                      rows={5}
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Gửi Tin Nhắn
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="border-2 hover:shadow-nutrition transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Email</CardTitle>
                  <CardDescription>
                    support@thucdonai.com
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:shadow-nutrition transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle>Hotline</CardTitle>
                  <CardDescription>
                    1900 1234 (8:00 - 22:00 hàng ngày)
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:shadow-nutrition transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-2">
                    <MessageSquare className="w-6 h-6 text-success" />
                  </div>
                  <CardTitle>Chat Trực Tuyến</CardTitle>
                  <CardDescription>
                    Có sẵn chatbot AI hỗ trợ 24/7 trong ứng dụng
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:shadow-nutrition transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mb-2">
                    <MapPin className="w-6 h-6 text-warning" />
                  </div>
                  <CardTitle>Văn Phòng</CardTitle>
                  <CardDescription>
                    Tầng 10, Tòa nhà ABC, Quận 1, TP.HCM
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
