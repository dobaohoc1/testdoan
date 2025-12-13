# SƠ ĐỒ CLASS - HỆ THỐNG THUCDONAI

## 1. TỔNG QUAN
Tài liệu này mô tả các classes trong hệ thống ThucdonAI để vẽ Class Diagram.

---

## 2. DANH SÁCH CLASSES

### 2.1 MODULE NGƯỜI DÙNG

#### Class: NguoiDung (User)
**Package:** Authentication
**Stereotype:** Entity

**Attributes:**
- `id: UUID` {PK}
- `email: String`
- `matkhau: String` (hashed)
- `ngaytao: DateTime`
- `lantruycanphat: DateTime`

**Methods:**
- `+dangKy(): Boolean`
- `+dangNhap(): Boolean`
- `+dangXuat(): void`
- `+resetMatKhau(): Boolean`

**Relationships:**
- 1:1 với HoSo
- 1:1 với HoSoSucKhoe
- 1:1 với VaiTroNguoiDung
- 1:N với CongThuc
- 1:N với KeHoachBuaAn
- 1:N với NhatKyDinhDuong
- 1:N với NhatKyCanNang
- 1:N với NhatKyNuoc
- 1:N với DanhSachMuaSam
- 1:1 với GoiDangKyNguoiDung

---

#### Class: HoSo (Profile)
**Package:** UserManagement
**Stereotype:** Entity

**Attributes:**
- `id: UUID` {PK}
- `nguoidungid: UUID` {FK}
- `hoten: String`
- `email: String`
- `ngaysinh: Date`
- `gioitinh: String`
- `sodienthoai: String`
- `anhdaidien: String`
- `taoluc: DateTime`
- `capnhatluc: DateTime`

**Methods:**
- `+capNhat(data: Object): Boolean`
- `+layThongTin(): Object`
- `+uploadAvatar(file: File): String`

**Relationships:**
- N:1 với NguoiDung

---

#### Class: HoSoSucKhoe (HealthProfile)
**Package:** UserManagement
**Stereotype:** Entity

**Attributes:**
- `id: UUID` {PK}
- `nguoidungid: UUID` {FK}
- `chieucao: Decimal`
- `cannang: Decimal`
- `muctieucalohangngay: Integer`
- `muctieusuckhoe: Array<String>`
- `hanchechedo: Array<String>`
- `diung: Array<String>`
- `mucdohoatdong: String`
- `tinhtrangsuckhoe: Array<String>`
- `taoluc: DateTime`
- `capnhatluc: DateTime`

**Methods:**
- `+capNhat(data: Object): Boolean`
- `+tinhBMI(): Decimal`
- `+tinhTDEE(): Integer`
- `+layMucTieuCalo(): Integer`

**Relationships:**
- N:1 với NguoiDung

---

#### Class: VaiTroNguoiDung (UserRole)
**Package:** Authorization
**Stereotype:** Entity

**Attributes:**
- `id: UUID` {PK}
- `nguoidungid: UUID` {FK}
- `vaitro: Enum<app_role>` (admin|user)
- `taoluc: DateTime`

**Methods:**
- `+kiemTraQuyen(role: String): Boolean`
- `+ganVaiTro(role: String): Boolean`

**Relationships:**
- N:1 với NguoiDung

---

### 2.2 MODULE CÔNG THỨC NẤU ĂN

#### Class: CongThuc (Recipe)
**Package:** RecipeManagement
**Stereotype:** Entity

**Attributes:**
- `id: UUID` {PK}
- `ten: String`
- `mota: String`
- `anhdaidien: String`
- `dokho: String` (Dễ|Trung bình|Khó)
- `thoigianchuanbi: Integer` (phút)
- `thoigiannau: Integer` (phút)
- `khauphan: Integer`
- `huongdan: JSON`
- `congkhai: Boolean`
- `nguoitao: UUID` {FK}
- `tongcalo: Decimal`
- `tongdam: Decimal`
- `tongcarb: Decimal`
- `tongchat: Decimal`
- `taoluc: DateTime`
- `capnhatluc: DateTime`

