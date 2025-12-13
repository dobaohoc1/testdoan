import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Check, Crown, Zap } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function MySubscription() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    loadSubscription();
    loadAvailablePlans();
  }, []);

  const loadSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user subscription
      const { data: subData, error: subError } = await supabase
        .from('GoiDangKyNguoiDung')
        .select('*')
        .eq('nguoidungid', user.id)
        .maybeSingle();

      if (subError) {
        console.error('Error loading subscription:', subError);
        throw subError;
      }
      
      if (subData) {
        setSubscription(subData);
        
        // Fetch plan details if subscription has a plan
        if (subData.goidangkyid) {
          const { data: planData, error: planError } = await supabase
            .from('GoiDangKy')
            .select('*')
            .eq('id', subData.goidangkyid)
            .single();
          
          if (planError) {
            console.error('Error loading plan:', planError);
          } else {
            setPlan(planData);
          }
        }
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin gói đăng ký",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailablePlans = async () => {
    try {
      const { data, error } = await supabase
        .from('GoiDangKy')
        .select('*')
        .eq('danghoatdong', true)
        .order('giathang');

      if (error) throw error;
      setAvailablePlans(data || []);
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const handleSelectPlan = async () => {
    if (!selectedPlanId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn một gói đăng ký",
        variant: "destructive",
      });
      return;
    }

    setSubscribing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Chưa đăng nhập");

      // Check if user already has a subscription
      const { data: existingSub } = await supabase
        .from('GoiDangKyNguoiDung')
        .select('id')
        .eq('nguoidungid', user.id)
        .maybeSingle();

      let error;
      
      if (existingSub) {
        // Update existing subscription
        const result = await supabase
          .from('GoiDangKyNguoiDung')
          .update({
            goidangkyid: selectedPlanId,
            batdauky: new Date().toISOString(),
            trangthai: 'active',
          })
          .eq('nguoidungid', user.id);
        error = result.error;
      } else {
        // Create new subscription
        const result = await supabase
          .from('GoiDangKyNguoiDung')
          .insert({
            nguoidungid: user.id,
            goidangkyid: selectedPlanId,
            batdauky: new Date().toISOString(),
            trangthai: 'active',
          });
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã chọn gói đăng ký thành công",
      });

      setShowPlanDialog(false);
      setLoading(true);
      await loadSubscription();
      setLoading(false);
    } catch (error: any) {
      console.error('Error selecting plan:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể chọn gói đăng ký",
        variant: "destructive",
      });
    } finally {
      setSubscribing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Chưa đăng nhập");

      const { error } = await supabase
        .from('GoiDangKyNguoiDung')
        .update({
          trangthai: 'cancelled',
          ketthucky: new Date().toISOString(),
        })
        .eq('nguoidungid', user.id);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đã hủy gói đăng ký thành công",
      });

      await loadSubscription();
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể hủy gói đăng ký",
        variant: "destructive",
      });
    }
  };

  const isActive = subscription?.trangthai === 'active';

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Gói đăng ký của tôi
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Quản lý gói đăng ký và nâng cấp tài khoản
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Gói hiện tại */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Gói đăng ký hiện tại
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Đang tải...
                </div>
              ) : subscription && plan ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                        {plan.ten}
                        {isActive && <Crown className="h-5 w-5 text-yellow-500" />}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {plan.mota}
                      </p>
                    </div>
                    <Badge variant={isActive ? "default" : "secondary"} className="capitalize">
                      {subscription.trangthai || 'Chưa kích hoạt'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Giá tháng</p>
                      <p className="text-2xl font-bold">
                        {plan.giathang?.toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Giá năm</p>
                      <p className="text-2xl font-bold">
                        {plan.gianam?.toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                  </div>

                  {subscription.batdauky && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Bắt đầu:</span>
                        <span className="font-medium">
                          {format(new Date(subscription.batdauky), 'dd/MM/yyyy', { locale: vi })}
                        </span>
                      </div>
                      {subscription.ketthucky && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Kết thúc:</span>
                          <span className="font-medium">
                            {format(new Date(subscription.ketthucky), 'dd/MM/yyyy', { locale: vi })}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {plan.tinhnang && Array.isArray(plan.tinhnang) && plan.tinhnang.length > 0 && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3">Tính năng:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {plan.tinhnang.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {plan.sokehoachtoida && (
                    <div className="bg-muted/50 rounded-lg p-4 mt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Kế hoạch tối đa</p>
                          <p className="font-semibold text-lg">{plan.sokehoachtoida}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Công thức tối đa</p>
                          <p className="font-semibold text-lg">{plan.socongthuctoida}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isActive && plan.ten !== 'Miễn phí' && (
                    <div className="pt-4 border-t">
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={handleCancelSubscription}
                      >
                        Hủy đăng ký
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Bạn vẫn có thể sử dụng gói này đến hết kỳ thanh toán
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Bạn chưa có gói đăng ký nào
                  </p>
                  <Button variant="outline" onClick={() => setShowPlanDialog(true)}>
                    Chọn gói đăng ký
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Các gói khả dụng */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Nâng cấp gói
              </CardTitle>
              <CardDescription>
                Các gói đăng ký khả dụng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {availablePlans.map((availablePlan) => (
                <div
                  key={availablePlan.id}
                  className={`p-4 border rounded-lg ${
                    plan?.id === availablePlan.id ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <h4 className="font-semibold mb-1">{availablePlan.ten}</h4>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {availablePlan.mota}
                  </p>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-xl font-bold">
                      {availablePlan.giathang?.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-sm text-muted-foreground">VNĐ/tháng</span>
                  </div>
                  {plan?.id === availablePlan.id ? (
                    <Badge className="w-full justify-center" variant="secondary">
                      Gói hiện tại
                    </Badge>
                  ) : (
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedPlanId(availablePlan.id);
                        setShowPlanDialog(true);
                      }}
                    >
                      Chọn gói này
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog chọn gói */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn gói đăng ký</DialogTitle>
            <DialogDescription>
              Chọn gói đăng ký phù hợp với nhu cầu của bạn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <RadioGroup value={selectedPlanId} onValueChange={setSelectedPlanId}>
              {availablePlans.map((availablePlan) => (
                <div
                  key={availablePlan.id}
                  className="flex items-start space-x-3 space-y-0 rounded-md border p-4"
                >
                  <RadioGroupItem value={availablePlan.id} id={availablePlan.id} />
                  <Label
                    htmlFor={availablePlan.id}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-semibold">{availablePlan.ten}</div>
                    {availablePlan.mota && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {availablePlan.mota}
                      </div>
                    )}
                    <div className="text-sm font-medium mt-2">
                      {availablePlan.giathang > 0 
                        ? `${availablePlan.giathang.toLocaleString('vi-VN')} VNĐ/tháng`
                        : 'Miễn phí'}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowPlanDialog(false)}
                disabled={subscribing}
              >
                Hủy
              </Button>
              <Button onClick={handleSelectPlan} disabled={subscribing}>
                {subscribing ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
