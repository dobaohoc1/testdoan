import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNutritionAI } from "@/hooks/useNutritionAI";
import { 
  Activity, 
  Target, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  Zap, 
  Plus,
  TrendingUp,
  TrendingDown,
  Apple
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ExportButton } from "@/components/ExportButton";
import { exportNutritionReportPDF, exportNutritionCSV } from "@/lib/exportUtils";

interface NutritionLog {
  id: string;
  tenthucpham: string;
  calo: number;
  dam: number;
  carb: number;
  chat: number;
  soluong: number;
  donvi: string;
  ngayghinhan: string;
  ghichu?: string;
  taoluc: string;
}

interface DailyStats {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  logsCount: number;
}

interface Stats {
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  totalLogs: number;
  daysTracked: number;
}

const NutritionTracking = () => {
  const { user } = useAuth();
  const { getNutritionAdvice, loading: aiLoading } = useNutritionAI();
  const { toast } = useToast();
  
  // Today's logs
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  
  // History
  const [allLogs, setAllLogs] = useState<NutritionLog[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [historyTimeRange, setHistoryTimeRange] = useState<'week' | 'month' | 'all'>('week');
  
  // Stats
  const [stats, setStats] = useState<Stats>({
    averageCalories: 0,
    averageProtein: 0,
    averageCarbs: 0,
    averageFat: 0,
    totalLogs: 0,
    daysTracked: 0
  });
  const [targetCalories, setTargetCalories] = useState(2000);
  const [statsTimeRange, setStatsTimeRange] = useState<7 | 30 | 90>(30);
  
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  // New log form
  const [newLog, setNewLog] = useState({
    food_name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    amount: 1,
    unit: "phần",
    notes: ""
  });

  useEffect(() => {
    if (user) {
      fetchTodayLogs();
      fetchHistory();
      fetchStats();
    }
  }, [user, selectedDate, historyTimeRange, statsTimeRange]);

  useEffect(() => {
    calculateDailyTotals();
  }, [logs]);

  const fetchTodayLogs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('NhatKyDinhDuong')
        .select('*')
        .eq('nguoidungid', user.id)
        .eq('ngayghinhan', dateString)
        .order('taoluc', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching nutrition logs:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải nhật ký dinh dưỡng",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('NhatKyDinhDuong')
        .select('*')
        .eq('nguoidungid', user.id)
        .order('ngayghinhan', { ascending: false });

      if (historyTimeRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('ngayghinhan', weekAgo.toISOString().split('T')[0]);
      } else if (historyTimeRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query = query.gte('ngayghinhan', monthAgo.toISOString().split('T')[0]);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      setAllLogs(data || []);
      calculateHistoryStats(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const fetchStats = async () => {
    if (!user) return;

    try {
      const { data: healthProfile } = await supabase
        .from('HoSoSucKhoe')
        .select('muctieucalohangngay')
        .eq('nguoidungid', user.id)
        .maybeSingle();

      if (healthProfile?.muctieucalohangngay) {
        setTargetCalories(healthProfile.muctieucalohangngay);
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - statsTimeRange);

      const { data: statsLogs, error } = await supabase
        .from('NhatKyDinhDuong')
        .select('*')
        .eq('nguoidungid', user.id)
        .gte('ngayghinhan', startDate.toISOString().split('T')[0])
        .lte('ngayghinhan', endDate.toISOString().split('T')[0])
        .order('ngayghinhan', { ascending: true });

      if (error) throw error;

      const logsByDay = new Map<string, DailyStats>();
      
      statsLogs?.forEach(log => {
        const date = log.ngayghinhan;
        if (!logsByDay.has(date)) {
          logsByDay.set(date, {
            date,
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            logsCount: 0
          });
        }
        
        const dayLog = logsByDay.get(date)!;
        dayLog.totalCalories += log.calo || 0;
        dayLog.totalProtein += log.dam || 0;
        dayLog.totalCarbs += log.carb || 0;
        dayLog.totalFat += log.chat || 0;
        dayLog.logsCount += 1;
      });

      const dailyData = Array.from(logsByDay.values());

      const totalCalories = dailyData.reduce((sum, day) => sum + day.totalCalories, 0);
      const totalProtein = dailyData.reduce((sum, day) => sum + day.totalProtein, 0);
      const totalCarbs = dailyData.reduce((sum, day) => sum + day.totalCarbs, 0);
      const totalFat = dailyData.reduce((sum, day) => sum + day.totalFat, 0);
      const daysTracked = dailyData.length;

      setStats({
        averageCalories: daysTracked > 0 ? totalCalories / daysTracked : 0,
        averageProtein: daysTracked > 0 ? totalProtein / daysTracked : 0,
        averageCarbs: daysTracked > 0 ? totalCarbs / daysTracked : 0,
        averageFat: daysTracked > 0 ? totalFat / daysTracked : 0,
        totalLogs: statsLogs?.length || 0,
        daysTracked
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const calculateHistoryStats = (logs: NutritionLog[]) => {
    const statsMap = new Map<string, DailyStats>();

    logs.forEach(log => {
      const date = log.ngayghinhan;
      if (!statsMap.has(date)) {
        statsMap.set(date, {
          date,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          logsCount: 0
        });
      }

      const stats = statsMap.get(date)!;
      stats.totalCalories += log.calo || 0;
      stats.totalProtein += log.dam || 0;
      stats.totalCarbs += log.carb || 0;
      stats.totalFat += log.chat || 0;
      stats.logsCount += 1;
    });

    setDailyStats(Array.from(statsMap.values()));
  };

  const calculateDailyTotals = () => {
    const totals = logs.reduce(
      (acc, log) => ({
        calories: acc.calories + (log.calo || 0),
        protein: acc.protein + (log.dam || 0),
        carbs: acc.carbs + (log.carb || 0),
        fat: acc.fat + (log.chat || 0)
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    setDailyTotals(totals);
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('NhatKyDinhDuong')
        .insert({
          nguoidungid: user.id,
          tenthucpham: newLog.food_name,
          calo: newLog.calories,
          dam: newLog.protein,
          carb: newLog.carbs,
          chat: newLog.fat,
          soluong: newLog.amount,
          donvi: newLog.unit,
          ghichu: newLog.notes,
          ngayghinhan: format(selectedDate, 'yyyy-MM-dd')
        });

      if (error) throw error;

      toast({
        title: "Thành công!",
        description: "Đã thêm món ăn vào nhật ký"
      });

      setNewLog({
        food_name: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        amount: 1,
        unit: "phần",
        notes: ""
      });

      fetchTodayLogs();
      fetchHistory();
      fetchStats();
    } catch (error) {
      console.error('Error adding nutrition log:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm vào nhật ký",
        variant: "destructive"
      });
    }
  };

  const handleAskAI = async () => {
    if (!question.trim()) return;

    const { data: profile } = await supabase
      .from('HoSoSucKhoe')
      .select('*')
      .eq('nguoidungid', user?.id)
      .maybeSingle();

    if (profile) {
      const aiProfile = {
        age: 30,
        height: profile.chieucao || 170,
        weight: profile.cannang || 70,
        gender: 'male',
        activityLevel: profile.mucdohoatdong || 'moderate',
        healthGoals: profile.muctieusuckhoe || [],
        dietaryRestrictions: profile.hanchechedo || [],
        medicalConditions: profile.tinhtrangsuckhoe || []
      };

      const response = await getNutritionAdvice(aiProfile, question);
      if (response) {
        setAiResponse(response.advice);
      }
    }
    setQuestion("");
  };

  const avgCaloriePercentage = (stats.averageCalories / targetCalories) * 100;
  const calorieStatus = avgCaloriePercentage > 110 ? 'over' : avgCaloriePercentage < 90 ? 'under' : 'on-target';

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 sm:w-8 sm:h-8" />
            Theo dõi dinh dưỡng
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Nhật ký, lịch sử và thống kê dinh dưỡng
          </p>
        </div>
        {allLogs.length > 0 && (
          <ExportButton
            onExportPDF={() => {
              const endDate = new Date();
              const startDate = new Date();
              startDate.setDate(startDate.getDate() - statsTimeRange);
              
              exportNutritionReportPDF(
                allLogs.map(log => ({
                  date: log.ngayghinhan,
                  mealType: "Bữa ăn",
                  foodName: log.tenthucpham || "",
                  calories: log.calo || 0,
                  protein: log.dam || 0,
                  carbs: log.carb || 0,
                  fat: log.chat || 0
                })),
                { from: format(startDate, 'dd/MM/yyyy'), to: format(endDate, 'dd/MM/yyyy') },
                {
                  totalCalories: allLogs.reduce((sum, l) => sum + (l.calo || 0), 0),
                  avgCalories: Math.round(stats.averageCalories),
                  totalProtein: allLogs.reduce((sum, l) => sum + (l.dam || 0), 0),
                  totalCarbs: allLogs.reduce((sum, l) => sum + (l.carb || 0), 0),
                  totalFat: allLogs.reduce((sum, l) => sum + (l.chat || 0), 0)
                }
              );
            }}
            onExportCSV={() => {
              const endDate = new Date();
              const startDate = new Date();
              startDate.setDate(startDate.getDate() - statsTimeRange);
              
              exportNutritionCSV(
                allLogs.map(log => ({
                  date: log.ngayghinhan,
                  mealType: "Bữa ăn",
                  foodName: log.tenthucpham || "",
                  calories: log.calo || 0,
                  protein: log.dam || 0,
                  carbs: log.carb || 0,
                  fat: log.chat || 0
                })),
                { from: format(startDate, 'yyyy-MM-dd'), to: format(endDate, 'yyyy-MM-dd') }
              );
            }}
            size="sm"
          />
        )}
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="today" className="text-xs sm:text-sm py-2">Hôm nay</TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm py-2">Lịch sử</TabsTrigger>
          <TabsTrigger value="stats" className="text-xs sm:text-sm py-2">Thống kê</TabsTrigger>
        </TabsList>

        {/* TODAY TAB */}
        <TabsContent value="today" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-1">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  Chọn Ngày
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-4 sm:space-y-6">
              {/* Daily Summary */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">
                    Tổng Kết Ngày {format(selectedDate, 'dd/MM/yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                    <div className="text-center p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {Math.round(dailyTotals.calories)}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Calories</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                        {Math.round(dailyTotals.protein)}g
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Protein</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(dailyTotals.carbs)}g
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Carbs</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {Math.round(dailyTotals.fat)}g
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Fat</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="logs" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-auto">
                  <TabsTrigger value="logs" className="text-xs sm:text-sm py-2">Nhật Ký</TabsTrigger>
                  <TabsTrigger value="add" className="text-xs sm:text-sm py-2">Thêm Món</TabsTrigger>
                  <TabsTrigger value="ai" className="text-xs sm:text-sm py-2">Tư Vấn AI</TabsTrigger>
                </TabsList>

                <TabsContent value="logs" className="space-y-3 sm:space-y-4">
                  {logs.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 p-4 sm:p-6">
                        <Activity className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mb-4" />
                        <h3 className="text-base sm:text-lg font-semibold mb-2">Chưa có dữ liệu</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground text-center">
                          Chưa có món ăn nào được ghi nhận cho ngày này
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {logs.map((log) => (
                        <Card key={log.id}>
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm sm:text-base truncate">{log.tenthucpham}</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  {log.soluong} {log.donvi}
                                </p>
                                {log.ghichu && (
                                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {log.ghichu}
                                  </p>
                                )}
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="font-semibold text-sm sm:text-base">{log.calo} cal</div>
                                <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                                  P: {log.dam}g | C: {log.carb}g | F: {log.chat}g
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="add">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Thêm Món Ăn
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddLog} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="food_name">Tên món ăn</Label>
                            <Input
                              id="food_name"
                              value={newLog.food_name}
                              onChange={(e) => setNewLog({...newLog, food_name: e.target.value})}
                              placeholder="Ví dụ: Cơm gà"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label htmlFor="amount">Số lượng</Label>
                              <Input
                                id="amount"
                                type="number"
                                min="0.1"
                                step="0.1"
                                value={newLog.amount || ''}
                                onChange={(e) => setNewLog({...newLog, amount: parseFloat(e.target.value) || 1})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="unit">Đơn vị</Label>
                              <Input
                                id="unit"
                                value={newLog.unit}
                                onChange={(e) => setNewLog({...newLog, unit: e.target.value})}
                                placeholder="phần, gam, ml..."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="calories">Calories</Label>
                            <Input
                              id="calories"
                              type="number"
                              min="0"
                              value={newLog.calories || ''}
                              onChange={(e) => setNewLog({...newLog, calories: parseInt(e.target.value) || 0})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="protein">Protein (g)</Label>
                            <Input
                              id="protein"
                              type="number"
                              min="0"
                              step="0.1"
                              value={newLog.protein || ''}
                              onChange={(e) => setNewLog({...newLog, protein: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="carbs">Carbs (g)</Label>
                            <Input
                              id="carbs"
                              type="number"
                              min="0"
                              step="0.1"
                              value={newLog.carbs || ''}
                              onChange={(e) => setNewLog({...newLog, carbs: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fat">Fat (g)</Label>
                            <Input
                              id="fat"
                              type="number"
                              min="0"
                              step="0.1"
                              value={newLog.fat || ''}
                              onChange={(e) => setNewLog({...newLog, fat: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                          <Textarea
                            id="notes"
                            value={newLog.notes}
                            onChange={(e) => setNewLog({...newLog, notes: e.target.value})}
                            placeholder="Ghi chú thêm về món ăn..."
                            rows={2}
                          />
                        </div>

                        <Button type="submit" className="w-full">
                          Thêm vào nhật ký
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ai">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Hỏi AI Chuyên Gia
                        </CardTitle>
                        <CardDescription>
                          Đặt câu hỏi về dinh dưỡng và nhận lời khuyên từ AI
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Hỏi về dinh dưỡng, thực phẩm, chế độ ăn..."
                            onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                          />
                          <Button onClick={handleAskAI} disabled={aiLoading}>
                            {aiLoading ? (
                              <Zap className="w-4 h-4 animate-spin" />
                            ) : (
                              <Zap className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        {aiResponse && (
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm whitespace-pre-wrap">{aiResponse}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history" className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">Lịch sử dinh dưỡng</h2>
              <p className="text-sm text-muted-foreground">Xem lại các bữa ăn đã ghi nhận</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={historyTimeRange === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHistoryTimeRange('week')}
              >
                7 ngày
              </Button>
              <Button 
                variant={historyTimeRange === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHistoryTimeRange('month')}
              >
                30 ngày
              </Button>
              <Button 
                variant={historyTimeRange === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHistoryTimeRange('all')}
              >
                Tất cả
              </Button>
            </div>
          </div>

          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily">Tổng hợp theo ngày</TabsTrigger>
              <TabsTrigger value="details">Chi tiết từng bữa</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4">
              {dailyStats.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Apple className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có dữ liệu</h3>
                    <p className="text-muted-foreground text-center">
                      Bạn chưa ghi nhận bữa ăn nào trong khoảng thời gian này
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {dailyStats.map((stat) => (
                    <Card key={stat.date}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {new Date(stat.date).toLocaleDateString('vi-VN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </CardTitle>
                          <Badge variant="secondary">{stat.logsCount} bữa ăn</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Calo</p>
                            <p className="text-2xl font-bold">{stat.totalCalories.toFixed(0)}</p>
                            <p className="text-xs text-muted-foreground">kcal</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Protein</p>
                            <p className="text-2xl font-bold">{stat.totalProtein.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">gram</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Carbs</p>
                            <p className="text-2xl font-bold">{stat.totalCarbs.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">gram</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Fat</p>
                            <p className="text-2xl font-bold">{stat.totalFat.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">gram</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              {allLogs.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Apple className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có dữ liệu</h3>
                    <p className="text-muted-foreground text-center">
                      Bạn chưa ghi nhận bữa ăn nào trong khoảng thời gian này
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {allLogs.map((log) => (
                    <Card key={log.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{log.tenthucpham}</h3>
                              <Badge variant="outline">
                                {log.soluong} {log.donvi}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {new Date(log.ngayghinhan).toLocaleDateString('vi-VN')} • 
                              {new Date(log.taoluc).toLocaleTimeString('vi-VN', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                            {log.ghichu && (
                              <p className="text-sm text-muted-foreground italic">"{log.ghichu}"</p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-2xl font-bold">{log.calo}</p>
                            <p className="text-xs text-muted-foreground">kcal</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground">Protein</p>
                            <p className="font-semibold">{log.dam}g</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Carbs</p>
                            <p className="font-semibold">{log.carb}g</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Fat</p>
                            <p className="font-semibold">{log.chat}g</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* STATS TAB */}
        <TabsContent value="stats" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">Thống kê dinh dưỡng</h2>
              <p className="text-sm text-muted-foreground">Phân tích xu hướng dinh dưỡng của bạn</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={statsTimeRange === 7 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatsTimeRange(7)}
              >
                7 ngày
              </Button>
              <Button 
                variant={statsTimeRange === 30 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatsTimeRange(30)}
              >
                30 ngày
              </Button>
              <Button 
                variant={statsTimeRange === 90 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatsTimeRange(90)}
              >
                90 ngày
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Trung bình calo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(stats.averageCalories)}</div>
                <p className="text-xs text-muted-foreground">
                  {calorieStatus === 'over' && '↑ Vượt mục tiêu'}
                  {calorieStatus === 'under' && '↓ Dưới mục tiêu'}
                  {calorieStatus === 'on-target' && '✓ Đạt mục tiêu'}
                </p>
                <Progress value={Math.min(avgCaloriePercentage, 100)} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Protein TB</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageProtein.toFixed(1)}g</div>
                <p className="text-xs text-muted-foreground">Mỗi ngày</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Carbs TB</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageCarbs.toFixed(1)}g</div>
                <p className="text-xs text-muted-foreground">Mỗi ngày</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fat TB</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageFat.toFixed(1)}g</div>
                <p className="text-xs text-muted-foreground">Mỗi ngày</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                  Hoạt động ghi nhận
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Tổng quan hoạt động theo dõi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-muted rounded-lg gap-2">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Tổng số bữa ăn</p>
                    <p className="text-2xl sm:text-3xl font-bold">{stats.totalLogs}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(stats.totalLogs / stats.daysTracked || 0)} bữa/ngày
                  </Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-muted rounded-lg gap-2">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Số ngày theo dõi</p>
                    <p className="text-2xl sm:text-3xl font-bold">{stats.daysTracked}</p>
                  </div>
                  <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  So sánh mục tiêu
                </CardTitle>
                <CardDescription>Đánh giá tiến độ đạt mục tiêu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Calo trung bình</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(stats.averageCalories)} / {targetCalories}
                    </span>
                  </div>
                  <Progress value={Math.min(avgCaloriePercentage, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(avgCaloriePercentage)}% mục tiêu
                  </p>
                </div>

                {calorieStatus === 'on-target' && (
                  <div className="p-4 bg-success/10 border border-success rounded-lg">
                    <p className="text-sm font-medium text-success">🎉 Tuyệt vời!</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Bạn đang duy trì được mục tiêu calo hàng ngày
                    </p>
                  </div>
                )}

                {calorieStatus === 'over' && (
                  <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                    <p className="text-sm font-medium text-destructive">⚠️ Cảnh báo</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Bạn đang nạp nhiều calo hơn mục tiêu. Hãy điều chỉnh khẩu phần ăn.
                    </p>
                  </div>
                )}

                {calorieStatus === 'under' && (
                  <div className="p-4 bg-warning/10 border border-warning rounded-lg">
                    <p className="text-sm font-medium text-warning">💡 Lưu ý</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Bạn đang nạp ít calo hơn mục tiêu. Đảm bảo đủ năng lượng cho cơ thể.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NutritionTracking;