**Methods:**
- `+tao(): Boolean`
- `+capNhat(data: Object): Boolean`
- `+xoa(): Boolean`
- `+tinhTongDinhDuong(): Object`
- `+phanTichAI(): Object`
- `+thayDoiTrangThaiCongKhai(): Boolean`

**Relationships:**
- N:1 với NguoiDung
- 1:N với NguyenLieuCongThuc
- 1:N với MonAnKeHoach
- 1:N với NhatKyDinhDuong

---

#### Class: NguyenLieu (Ingredient)
**Package:** RecipeManagement
**Stereotype:** Entity

**Attributes:**
- `id: UUID` {PK}
- `ten: String`
- `calo100g: Decimal`
- `dam100g: Decimal`
- `carb100g: Decimal`
- `chat100g: Decimal`
- `duong100g: Decimal`
- `xo100g: Decimal`
- `natri100g: Decimal`
- `taoluc: DateTime`

**Methods:**
- `+tinhDinhDuong(soluong: Decimal, donvi: String): Object`
- `+timKiem(keyword: String): Array<NguyenLieu>`

**Relationships:**
- 1:N với NguyenLieuCongThuc

---

#### Class: NguyenLieuCongThuc (RecipeIngredient)
**Package:** RecipeManagement
**Stereotype:** Association

**Attributes:**
- `id: UUID` {PK}
- `congthucid: UUID` {FK}
- `nguyenlieuid: UUID` {FK}
- `soluong: Decimal`
- `donvi: String`

**Methods:**
- `+tinhDinhDuong(): Object`

**Relationships:**
- N:1 với CongThuc
- N:1 với NguyenLieu

---

### 2.3 MODULE KẾ HOẠCH BỮA ĂN

#### Class: KeHoachBuaAn (MealPlan)
**Package:** MealPlanning
**Stereotype:** Entity

**Attributes:**
- `id: UUID` {PK}
- `nguoidungid: UUID` {FK}
- `ten: String`
- `mota: String`
- `ngaybatdau: Date`
- `ngayketthuc: Date`
- `muctieucalo: Integer`
- `danghoatdong: Boolean`
- `taoluc: DateTime`
- `capnhatluc: DateTime`

**Methods:**
- `+tao(): Boolean`
- `+capNhat(data: Object): Boolean`
- `+xoa(): Boolean`
- `+taoTuDong(params: Object): Boolean`
- `+themMonAn(meal: Object): Boolean`
- `+xoaMonAn(mealId: UUID): Boolean`
- `+layDanhSachTheoNgay(date: Date): Array<MonAnKeHoach>`

**Relationships:**
- N:1 với NguoiDung
- 1:N với MonAnKeHoach

---

#### Class: MonAnKeHoach (MealPlanItem)
**Package:** MealPlanning
**Stereotype:** Entity

**Attributes:**
- `id: UUID` {PK}
- `kehoachid: UUID` {FK}
- `congthucid: UUID` {FK}
- `danhmucid: UUID` {FK}
- `ngaydukien: Date`
- `giodukien: Time`
- `khauphan: Decimal`
- `taoluc: DateTime`

**Methods:**
- `+tinhDinhDuong(): Object`
- `+capNhat(data: Object): Boolean`

**Relationships:**
- N:1 với KeHoachBuaAn
- N:1 với CongThuc
- N:1 với DanhMucBuaAn

---

#### Class: DanhMucBuaAn (MealCategory)
**Package:** MealPlanning
**Stereotype:** Entity

**Attributes:**
- `id: UUID` {PK}
- `ten: String` (Sáng|Trưa|Tối|Snack)
- `mota: String`
- `thutuhienthi: Integer`
- `taoluc: DateTime`

**Methods:**
- `+layDanhSach(): Array<DanhMucBuaAn>`

**Relationships:**
- 1:N với MonAnKeHoach
- 1:N với NhatKyDinhDuong

---

### 2.4 MODULE THEO DÕI

#### Class: NhatKyDinhDuong (NutritionLog)
**Package:** Tracking
**Stereotype:** Entity

**Attributes:**
- `id: UUID` {PK}
- `nguoidungid: UUID` {FK}
- `ngayghinhan: Date`
- `danhmucid: UUID` {FK}
- `congthucid: UUID` {FK}
- `tenthucpham: String`
- `soluong: Decimal`
- `donvi: String`
- `calo: Decimal`
- `dam: Decimal`
- `carb: Decimal`
- `chat: Decimal`
- `ghichu: String`
- `taoluc: DateTime`

