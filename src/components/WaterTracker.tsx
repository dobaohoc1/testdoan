import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useWaterLogs } from '@/hooks/useWaterLogs';
import { calculateWaterIntake } from '@/lib/healthCalculations';
import { Droplets, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WaterTrackerProps {
  weight?: number;
  activityLevel?: string;
}

export const WaterTracker = ({ weight = 70, activityLevel = 'moderate' }: WaterTrackerProps) => {
  const { addWaterLog, getTodayWaterLogs, loading } = useWaterLogs();
  const [todayLogs, setTodayLogs] = useState<any[]>([]);
  const [totalToday, setTotalToday] = useState(0);
  const recommendedIntake = calculateWaterIntake(weight, activityLevel);

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
    await addWaterLog(amount);
    loadTodayLogs();
  };

  const progress = Math.min((totalToday / recommendedIntake) * 100, 100);
  const remaining = Math.max(recommendedIntake - totalToday, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5" />
          Theo dõi uống nước
        </CardTitle>
        <CardDescription>
          Mục tiêu hàng ngày: {recommendedIntake}ml
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Đã uống: {totalToday}ml</span>
            <span>Còn lại: {remaining}ml</span>
          </div>
          <Progress value={progress} className="h-3" />
          {progress >= 100 && (
            <Badge className="w-full justify-center">
              🎉 Đã hoàn thành mục tiêu hôm nay!
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            variant="outline"
            onClick={() => handleAddWater(100)}
            disabled={loading}
            className="h-20"
          >
            <div className="text-center">
              <Plus className="h-4 w-4 mx-auto mb-1" />
              <div className="text-sm">100ml</div>
            </div>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAddWater(200)}
            disabled={loading}
            className="h-20"
          >
            <div className="text-center">
              <Plus className="h-4 w-4 mx-auto mb-1" />
              <div className="text-sm">200ml</div>
            </div>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAddWater(300)}
            disabled={loading}
            className="h-20"
          >
            <div className="text-center">
              <Plus className="h-4 w-4 mx-auto mb-1" />
              <div className="text-sm">300ml</div>
            </div>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAddWater(500)}
            disabled={loading}
            className="h-20"
          >
            <div className="text-center">
              <Plus className="h-4 w-4 mx-auto mb-1" />
              <div className="text-sm">500ml</div>
            </div>
          </Button>
        </div>

        {todayLogs.length > 0 && (
          <div className="text-sm text-muted-foreground">
            <div className="font-medium mb-2">Hôm nay ({todayLogs.length} lần):</div>
            <div className="space-y-1">
              {todayLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex justify-between">
                  <span>{log.gioghinhan?.slice(0, 5)}</span>
                  <span>{log.soluongml}ml</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
