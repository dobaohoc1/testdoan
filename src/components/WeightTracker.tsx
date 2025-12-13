import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useWeightLogs } from '@/hooks/useWeightLogs';
import { Scale, Plus, Trash2, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const WeightTracker = () => {
  const { addWeightLog, getWeightLogs, deleteWeightLog, loading } = useWeightLogs();
  const [logs, setLogs] = useState<any[]>([]);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const data = await getWeightLogs(30);
    setLogs(data);
  };

  const handleAddLog = async () => {
    if (!weight) return;

    await addWeightLog({
      cannang: parseFloat(weight),
      ngayghinhan: logDate,
      ghichu: notes
    });

    setWeight('');
    setNotes('');
    setLogDate(new Date().toISOString().split('T')[0]);
    loadLogs();
  };

  const handleDelete = async (id: string) => {
    await deleteWeightLog(id);
    loadLogs();
  };

  const getWeightTrend = () => {
    if (logs.length < 2) return null;
    const latest = logs[0].cannang;
    const previous = logs[1].cannang;
    const diff = latest - previous;
    return { diff: Math.abs(diff), increasing: diff > 0 };
  };

  const trend = getWeightTrend();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Theo dõi cân nặng
          </CardTitle>
          <CardDescription>Ghi lại cân nặng hàng ngày của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Cân nặng (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Ngày</Label>
              <Input
                id="date"
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Vd: Sau khi tập gym, trước bữa sáng..."
              rows={2}
            />
          </div>
          <Button onClick={handleAddLog} disabled={loading || !weight}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm bản ghi
          </Button>
        </CardContent>
      </Card>

      {trend && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Xu hướng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {trend.increasing ? (
                <TrendingUp className="h-5 w-5 text-orange-500" />
              ) : trend.diff === 0 ? (
                <Minus className="h-5 w-5 text-blue-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-green-500" />
              )}
              <span className="text-2xl font-bold">
                {trend.increasing ? '+' : '-'}{trend.diff.toFixed(1)} kg
              </span>
              <span className="text-muted-foreground">so với lần trước</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lịch sử cân nặng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Chưa có bản ghi nào. Hãy thêm cân nặng đầu tiên!
              </p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-semibold">{log.cannang} kg</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(log.ngayghinhan), 'dd MMMM yyyy', { locale: vi })}
                    </div>
                    {log.ghichu && (
                      <div className="text-sm text-muted-foreground mt-1">{log.ghichu}</div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(log.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
