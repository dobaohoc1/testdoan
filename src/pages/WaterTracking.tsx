import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWaterLogs } from "@/hooks/useWaterLogs";
import { Droplet, Plus, Trash2, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const DAILY_GOAL = 2000; // ml
const QUICK_AMOUNTS = [250, 500, 750, 1000];

export default function WaterTracking() {
  const { loading, addWaterLog, getTodayWaterLogs, deleteWaterLog } = useWaterLogs();
  const [todayLogs, setTodayLogs] = useState<any[]>([]);
  const [totalToday, setTotalToday] = useState(0);

  useEffect(() => {
    loadTodayLogs();
  }, []);

  const loadTodayLogs = async () => {
    const logs = await getTodayWaterLogs();
    setTodayLogs(logs);
    const total = logs.reduce((sum, log) => sum + log.soluongml, 0);
    setTotalToday(total);
  };

  const handleAddWater = async (amount: number) => {
    const result = await addWaterLog(amount);
    if (result) {
      loadTodayLogs();
    }
  };

  const handleDeleteLog = async (id: string) => {
    const result = await deleteWaterLog(id);
    if (result) {
      loadTodayLogs();
    }
  };

  const percentage = Math.min((totalToday / DAILY_GOAL) * 100, 100);
  const remainingWater = Math.max(DAILY_GOAL - totalToday, 0);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Theo dõi nước uống
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Theo dõi lượng nước uống hàng ngày của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Thống kê tổng quan */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-500" />
                Tiến độ hôm nay
              </CardTitle>
              <CardDescription>
                Mục tiêu: {DAILY_GOAL} ml mỗi ngày
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4 sm:py-6">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-500 mb-2">
                  {totalToday} ml
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {percentage.toFixed(0)}% mục tiêu đạt được
                </p>
              </div>
              <Progress value={percentage} className="h-3 sm:h-4" />
              {remainingWater > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  Còn lại: {remainingWater} ml
                </p>
              )}
              {totalToday >= DAILY_GOAL && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    🎉 Chúc mừng! Bạn đã đạt mục tiêu hôm nay!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lịch sử hôm nay */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Lịch sử hôm nay</CardTitle>
              <CardDescription>
                {todayLogs.length} lần uống nước
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todayLogs.length > 0 ? (
                  todayLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Droplet className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base">{log.soluongml} ml</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {format(new Date(`2000-01-01 ${log.gioghinhan}`), 'HH:mm', { locale: vi })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLog(log.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Chưa có lượt uống nước nào hôm nay
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nút thêm nhanh */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Thêm nhanh</CardTitle>
              <CardDescription>
                Chọn lượng nước để ghi nhận
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {QUICK_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  onClick={() => handleAddWater(amount)}
                  disabled={loading}
                  variant="outline"
                  className="w-full h-auto py-4 sm:py-6 flex flex-col gap-2"
                >
                  <Droplet className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                  <span className="text-lg sm:text-xl font-bold">{amount} ml</span>
                </Button>
              ))}
              
              <div className="pt-4 border-t">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                    <p className="text-xs sm:text-sm font-medium">Mẹo nhỏ</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Uống nước đều đặn trong ngày để cơ thể luôn được cung cấp đủ nước
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
