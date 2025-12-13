import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWeightLogs } from "@/hooks/useWeightLogs";
import { useProfile } from "@/hooks/useProfile";
import { Scale, Plus, Trash2, TrendingDown, TrendingUp, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function WeightTracking() {
  const { loading, addWeightLog, getWeightLogs, deleteWeightLog } = useWeightLogs();
  const { getHealthProfile } = useProfile();
  const [logs, setLogs] = useState<any[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNote, setNewNote] = useState("");
  const [targetWeight, setTargetWeight] = useState<number | null>(null);

  useEffect(() => {
    loadLogs();
    loadProfile();
  }, []);

  const loadLogs = async () => {
    const data = await getWeightLogs();
    setLogs(data);
  };

  const loadProfile = async () => {
    const profile = await getHealthProfile();
    if (profile?.cannang) {
      setTargetWeight(profile.cannang);
    }
  };

  const handleAddLog = async () => {
    if (!newWeight || parseFloat(newWeight) <= 0) {
      return;
    }

    const result = await addWeightLog({
      cannang: parseFloat(newWeight),
      ngayghinhan: newDate,
      ghichu: newNote || undefined
    });

    if (result) {
      setNewWeight("");
      setNewDate(new Date().toISOString().split('T')[0]);
      setNewNote("");
      loadLogs();
    }
  };

  const handleDeleteLog = async (id: string) => {
    const result = await deleteWeightLog(id);
    if (result) {
      loadLogs();
    }
  };

  const latestWeight = logs.length > 0 ? logs[0].cannang : null;
  const previousWeight = logs.length > 1 ? logs[1].cannang : null;
  const weightChange = latestWeight && previousWeight ? latestWeight - previousWeight : null;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Theo dõi cân nặng
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Ghi nhận và theo dõi biến động cân nặng của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Thống kê */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Cân nặng hiện tại
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl sm:text-4xl font-bold">
                  {latestWeight ? `${latestWeight} kg` : "Chưa có"}
                </div>
                {logs.length > 0 && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Cập nhật: {format(new Date(logs[0].ngayghinhan), 'dd/MM/yyyy', { locale: vi })}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  {weightChange && weightChange < 0 ? (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                  )}
                  Thay đổi gần nhất
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl sm:text-4xl font-bold ${
                  weightChange && weightChange < 0 ? 'text-green-500' : 
                  weightChange && weightChange > 0 ? 'text-orange-500' : ''
                }`}>
                  {weightChange 
                    ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg`
                    : "Chưa có"
                  }
                </div>
                {previousWeight && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    So với lần trước: {previousWeight} kg
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Lịch sử */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Lịch sử cân nặng</CardTitle>
              <CardDescription>
                {logs.length} bản ghi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {logs.length > 0 ? (
                  logs.map((log, index) => {
                    const prevLog = logs[index + 1];
                    const change = prevLog ? log.cannang - prevLog.cannang : null;
                    
                    return (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <p className="font-bold text-lg sm:text-xl">{log.cannang} kg</p>
                              {change && (
                                <span className={`text-xs sm:text-sm ${
                                  change < 0 ? 'text-green-500' : 'text-orange-500'
                                }`}>
                                  ({change > 0 ? '+' : ''}{change.toFixed(1)} kg)
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(log.ngayghinhan), 'dd/MM/yyyy', { locale: vi })}
                            </div>
                            {log.ghichu && (
                              <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-1">
                                {log.ghichu}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLog(log.id)}
                          className="flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Chưa có bản ghi cân nặng nào
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form thêm mới */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Ghi nhận cân nặng</CardTitle>
              <CardDescription>
                Thêm bản ghi mới
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Cân nặng (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="VD: 65.5"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                />
              </div>

              <div>
                <Label>Ngày ghi nhận</Label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>

              <div>
                <Label>Ghi chú (tùy chọn)</Label>
                <Textarea
                  placeholder="VD: Sau khi tập gym"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleAddLog}
                disabled={loading || !newWeight}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm bản ghi
              </Button>

              {targetWeight && (
                <div className="pt-4 border-t">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-medium mb-1">Mục tiêu</p>
                    <p className="text-lg sm:text-xl font-bold">{targetWeight} kg</p>
                    {latestWeight && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {latestWeight < targetWeight 
                          ? `Còn ${(targetWeight - latestWeight).toFixed(1)} kg để đạt mục tiêu`
                          : `Vượt mục tiêu ${(latestWeight - targetWeight).toFixed(1)} kg`
                        }
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