**Methods:**
- `+ghiNhan(data: Object): Boolean`
- `+capNhat(data: Object): Boolean`
- `+xoa(): Boolean`
- `+layTheoNgay(date: Date): Array<NhatKyDinhDuong>`
- `+tinhTongTheoNgay(date: Date): Object`
- `+layThongKe(startDate: Date, endDate: Date): Object`

**Relationships:**
- N:1 với NguoiDung
- N:1 với DanhMucBuaAn
- N:1 với CongThuc

---

#### Class: NhatKyCanNang (WeightLog)
**Package:** Tracking
**Stereotype:** Entity

**Attributes:**
- `id: UUID` {PK}
- `nguoidungid: UUID` {FK}
- `ngayghinhan: Date`
- `cannang: Decimal`
- `ghichu: String`
- `taoluc: DateTime`

**Methods:**
- `+ghiNhan(weight: Decimal, note: String): Boolean`
- `+capNhat(data: Object): Boolean`
- `+xoa(): Boolean`
- `+layLichSu(startDate: Date, endDate: Date): Array<NhatKyCanNang>`
- `+tinhTrungBinh(days: Integer): Decimal`

**Relationships:**
- N:1 với NguoiDung

---

#### Class: NhatKyNuoc (WaterLog)
**Package:** Tracking
**Stereotype:** Entity

**Attributes:**
- `id: UUID` {PK}
- `nguoidungid: UUID` {FK}
- `ngayghinhan: Date`
- `gioghinhan: Time`
- `soluongml: Integer`
- `taoluc: DateTime`

**Methods:**
- `+ghiNhan(amount: Integer): Boolean`
- `+xoa(): Boolean`
- `+layTheoNgay(date: Date): Array<NhatKyNuoc>`
- `+tinhTongTheoNgay(date: Date): Integer`

**Relationships:**
- N:1 với NguoiDung

---

### 2.5 MODULE MUA SẮM

#### Class: DanhSachMuaSam (ShoppingList)
**Package:** Shopping
**Stereotype:** Entity

**Attributes:**
- `id: UUID` {PK}
- `nguoidungid: UUID` {FK}
- `ten: String`
- `taoluc: DateTime`
- `capnhatluc: DateTime`

**Methods:**
- `+tao(): Boolean`
- `+xoa(): Boolean`
- `+themMon(item: Object): Boolean`
- `+xoaMon(itemId: UUID): Boolean`
- `+dauDauDaMua(itemId: UUID): Boolean`

**Relationships:**
- N:1 với NguoiDung
- 1:N với MonMuaSam

---

#### Class: MonMuaSam (ShoppingItem)
**Package:** Shopping
**Stereotype:** Entity

**Attributes:**
- `id: UUID` {PK}
- `danhsachid: UUID` {FK}
- `tennguyenlieu: String`
- `soluong: Decimal`
- `donvi: String`
- `damua: Boolean`
- `taoluc: DateTime`

**Methods:**
- `+capNhat(data: Object): Boolean`
- `+danhDauDaMua(): Boolean`

**Relationships:**
- N:1 với DanhSachMuaSam

---

### 2.6 MODULE GÓI ĐĂNG KÝ

#### Class: GoiDangKy (SubscriptionPlan)
**Package:** Subscription
**Stereotype:** Entity

**Attributes:**
- `id: UUID` {PK}
- `ten: String`
- `mota: String`
- `giathang: Decimal`
- `gianam: Decimal`
- `tinhnang: JSON`
- `sokehoachtoida: Integer`
- `socongthuctoida: Integer`
- `danghoatdong: Boolean`
- `taoluc: DateTime`

**Methods:**
- `+layDanhSach(): Array<GoiDangKy>`
- `+layTheoId(id: UUID): GoiDangKy`

**Relationships:**
- 1:N với GoiDangKyNguoiDung

---

#### Class: GoiDangKyNguoiDung (UserSubscription)
**Package:** Subscription
**Stereotype:** Entity

