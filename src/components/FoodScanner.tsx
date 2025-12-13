import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFoodScanner } from '@/hooks/useFoodScanner';
import { useNutritionLogs } from '@/hooks/useNutritionLogs';
import { useFoodScanHistory } from '@/hooks/useFoodScanHistory';
import { Camera, Upload, Scan, Zap, Apple, AlertTriangle, PlusCircle, History, Trash2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const FoodScanner = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);
  const { scanFood, loading } = useFoodScanner();
  const { addNutritionLog, loading: logLoading } = useNutritionLogs();
  const { history, loading: historyLoading, saveScanToHistory, deleteScanHistory } = useFoodScanHistory();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!selectedImage) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn hình ảnh trước khi quét",
        variant: "destructive"
      });
      return;
    }

    const result = await scanFood(selectedImage);
    if (result) {
      // Map Vietnamese response to English interface
      const mappedResult = {
        foodName: result.nhanDien?.tenMon || 'Unknown',
        nutrition: {
          calories: result.dinhDuong?.caloUocTinh || 0,
          protein: result.dinhDuong?.protein || 0,
          carbohydrates: result.dinhDuong?.carb || 0,
          fat: result.dinhDuong?.fat || 0,
          fiber: result.dinhDuong?.chatXo || 0,
          sugar: 0,
          sodium: 0
        },
        ingredients: result.nguyenLieu?.map((ng: any) => ng.ten) || [],
        healthAssessment: {
          score: result.danhGia?.diemDinhDuong || 0,
          benefits: result.danhGia?.phuHop || [],
          concerns: result.danhGia?.canhBao || [],
          recommendations: result.danhGia?.goiY || []
        },
        portion: {
          estimatedWeight: result.dinhDuong?.donVi || '',
          servingSize: result.dinhDuong?.donVi || ''
        }
      };
      
      setScanResult(mappedResult);
      
      // Save to history
      await saveScanToHistory({
        urlhinhanh: selectedImage,
        tenmon: result.nhanDien?.tenMon || 'Unknown',
        loaithucpham: result.nhanDien?.loaiThucPham,
        dotincay: result.nhanDien?.doTinCay,
        mota: result.nhanDien?.moTa,
        calo: result.dinhDuong?.caloUocTinh,
        protein: result.dinhDuong?.protein,
        carb: result.dinhDuong?.carb,
        chat: result.dinhDuong?.fat,
        chatxo: result.dinhDuong?.chatXo,
        diemdinhdung: result.danhGia?.diemDinhDuong,
        mucdo_lanhmanh: result.danhGia?.mucDoLanhManh,
        phuhop: result.danhGia?.phuHop,
        canhbao: result.danhGia?.canhBao,
        goiy: result.danhGia?.goiY,
        nguyenlieu: result.nguyenLieu,
        thongtinbosung: result.thongTinBoSung
      });
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const handleAddToLog = async () => {
    if (!scanResult) return;

    const result = await addNutritionLog({
      ngayghinhan: format(new Date(), 'yyyy-MM-dd'),
      tenthucpham: scanResult.foodName,
      calo: scanResult.nutrition.calories,
      dam: scanResult.nutrition.protein,
      carb: scanResult.nutrition.carbohydrates,
      chat: scanResult.nutrition.fat,
      soluong: 1,
      donvi: 'phần',
      ghichu: `Quét bằng AI - Điểm sức khỏe: ${scanResult.healthAssessment.score}/100`
    });

    if (result) {
      toast({
        title: "Thành công! ✅",
        description: "Đã thêm vào nhật ký dinh dưỡng"
      });
    }
  };

  const loadHistoryItem = (item: any) => {
    setSelectedImage(item.urlhinhanh);
    setScanResult({
      foodName: item.tenmon,
      nutrition: {
        calories: item.calo || 0,
        protein: item.protein || 0,
        carbohydrates: item.carb || 0,
        fat: item.chat || 0,
        fiber: item.chatxo || 0,
        sugar: 0,
        sodium: 0
      },
      ingredients: item.nguyenlieu?.map((ng: any) => ng.ten) || [],
      healthAssessment: {
        score: item.diemdinhdung || 0,
        benefits: item.phuhop || [],
        concerns: item.canhbao || [],
        recommendations: item.goiy || []
      },
      portion: {
        estimatedWeight: '',
        servingSize: ''
      }
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="scan" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scan">
            <Scan className="w-4 h-4 mr-2" />
            Quét mới
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            Lịch sử ({history.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-6">
          <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="w-5 h-5" />
            Quét Thực Phẩm AI
          </CardTitle>
          <CardDescription>
            Chụp ảnh hoặc tải lên hình ảnh thực phẩm để phân tích dinh dưỡng
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              ref={fileInputRef}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Tải ảnh lên
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Camera capture would be implemented here
                toast({
                  title: "Tính năng đang phát triển",
                  description: "Chức năng chụp ảnh sẽ được bổ sung trong phiên bản tới"
                });
              }}
              className="gap-2"
            >
              <Camera className="w-4 h-4" />
              Chụp ảnh
            </Button>
          </div>

          {selectedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Thực phẩm được chọn"
                  className="w-full max-w-md mx-auto rounded-lg border"
                />
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={handleScan}
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? (
                    <Zap className="w-4 h-4 animate-spin" />
                  ) : (
                    <Scan className="w-4 h-4" />
                  )}
                  {loading ? 'Đang phân tích...' : 'Quét và phân tích'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {scanResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center gap-2">
                <Apple className="w-5 h-5" />
                {scanResult.foodName}
              </CardTitle>
              <Badge className={getHealthScoreColor(scanResult.healthAssessment.score)}>
                Điểm sức khỏe: {scanResult.healthAssessment.score}/100
              </Badge>
            </div>
            <Button 
              onClick={handleAddToLog} 
              disabled={logLoading}
              className="w-full"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Thêm vào nhật ký dinh dưỡng
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nutrition Info */}
            <div>
              <h4 className="font-semibold mb-2">Thông tin dinh dưỡng</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-lg font-bold text-orange-600">
                    {scanResult.nutrition.calories}
                  </div>
                  <div className="text-sm text-muted-foreground">Calories</div>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {scanResult.nutrition.protein}g
                  </div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {scanResult.nutrition.carbohydrates}g
                  </div>
                  <div className="text-sm text-muted-foreground">Carbs</div>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {scanResult.nutrition.fat}g
                  </div>
                  <div className="text-sm text-muted-foreground">Fat</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Health Assessment */}
            <div>
              <h4 className="font-semibold mb-2">Đánh giá sức khỏe</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {scanResult.healthAssessment.benefits.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-green-600 mb-1">Lợi ích:</h5>
                    <ul className="text-sm space-y-1">
                      {scanResult.healthAssessment.benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-green-500">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {scanResult.healthAssessment.concerns.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-yellow-600 mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Lưu ý:
                    </h5>
                    <ul className="text-sm space-y-1">
                      {scanResult.healthAssessment.concerns.map((concern: string, index: number) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-yellow-500">•</span>
                          <span>{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {scanResult.healthAssessment.recommendations.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Gợi ý</h4>
                  <ul className="text-sm space-y-1">
                    {scanResult.healthAssessment.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-blue-500">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {scanResult.ingredients.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Thành phần</h4>
                  <div className="flex flex-wrap gap-1">
                    {scanResult.ingredients.map((ingredient: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {historyLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">Đang tải...</div>
              </CardContent>
            </Card>
          ) : history.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có lịch sử quét nào</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            history.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {item.urlhinhanh && (
                      <img 
                        src={item.urlhinhanh} 
                        alt={item.tenmon || 'Food'} 
                        className="w-20 h-20 rounded-lg object-cover cursor-pointer"
                        onClick={() => loadHistoryItem(item)}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-base truncate">{item.tenmon}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(item.taoluc), 'dd MMM yyyy, HH:mm', { locale: vi })}
                          </div>
                        </div>
                        {item.diemdinhdung && (
                          <Badge className={getHealthScoreColor(item.diemdinhdung)}>
                            {item.diemdinhdung}/100
                          </Badge>
                        )}
                      </div>
                      
                      {item.calo && (
                        <div className="grid grid-cols-4 gap-2 mb-3">
                          <div className="text-center bg-secondary/50 rounded p-1">
                            <div className="text-sm font-semibold text-orange-600">{item.calo}</div>
                            <div className="text-xs text-muted-foreground">Cal</div>
                          </div>
                          <div className="text-center bg-secondary/50 rounded p-1">
                            <div className="text-sm font-semibold text-green-600">{item.protein}g</div>
                            <div className="text-xs text-muted-foreground">Protein</div>
                          </div>
                          <div className="text-center bg-secondary/50 rounded p-1">
                            <div className="text-sm font-semibold text-blue-600">{item.carb}g</div>
                            <div className="text-xs text-muted-foreground">Carb</div>
                          </div>
                          <div className="text-center bg-secondary/50 rounded p-1">
                            <div className="text-sm font-semibold text-purple-600">{item.chat}g</div>
                            <div className="text-xs text-muted-foreground">Fat</div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => loadHistoryItem(item)}
                          className="flex-1"
                        >
                          <Scan className="w-3 h-3 mr-1" />
                          Xem chi tiết
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteScanHistory(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};