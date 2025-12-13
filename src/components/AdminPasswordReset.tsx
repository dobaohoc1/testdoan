import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminPasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleResetAdminPassword = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.functions.invoke('reset-password', {
        body: {
          email: 'hocdo129@gmail.com',
          newPassword: '123456'
        }
      });

      if (error) {
        throw error;
      }

      setMessage("✅ Mật khẩu admin đã được reset thành công!");
      toast({
        title: "Thành công! 🎉",
        description: "Mật khẩu admin đã được reset về 123456",
      });

    } catch (error: any) {
      console.error('Reset password error:', error);
      setMessage(`❌ Lỗi: ${error.message}`);
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>🔧 Admin Tools</CardTitle>
        <CardDescription>
          Reset mật khẩu cho tài khoản admin demo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p><strong>Email:</strong> hocdo129@gmail.com</p>
          <p><strong>New Password:</strong> 123456</p>
        </div>
        
        <Button 
          onClick={handleResetAdminPassword}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Đang reset..." : "Reset Password Admin"}
        </Button>

        {message && (
          <Alert variant={message.includes("✅") ? "default" : "destructive"}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminPasswordReset;