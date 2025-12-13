import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import AdminPasswordReset from "@/components/AdminPasswordReset";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      if (error.message.includes("User already registered")) {
        setError("Tài khoản với email này đã tồn tại. Vui lòng đăng nhập.");
      } else {
        setError(error.message);
      }
    } else {
      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        setError("Email này đã được đăng ký trước đó. Vui lòng đăng nhập.");
      } else {
        setMessage("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản, sau đó bạn có thể đăng nhập.");
        toast({
          title: "Đăng ký thành công! 🎉",
          description: "Vui lòng kiểm tra email để xác nhận tài khoản trước khi đăng nhập.",
          duration: 5000,
        });
      }
    }

    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setError("Email hoặc mật khẩu không đúng. Nếu bạn vừa đăng ký, vui lòng kiểm tra email để xác nhận tài khoản trước.");
      } else if (error.message.includes("Email not confirmed")) {
        setError("Tài khoản chưa được xác nhận. Vui lòng kiểm tra email của bạn và nhấn vào link xác nhận.");
      } else {
        setError(error.message);
      }
    } else {
      toast({
        title: "Đăng nhập thành công! 🎉",
        description: "Chào mừng bạn quay trở lại!",
      });
      navigate("/");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Về trang chủ
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ThucdonAI
          </h1>
          <p className="text-muted-foreground">
            Ứng dụng AI tạo thực đơn dinh dưỡng thông minh
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Xác thực tài khoản</CardTitle>
            <CardDescription>
              Đăng nhập hoặc tạo tài khoản mới để bắt đầu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Đăng nhập</TabsTrigger>
                <TabsTrigger value="signup">Đăng ký</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Mật khẩu</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Đăng nhập
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Họ và tên</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mật khẩu</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Đăng ký
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <AdminPasswordReset />

        <div className="text-center text-sm text-muted-foreground space-y-2">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="font-medium text-blue-900 dark:text-blue-100 mb-2">ℹ️ Lưu ý quan trọng</p>
            <p className="text-xs text-blue-800 dark:text-blue-200">
              Sau khi đăng ký, vui lòng <strong>kiểm tra email</strong> và nhấn vào link xác nhận trước khi đăng nhập.
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Để test nhanh, bạn có thể tắt "Confirm email" trong{" "}
              <a 
                href="https://supabase.com/dashboard/project/jytnzvoymseduevwcuyu/auth/providers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-blue-600"
              >
                Supabase Auth Settings
              </a>
            </p>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg border">
            <p className="font-medium text-foreground mb-1">🎯 Tài khoản Demo Admin:</p>
            <p className="text-xs"><strong>Email:</strong> hocdo129@gmail.com</p>
            <p className="text-xs"><strong>Password:</strong> 123456</p>
          </div>
          <p>
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <span className="text-primary cursor-pointer hover:underline">
              Điều khoản dịch vụ
            </span>{" "}
            và{" "}
            <span className="text-primary cursor-pointer hover:underline">
              Chính sách bảo mật
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;