**Attributes:**
- `id: UUID` {PK}
- `nguoidungid: UUID` {FK}
- `goidangkyid: UUID` {FK}
- `trangthai: String` (active|cancelled|expired)
- `batdauky: DateTime`
- `ketthucky: DateTime`
- `stripekhachhangid: String`
- `stripedangkyid: String`
- `taoluc: DateTime`
- `capnhatluc: DateTime`

**Methods:**
- `+dangKy(planId: UUID): Boolean`
- `+huy(): Boolean`
- `+kiemTraHieuLuc(): Boolean`
- `+gia han(): Boolean`

**Relationships:**
- N:1 với NguoiDung
- N:1 với GoiDangKy

---

### 2.7 MODULE AI SERVICES

#### Class: AIAdvisor (Abstract)
**Package:** AIServices
**Stereotype:** Service

**Methods:**
- `+tuVan(profile: HoSoSucKhoe): Object`
- `+phanTich(data: Object): Object`

---

#### Class: FoodScanner
**Package:** AIServices
**Stereotype:** Service
**Extends:** AIAdvisor

**Methods:**
- `+quetThucPham(image: File): Object`
- `+nhanDien(image: File): String`
- `+tinhDinhDuong(foodName: String): Object`

---

#### Class: RecipeAnalyzer
**Package:** AIServices
**Stereotype:** Service
**Extends:** AIAdvisor

**Methods:**
- `+phanTichCongThuc(recipe: CongThuc): Object`
- `+danhGiaLoiIch(recipe: CongThuc): Object`
- `+canhBao(recipe: CongThuc, profile: HoSoSucKhoe): Array<String>`

---

#### Class: MealPlanGenerator
**Package:** AIServices
**Stereotype:** Service
**Extends:** AIAdvisor

**Methods:**
- `+taoKeHoachTuDong(params: Object): KeHoachBuaAn`
- `+deXuatMonAn(profile: HoSoSucKhoe, category: String): Array<CongThuc>`
- `+toiUuDinhDuong(plan: KeHoachBuaAn): KeHoachBuaAn`

---

#### Class: NutritionChatbot
**Package:** AIServices
**Stereotype:** Service
**Extends:** AIAdvisor

**Methods:**
- `+chat(message: String, context: Object): String`
- `+layLichSuHoiThoai(userId: UUID): Array<Object>`

---

### 2.8 MODULE UTILITIES

#### Class: BMICalculator
**Package:** Utilities
**Stereotype:** Service

**Methods:**
- `+static tinhBMI(height: Decimal, weight: Decimal): Decimal`
- `+static phanLoaiBMI(bmi: Decimal): String`
- `+static deXuatCanNang(height: Decimal): Object`

---

#### Class: TDEECalculator
**Package:** Utilities
**Stereotype:** Service

**Methods:**
- `+static tinhBMR(weight: Decimal, height: Decimal, age: Integer, gender: String): Integer`
- `+static tinhTDEE(bmr: Integer, activityLevel: String): Integer`
- `+static deXuatCalo(tdee: Integer, goal: String): Integer`

---

#### Class: NutritionCalculator
**Package:** Utilities
**Stereotype:** Service

**Methods:**
- `+static tinhDinhDuong(ingredients: Array<Object>): Object`
- `+static tinhMacroRatio(calories: Integer, protein: Decimal, carb: Decimal, fat: Decimal): Object`

---

## 3. QUAN HỆ GIỮA CÁC CLASSES

### 3.1 Kế thừa (Inheritance)
```
AIAdvisor (Abstract)
├── FoodScanner
├── RecipeAnalyzer
├── MealPlanGenerator
└── NutritionChatbot
```

### 3.2 Liên kết (Association)
- **NguoiDung** - **HoSo**: 1:1 (Composition)
- **NguoiDung** - **HoSoSucKhoe**: 1:1 (Composition)
- **NguoiDung** - **VaiTroNguoiDung**: 1:1 (Composition)
- **NguoiDung** - **CongThuc**: 1:N (Aggregation)
- **NguoiDung** - **KeHoachBuaAn**: 1:N (Aggregation)
- **NguoiDung** - **NhatKyDinhDuong**: 1:N (Aggregation)
- **NguoiDung** - **NhatKyCanNang**: 1:N (Aggregation)
- **NguoiDung** - **NhatKyNuoc**: 1:N (Aggregation)
- **NguoiDung** - **DanhSachMuaSam**: 1:N (Aggregation)
- **NguoiDung** - **GoiDangKyNguoiDung**: 1:1 (Aggregation)

### 3.3 Liên kết nhiều-nhiều (Many-to-Many)
- **CongThuc** - **NguyenLieu**: N:N qua **NguyenLieuCongThuc**

### 3.4 Phụ thuộc (Dependency)
- **FoodScanner** ---> **NguyenLieu**
- **RecipeAnalyzer** ---> **CongThuc**
- **RecipeAnalyzer** ---> **HoSoSucKhoe**
- **MealPlanGenerator** ---> **KeHoachBuaAn**
- **MealPlanGenerator** ---> **CongThuc**
- **BMICalculator** ---> **HoSoSucKhoe**
- **TDEECalculator** ---> **HoSoSucKhoe**
- **NutritionCalculator** ---> **NguyenLieuCongThuc**

---

## 4. MULTIPLICITY (SỐ LƯỢNG)

| Class A | Quan hệ | Class B | Multiplicity |
|---------|---------|---------|--------------|
| NguoiDung | owns | HoSo | 1:1 |
| NguoiDung | owns | HoSoSucKhoe | 1:1 |
| NguoiDung | owns | VaiTroNguoiDung | 1:1 |
| NguoiDung | creates | CongThuc | 1:0..* |
| NguoiDung | creates | KeHoachBuaAn | 1:0..* |
| NguoiDung | logs | NhatKyDinhDuong | 1:0..* |
| NguoiDung | logs | NhatKyCanNang | 1:0..* |
| NguoiDung | logs | NhatKyNuoc | 1:0..* |
| NguoiDung | creates | DanhSachMuaSam | 1:0..* |
| NguoiDung | subscribes | GoiDangKyNguoiDung | 1:0..1 |
| CongThuc | contains | NguyenLieuCongThuc | 1:1..* |
| NguyenLieu | used in | NguyenLieuCongThuc | 1:0..* |
| KeHoachBuaAn | includes | MonAnKeHoach | 1:0..* |
| DanhMucBuaAn | categorizes | MonAnKeHoach | 1:0..* |
| CongThuc | used in | MonAnKeHoach | 1:0..* |
| DanhSachMuaSam | contains | MonMuaSam | 1:0..* |
| GoiDangKy | offered to | GoiDangKyNguoiDung | 1:0..* |

---

## 5. DESIGN PATTERNS SỬ DỤNG

### 5.1 Repository Pattern
- Tất cả các Entity classes đều có một Repository tương ứng
- VD: `CongThucRepository`, `NguoiDungRepository`

### 5.2 Service Layer Pattern
- Các AI Services đều là Service classes
- VD: `FoodScanner`, `RecipeAnalyzer`, `MealPlanGenerator`

### 5.3 Strategy Pattern
- `AIAdvisor` là abstract class
- Các concrete implementations: `FoodScanner`, `RecipeAnalyzer`, etc.

### 5.4 Factory Pattern
- `MealPlanGenerator` tạo `KeHoachBuaAn` và `MonAnKeHoach`

### 5.5 Singleton Pattern
- Các utility classes: `BMICalculator`, `TDEECalculator`, `NutritionCalculator`

---

## 6. NOTES CHO VẼ CLASS DIAGRAM

1. **Package Organization**: Nhóm các classes theo package (module)
2. **Stereotype**: Ghi rõ stereotype cho mỗi class (Entity, Service, etc.)
3. **Visibility**: 
   - `+` public
   - `-` private
   - `#` protected
4. **Data Types**: Sử dụng UUID, String, Integer, Decimal, Boolean, DateTime, Date, Time, JSON, Array
5. **Relationships**:
   - Solid line với filled diamond: Composition
   - Solid line với empty diamond: Aggregation
   - Solid line với arrow: Association
   - Dashed line with arrow: Dependency
   - Solid line with empty triangle: Inheritance
6. **Multiplicity**: Ghi rõ số lượng ở mỗi đầu của relationship (1, 0..1, 0..*, 1..*)
