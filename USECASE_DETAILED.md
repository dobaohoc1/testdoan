# USE CASE CHI TIẾT - HỆ THỐNG THUCDONAI

---

## NHÓM 1: QUẢN LÝ TÀI KHOẢN VÀ HỒ SƠ

### UC-001: Đăng ký tài khoản

**Actor:** Guest

**Mô tả:** Người dùng mới tạo tài khoản trong hệ thống

**Điều kiện tiên quyết:**
- Người dùng chưa có tài khoản
- Có kết nối internet

**Luồng chính:**
1. Người dùng truy cập trang đăng ký
2. Hệ thống hiển thị form đăng ký với các trường:
   - Email
   - Mật khẩu
   - Xác nhận mật khẩu
3. Người dùng điền thông tin và submit
4. Hệ thống validate dữ liệu:
   - Email hợp lệ và chưa tồn tại
   - Mật khẩu đủ mạnh (tối thiểu 6 ký tự)
   - Mật khẩu và xác nhận khớp nhau
5. Hệ thống tạo tài khoản trong Supabase Auth
6. Hệ thống tự động trigger:
   - Tạo profile trong bảng `HoSo`
   - Tạo vai trò mặc định (user) trong bảng `VaiTroNguoiDung`
   - Gán gói miễn phí trong bảng `GoiDangKyNguoiDung`
7. Hệ thống gửi email xác thực (nếu bật)
8. Người dùng được chuyển đến trang dashboard

**Luồng thay thế:**
- 4a. Email đã tồn tại:
  - Hệ thống hiển thị lỗi "Email đã được sử dụng"
  - Quay lại bước 2
- 4b. Mật khẩu không đủ mạnh:
  - Hệ thống hiển thị lỗi "Mật khẩu phải có ít nhất 6 ký tự"
  - Quay lại bước 2
- 4c. Mật khẩu không khớp:
  - Hệ thống hiển thị lỗi "Mật khẩu xác nhận không khớp"
  - Quay lại bước 2

**Kết quả:**
- Tài khoản mới được tạo
- Profile được khởi tạo
- Vai trò user được gán
- Gói miễn phí được kích hoạt

**Bảng liên quan:**
- `auth.users` (Supabase Auth)
- `HoSo`
- `VaiTroNguoiDung`
- `GoiDangKyNguoiDung`

---

### UC-002: Đăng nhập

**Actor:** Guest

**Mô tả:** Người dùng đăng nhập vào hệ thống

**Điều kiện tiên quyết:**
- Đã có tài khoản
- Có kết nối internet

**Luồng chính:**
1. Người dùng truy cập trang đăng nhập
2. Hệ thống hiển thị form đăng nhập:
   - Email
   - Mật khẩu
3. Người dùng điền thông tin và submit
4. Hệ thống xác thực thông tin với Supabase Auth
5. Nếu hợp lệ, hệ thống tạo session
6. Hệ thống tải thông tin người dùng:
   - Profile từ `HoSo`
   - Vai trò từ `VaiTroNguoiDung`
   - Gói đăng ký từ `GoiDangKyNguoiDung`
7. Người dùng được chuyển đến dashboard

**Luồng thay thế:**
- 4a. Email hoặc mật khẩu sai:
  - Hệ thống hiển thị lỗi "Email hoặc mật khẩu không đúng"
  - Quay lại bước 2
- 4b. Tài khoản bị khóa:
  - Hệ thống hiển thị lỗi "Tài khoản đã bị khóa"
  - Kết thúc use case

**Kết quả:**
- Người dùng đăng nhập thành công
- Session được tạo
- Chuyển đến dashboard

**Bảng liên quan:**
- `auth.users`
- `HoSo`
- `VaiTroNguoiDung`
- `GoiDangKyNguoiDung`

---

### UC-004: Quản lý hồ sơ cá nhân

**Actor:** User

**Mô tả:** Người dùng cập nhật thông tin cá nhân

**Điều kiện tiên quyết:**
- Đã đăng nhập

**Luồng chính:**
1. Người dùng truy cập trang Profile
2. Hệ thống tải và hiển thị thông tin hiện tại từ `HoSo`:
   - Họ tên
   - Email
   - Số điện thoại
   - Ngày sinh
   - Giới tính
   - Ảnh đại diện
3. Người dùng chỉnh sửa thông tin
4. Người dùng có thể upload ảnh đại diện mới:
   - Chọn file từ máy
   - Hệ thống upload lên Supabase Storage
   - Lấy URL và lưu vào `anhdaidien`
5. Người dùng nhấn "Cập nhật"
6. Hệ thống validate dữ liệu:
   - Email hợp lệ
   - Số điện thoại hợp lệ (nếu có)
   - Ngày sinh hợp lệ
7. Hệ thống cập nhật bảng `HoSo`
8. Hệ thống hiển thị thông báo thành công

**Luồng thay thế:**
- 6a. Dữ liệu không hợp lệ:
  - Hiển thị lỗi cụ thể
  - Quay lại bước 3

**Kết quả:**
- Thông tin profile được cập nhật
- Toast notification hiển thị

**Bảng liên quan:**
- `HoSo`
- `storage.objects` (cho ảnh đại diện)

---

### UC-005: Quản lý hồ sơ sức khỏe

**Actor:** User

**Mô tả:** Người dùng cập nhật thông tin sức khỏe để nhận tư vấn cá nhân hóa

**Điều kiện tiên quyết:**
- Đã đăng nhập

**Luồng chính:**
1. Người dùng truy cập trang Profile
2. Hệ thống tải thông tin từ `HoSoSucKhoe`:
   - Chiều cao (cm)
   - Cân nặng (kg)
   - Mục tiêu calo hàng ngày
   - Mức độ hoạt động
   - Mục tiêu sức khỏe (array)
   - Hạn chế chế độ ăn (array)
   - Dị ứng (array)
   - Tình trạng sức khỏe (array)
3. Người dùng cập nhật các thông tin
4. Người dùng nhấn "Lưu"
5. Hệ thống validate:
   - Chiều cao > 0
   - Cân nặng > 0
   - Mục tiêu calo hợp lý (1000-5000)
6. Hệ thống tính toán BMI tự động
7. Hệ thống cập nhật hoặc insert vào `HoSoSucKhoe`
8. Hiển thị thông báo thành công

**Luồng thay thế:**
- 5a. Dữ liệu không hợp lệ:
  - Hiển thị lỗi
  - Quay lại bước 3

**Kết quả:**
- Hồ sơ sức khỏe được cập nhật
- BMI được tính toán
- Dữ liệu sẵn sàng cho AI tư vấn

**Bảng liên quan:**
- `HoSoSucKhoe`

---

## NHÓM 2: QUẢN LÝ CÔNG THỨC NẤU ĂN

### UC-009: Tạo công thức mới

**Actor:** User

**Mô tả:** Người dùng tạo công thức nấu ăn mới

**Điều kiện tiên quyết:**
- Đã đăng nhập

**Luồng chính:**
1. Người dùng truy cập trang "Tạo công thức"
2. Hệ thống hiển thị form với các trường:
   - Tên công thức
   - Mô tả
   - Độ khó (Dễ/Trung bình/Khó)
   - Thời gian chuẩn bị (phút)
   - Thời gian nấu (phút)
   - Khẩu phần (số người)
   - Ảnh đại diện
   - Công khai (true/false)
   - Danh sách nguyên liệu
   - Hướng dẫn nấu (steps)
3. Người dùng nhập thông tin cơ bản
4. Người dùng thêm nguyên liệu:
   - Chọn từ danh sách `NguyenLieu`
   - Nhập số lượng
   - Chọn đơn vị (g, ml, cup, tbsp, etc.)
   - Có thể thêm nhiều nguyên liệu
5. Người dùng thêm hướng dẫn nấu:
   - Mỗi bước là một object
   - Có thể thêm ảnh cho từng bước
6. Người dùng upload ảnh đại diện (nếu có)
7. Người dùng submit form
8. Hệ thống validate:
   - Tên công thức không trống
   - Có ít nhất 1 nguyên liệu
   - Có ít nhất 1 bước hướng dẫn
9. Hệ thống tính toán tự động:
   - Tổng calories
   - Tổng protein
   - Tổng carb
   - Tổng fat
   - (dựa trên nguyên liệu và số lượng)
10. Hệ thống lưu:
    - Insert vào `CongThuc` với `nguoitao = auth.uid()`
    - Insert các nguyên liệu vào `NguyenLieuCongThuc`
11. Hiển thị thông báo thành công
12. Chuyển đến trang chi tiết công thức vừa tạo

**Luồng thay thế:**
- 8a. Validation thất bại:
  - Hiển thị lỗi cụ thể
  - Quay lại bước 2

**Kết quả:**
- Công thức mới được tạo
- Nguyên liệu được liên kết
- Thông tin dinh dưỡng được tính toán

**Bảng liên quan:**
- `CongThuc`
- `NguyenLieuCongThuc`
- `NguyenLieu`

---

### UC-012: Phân tích công thức bằng AI

**Actor:** User, System (Recipe Analyzer Edge Function)

**Mô tả:** Sử dụng AI để phân tích giá trị dinh dưỡng, lợi ích và cải thiện công thức

**Điều kiện tiên quyết:**
- Đã đăng nhập
- Đang xem một công thức

**Luồng chính:**
1. Người dùng nhấn nút "Phân tích bằng AI"
2. Hệ thống hiển thị loading state
3. Hệ thống gọi Edge Function `recipe-analyzer` với tham số:
   - `recipeText`: Tên + mô tả công thức
   - `ingredients`: Danh sách nguyên liệu
   - `recipeName`: Tên công thức
   - `imageUrl`: URL ảnh (nếu có)
4. Edge Function gọi OpenAI API với prompt đặc biệt
5. AI phân tích và trả về JSON:
   ```json
   {
     "nutrition": {
       "calories": 450,
       "protein": 25,
       "carbohydrates": 40,
       "fat": 18,
       "fiber": 8,
       "sugar": 5,
       "sodium": 600
     },
     "healthScore": 85,
     "benefits": ["Giàu protein", "Ít đường"],
     "improvements": ["Giảm muối", "Thêm rau xanh"],
     "allergensWarning": ["Gluten", "Sữa"],
     "servingSize": "1 khẩu phần (250g)",
     "cookingTips": ["Nấu lửa nhỏ để giữ vitamin"]
   }
   ```
6. Hệ thống hiển thị kết quả phân tích:
   - Bảng thông tin dinh dưỡng
   - Điểm sức khỏe (health score)
   - Lợi ích
   - Đề xuất cải thiện
   - Cảnh báo dị ứng
   - Mẹo nấu ăn
7. Người dùng có thể áp dụng thông tin vào công thức

**Luồng thay thế:**
- 4a. API lỗi:
  - Hiển thị thông báo lỗi
  - Cho phép thử lại
- 5a. JSON parse lỗi:
  - Hiển thị raw text từ AI
  - Log lỗi

**Kết quả:**
- Người dùng nhận được phân tích chi tiết
- Có thể cải thiện công thức dựa trên AI

**Edge Function:**
- `recipe-analyzer`

**API bên ngoài:**
- OpenAI Chat Completions API

---

## NHÓM 3: QUẢN LÝ KẾ HOẠCH BỮA ĂN

### UC-015: Tạo kế hoạch bữa ăn tự động bằng AI

**Actor:** User, System (Meal Plan Generator)

**Mô tả:** AI tự động tạo kế hoạch bữa ăn dựa trên hồ sơ sức khỏe

**Điều kiện tiên quyết:**
- Đã đăng nhập
- Đã có hồ sơ sức khỏe (chiều cao, cân nặng, mục tiêu)

**Luồng chính:**
1. Người dùng truy cập trang "Tạo kế hoạch bữa ăn"
2. Người dùng chọn "Tạo bằng AI"
3. Hệ thống hiển thị form:
   - Tên kế hoạch
   - Số ngày (1-30)
   - Ngày bắt đầu
   - Ngày kết thúc (tự động tính)
4. Người dùng điền thông tin và submit
5. Hệ thống tải `HoSoSucKhoe` của người dùng
6. Hệ thống gọi Edge Function `meal-plan-generator` với:
   ```json
   {
     "userProfile": {
       "age": 30,
       "height": 170,
       "weight": 65,
       "gender": "male",
       "activityLevel": "moderate",
       "healthGoals": ["lose_weight", "build_muscle"],
       "dietaryRestrictions": ["no_dairy"],
       "medicalConditions": []
     },
     "duration": 7
   }
   ```
7. Edge Function gọi AI để generate kế hoạch
8. AI trả về kế hoạch cho từng ngày:
   ```json
   {
     "mealPlan": {
       "breakfast": {...},
       "lunch": {...},
       "dinner": {...},
       "snacks": [...]
     },
     "targetCalories": 2000,
     "dailyNutrition": {
       "protein": 150,
       "carbohydrates": 200,
       "fat": 70,
       "fiber": 30
     },
     "recommendations": [...]
   }
   ```
9. Hệ thống lưu vào database:
   - Insert vào `KeHoachBuaAn`
   - Với mỗi ngày, insert vào `MonAnKeHoach`:
     - `ngaydukien`: ngày cụ thể
     - `danhmucid`: breakfast/lunch/dinner
     - `congthucid`: công thức (match hoặc tạo mới)
     - `khauphan`: khẩu phần
10. Hệ thống hiển thị kế hoạch vừa tạo
11. Chuyển đến trang chi tiết kế hoạch

**Luồng thay thế:**
- 5a. Chưa có hồ sơ sức khỏe:
  - Hiển thị thông báo yêu cầu hoàn thiện hồ sơ
  - Chuyển đến trang Profile
- 7a. AI lỗi:
  - Hiển thị lỗi
  - Đề xuất tạo thủ công

**Kết quả:**
- Kế hoạch bữa ăn 7 ngày được tạo tự động
- Các món ăn phù hợp với mục tiêu sức khỏe
- Cân đối dinh dưỡng

**Bảng liên quan:**
- `KeHoachBuaAn`
- `MonAnKeHoach`
- `CongThuc`
- `DanhMucBuaAn`
- `HoSoSucKhoe`

**Edge Function:**
- `meal-plan-generator`

---

### UC-017: Chỉnh sửa kế hoạch bữa ăn

**Actor:** User

**Mô tả:** Người dùng thay đổi các món ăn trong kế hoạch

**Điều kiện tiên quyết:**
- Đã đăng nhập
- Đã có kế hoạch bữa ăn

**Luồng chính:**
1. Người dùng truy cập chi tiết kế hoạch
2. Hệ thống hiển thị lịch với các món ăn theo ngày
3. Người dùng chọn một món ăn cụ thể
4. Người dùng có các tùy chọn:
   - a. Thay đổi công thức
   - b. Thay đổi khẩu phần
   - c. Thay đổi giờ dự kiến
   - d. Xóa món ăn
   - e. Thêm món ăn mới
5. Nếu chọn thay đổi công thức:
   - Hiển thị danh sách công thức
   - Người dùng chọn công thức mới
   - Hệ thống update `MonAnKeHoach.congthucid`
6. Nếu chọn thay đổi khẩu phần:
   - Hiển thị input số
   - Người dùng nhập khẩu phần mới
   - Hệ thống update `MonAnKeHoach.khauphan`
7. Nếu chọn thêm món mới:
   - Chọn ngày
   - Chọn danh mục bữa ăn (sáng/trưa/tối)
   - Chọn công thức
   - Insert vào `MonAnKeHoach`
8. Hệ thống tính lại tổng calories của ngày
9. Hiển thị thông báo cập nhật thành công

**Kết quả:**
- Kế hoạch được điều chỉnh theo ý muốn
- Tổng calories được tính lại

**Bảng liên quan:**
- `MonAnKeHoach`
- `CongThuc`
- `DanhMucBuaAn`

---

## NHÓM 4: THEO DÕI DINH DƯỠNG

### UC-019: Ghi nhận bữa ăn

**Actor:** User

**Mô tả:** Người dùng ghi lại thức ăn đã tiêu thụ trong ngày

**Điều kiện tiên quyết:**
- Đã đăng nhập

**Luồng chính:**
1. Người dùng truy cập trang "Nhật ký dinh dưỡng"
2. Người dùng nhấn "Thêm bữa ăn"
3. Hệ thống hiển thị form:
   - Ngày ghi nhận (mặc định: hôm nay)
   - Danh mục bữa ăn (sáng/trưa/tối/snack)
   - Tên thức phẩm
   - Công thức (nếu từ database)
   - Số lượng
   - Đơn vị
   - Thông tin dinh dưỡng (auto-fill nếu chọn công thức)
   - Ghi chú
4. Người dùng có 2 cách:
   - a. Chọn từ công thức có sẵn → auto-fill dinh dưỡng
   - b. Nhập thủ công tên và dinh dưỡng
5. Nếu chọn công thức:
   - Hệ thống tính dinh dưỡng dựa trên `CongThuc` và số lượng
   - Auto-fill: calo, protein, carb, fat
6. Người dùng submit
7. Hệ thống validate:
   - Ngày ghi nhận không quá xa trong tương lai
   - Số lượng > 0
8. Insert vào `NhatKyDinhDuong`:
   - `nguoidungid`: auth.uid()
   - `ngayghinhan`: ngày chọn
   - `danhmucid`: bữa ăn
   - `congthucid`: nếu có
   - `tenthucpham`: tên
   - `soluong`, `donvi`
   - `calo`, `dam`, `carb`, `chat`
   - `ghichu`
9. Hệ thống cập nhật tổng calories của ngày
10. Hiển thị thông báo thành công

**Luồng thay thế:**
- 4b. Quét bằng AI (UC-034):
  - Chụp ảnh thức ăn
  - AI nhận diện và điền thông tin tự động

**Kết quả:**
- Bữa ăn được ghi nhận
- Thống kê ngày được cập nhật

**Bảng liên quan:**
- `NhatKyDinhDuong`
- `CongThuc`
- `DanhMucBuaAn`

---

### UC-021: Xem thống kê dinh dưỡng

**Actor:** User

**Mô tả:** Xem biểu đồ và thống kê dinh dưỡng theo thời gian

**Điều kiện tiên quyết:**
- Đã đăng nhập
- Đã có dữ liệu nhật ký

**Luồng chính:**
1. Người dùng truy cập trang "Thống kê dinh dưỡng"
2. Hệ thống hiển thị bộ lọc:
   - Khoảng thời gian (tuần này, tháng này, custom)
   - Loại thống kê (calories, protein, carb, fat)
3. Người dùng chọn khoảng thời gian
4. Hệ thống query `NhatKyDinhDuong`:
   ```sql
   SELECT 
     ngayghinhan,
     SUM(calo) as total_calo,
     SUM(dam) as total_protein,
     SUM(carb) as total_carb,
     SUM(chat) as total_fat
   FROM NhatKyDinhDuong
   WHERE nguoidungid = auth.uid()
     AND ngayghinhan BETWEEN start_date AND end_date
   GROUP BY ngayghinhan
   ORDER BY ngayghinhan
   ```
5. Hệ thống hiển thị:
   - **Line chart**: Calories theo ngày
   - **Bar chart**: Protein/Carb/Fat theo ngày
   - **Pie chart**: Tỷ lệ macro nutrients
   - **Progress bar**: So với mục tiêu hàng ngày
   - **Summary cards**: 
     - Trung bình calories/ngày
     - Tổng calories trong kỳ
     - Ngày cao nhất/thấp nhất
6. Người dùng có thể:
   - Zoom vào biểu đồ
   - Xem chi tiết từng ngày
   - Export dữ liệu (CSV)

**Kết quả:**
- Người dùng thấy được xu hướng dinh dưỡng
- So sánh với mục tiêu
- Nhận diện ngày vượt mức

**Bảng liên quan:**
- `NhatKyDinhDuong`
- `HoSoSucKhoe` (để lấy mục tiêu)

---

## NHÓM 5: THEO DÕI CÂN NẶNG

### UC-023: Ghi nhận cân nặng

**Actor:** User

**Mô tả:** Người dùng ghi lại cân nặng định kỳ

**Điều kiện tiên quyết:**
- Đã đăng nhập

**Luồng chính:**
1. Người dùng truy cập trang "Theo dõi cân nặng"
2. Người dùng nhấn "Thêm cân nặng"
3. Hệ thống hiển thị form:
   - Ngày ghi nhận (mặc định: hôm nay)
   - Cân nặng (kg)
   - Ghi chú
4. Người dùng nhập thông tin
5. Người dùng submit
6. Hệ thống validate:
   - Cân nặng > 0 và < 500
   - Ngày không quá xa
7. Hệ thống kiểm tra duplicate:
   - Nếu đã có bản ghi cùng ngày, hỏi có update không
8. Insert vào `NhatKyCanNang`:
   - `nguoidungid`: auth.uid()
   - `ngayghinhan`: ngày chọn
   - `cannang`: cân nặng
   - `ghichu`: ghi chú
9. Hệ thống tính toán:
   - Chênh lệch với lần ghi nhận trước
   - BMI hiện tại
   - Xu hướng (tăng/giảm)
10. Cập nhật `HoSoSucKhoe.cannang` nếu là ngày gần nhất
11. Hiển thị biểu đồ cân nặng cập nhật

**Kết quả:**
- Cân nặng được ghi nhận
- Biểu đồ được cập nhật
- Hồ sơ sức khỏe được sync

**Bảng liên quan:**
- `NhatKyCanNang`
- `HoSoSucKhoe`

---

## NHÓM 6: CÔNG CỤ AI

### UC-034: Quét thực phẩm bằng hình ảnh

**Actor:** User, System (Food Scanner)

**Mô tả:** Chụp ảnh thức ăn, AI tự động nhận diện và phân tích

**Điều kiện tiên quyết:**
- Đã đăng nhập
- Có camera hoặc file ảnh

**Luồng chính:**
1. Người dùng truy cập trang "Quét thực phẩm"
2. Người dùng chọn:
   - a. Chụp ảnh từ camera
   - b. Upload ảnh có sẵn
3. Người dùng chọn ảnh
4. Hệ thống upload ảnh lên Supabase Storage
5. Hệ thống lấy public URL của ảnh
6. Hệ thống chọn loại phân tích:
   - `nutrition`: Chỉ dinh dưỡng
   - `ingredients`: Chỉ nguyên liệu
   - `calories`: Chỉ calories
   - `all`: Đầy đủ (mặc định)
7. Gọi Edge Function `food-scanner`:
   ```json
   {
     "imageUrl": "https://...",
     "analysisType": "all"
   }
   ```
8. Edge Function gọi Lovable AI Gateway với image
9. AI phân tích và trả về:
   ```json
   {
     "nhanDien": {
       "tenMon": "Phở bò",
       "loaiThucPham": "Món nước",
       "doTinCay": 0.95,
       "moTa": "Một tô phở bò Hà Nội truyền thống"
     },
     "dinhDuong": {
       "caloUocTinh": 450,
       "protein": 25,
       "carb": 60,
       "fat": 10,
       "chatXo": 3,
       "donVi": "1 tô (500g)"
     },
     "nguyenLieu": [
       { "ten": "Bánh phở", "tyLe": 40, "moTa": "..." },
       { "ten": "Thit bò", "tyLe": 20, "moTa": "..." }
     ],
     "danhGia": {
       "diemDinhDuong": 75,
       "mucDoLanhManh": "Trung bình",
       "phuHop": ["Tăng cơ", "Phục hồi"],
       "canhBao": ["Nhiều natri"],
       "goiY": ["Thêm rau", "Giảm nước dùng"]
     }
   }
   ```
10. Hệ thống hiển thị kết quả:
    - Tên món ăn nhận diện
    - Bảng dinh dưỡng
    - Danh sách nguyên liệu
    - Đánh giá sức khỏe
    - Điểm dinh dưỡng
    - Lời khuyên
11. Người dùng có thể:
    - Lưu vào nhật ký dinh dưỡng (UC-019)
    - Chỉnh sửa thông tin trước khi lưu
    - Scan ảnh khác

**Luồng thay thế:**
- 9a. AI không nhận diện được:
  - Trả về kết quả "Không xác định"
  - Cho phép nhập thủ công
- 9b. Độ tin cậy thấp (<0.5):
  - Hiển thị cảnh báo "Kết quả có thể không chính xác"
  - Đề xuất chụp lại hoặc nhập thủ công

**Kết quả:**
- Thực phẩm được nhận diện
- Thông tin dinh dưỡng được ước tính
- Có thể lưu vào nhật ký

**Edge Function:**
- `food-scanner`

**API:**
- Lovable AI Gateway

---

### UC-035: Trò chuyện với AI Chatbot dinh dưỡng

**Actor:** User, System (Nutrition Chatbot)

**Mô tả:** Hỏi đáp tự do về dinh dưỡng với AI

**Điều kiện tiên quyết:**
- Đã đăng nhập

**Luồng chính:**
1. Người dùng nhấn icon chatbot (góc dưới phải)
2. Chatbot popup hiển thị
3. Hệ thống load lịch sử chat (nếu có)
4. Người dùng nhập câu hỏi, ví dụ:
   - "Tôi nên ăn gì để giảm cân?"
   - "Cà chua có tốt cho tim không?"
   - "Cách tính lượng protein cần thiết?"
5. Hệ thống gọi Edge Function `nutrition-chatbot` với:
   ```json
   {
     "messages": [
       { "role": "user", "content": "Tôi nên ăn gì để giảm cân?" }
     ]
   }
   ```
6. Edge Function:
   - Load system prompt (chuyên gia dinh dưỡng)
   - Gọi Lovable AI Gateway
   - Stream response về client
7. Chatbot hiển thị câu trả lời từng phần (streaming)
8. Người dùng có thể:
   - Hỏi tiếp (multi-turn conversation)
   - Copy câu trả lời
   - Xóa lịch sử chat
   - Đóng chatbot

**System Prompt:**
```
Bạn là chuyên gia dinh dưỡng chuyên nghiệp, tư vấn bằng tiếng Việt.
- Cung cấp thông tin khoa học, chính xác
- Phù hợp với người Việt Nam
- Không thay thế bác sĩ
- Khuyến khích ăn uống lành mạnh
```

**Kết quả:**
- Người dùng nhận được tư vấn dinh dưỡng
- Lịch sử chat được lưu (session)

**Edge Function:**
- `nutrition-chatbot`

---

## NHÓM 7: QUẢN TRỊ HỆ THỐNG

### UC-042: Quản lý người dùng

**Actor:** Admin

**Mô tả:** Admin xem và quản lý tất cả người dùng

**Điều kiện tiên quyết:**
- Đã đăng nhập
- Có vai trò `admin`

**Luồng chính:**
1. Admin truy cập trang "Quản lý người dùng"
2. Hệ thống kiểm tra quyền admin trong `VaiTroNguoiDung`
3. Nếu không phải admin, redirect về dashboard
4. Hệ thống query danh sách người dùng:
   ```sql
   SELECT 
     u.id, u.email, u.created_at,
     p.hoten, p.sodienthoai,
     r.vaitro,
     s.trangthai as subscription_status
   FROM auth.users u
   LEFT JOIN HoSo p ON u.id = p.nguoidungid
   LEFT JOIN VaiTroNguoiDung r ON u.id = r.nguoidungid
   LEFT JOIN GoiDangKyNguoiDung s ON u.id = s.nguoidungid
   ORDER BY u.created_at DESC
   ```
5. Hệ thống hiển thị bảng với:
   - Email
   - Họ tên
   - Vai trò
   - Trạng thái đăng ký
   - Ngày tạo
   - Actions: Edit, Delete, Reset Password
6. Admin có thể:
   - **Tìm kiếm** theo email/tên
   - **Lọc** theo vai trò, trạng thái
   - **Sắp xếp** theo ngày tạo, email
   - **Phân trang** (20 users/page)
7. Admin chọn action cho user cụ thể:
   - Edit → Chuyển sang UC-043 (thay đổi vai trò)
   - Delete → Xác nhận và xóa user
   - Reset Password → UC-044

**Kết quả:**
- Admin thấy toàn bộ người dùng
- Có thể quản lý từng user

**Bảng liên quan:**
- `auth.users`
- `HoSo`
- `VaiTroNguoiDung`
- `GoiDangKyNguoiDung`

---

### UC-043: Quản lý vai trò người dùng

**Actor:** Admin

**Mô tả:** Admin thay đổi vai trò user/admin

**Điều kiện tiên quyết:**
- Đã đăng nhập với vai trò admin
- Đang ở trang quản lý người dùng

**Luồng chính:**
1. Admin nhấn nút "Edit" ở hàng của user
2. Hệ thống hiển thị dialog:
   - Tên user
   - Email
   - Vai trò hiện tại
   - Dropdown chọn vai trò mới (user/admin)
3. Admin chọn vai trò mới
4. Admin nhấn "Cập nhật"
5. Hệ thống update `VaiTroNguoiDung`:
   ```sql
   UPDATE VaiTroNguoiDung
   SET vaitro = 'admin' -- hoặc 'user'
   WHERE nguoidungid = selected_user_id
   ```
6. Hệ thống ghi log thay đổi (nếu có audit table)
7. Hiển thị toast "Cập nhật vai trò thành công"
8. Refresh bảng người dùng

**Luồng thay thế:**
- 5a. Không tìm thấy bản ghi vai trò:
  - Insert bản ghi mới vào `VaiTroNguoiDung`

**Kết quả:**
- Vai trò người dùng được thay đổi
- User có quyền mới ngay lập tức

**Bảng liên quan:**
- `VaiTroNguoiDung`

---

### UC-045: Quản lý nguyên liệu

**Actor:** Admin

**Mô tả:** Admin thêm/sửa/xóa nguyên liệu trong database

**Điều kiện tiên quyết:**
- Đã đăng nhập với vai trò admin

**Luồng chính:**
1. Admin truy cập trang "Quản lý nguyên liệu"
2. Hệ thống hiển thị bảng tất cả nguyên liệu từ `NguyenLieu`:
   - Tên
   - Calo/100g
   - Protein/100g
   - Carb/100g
   - Fat/100g
   - Fiber/100g
   - Sugar/100g
   - Sodium/100g
   - Actions
3. Admin có thể:
   - **Thêm mới**: Nhấn "Thêm nguyên liệu"
     - Hiển thị form
     - Nhập đầy đủ thông tin dinh dưỡng
     - Submit → Insert vào `NguyenLieu`
   - **Chỉnh sửa**: Nhấn "Edit"
     - Load thông tin hiện tại
     - Cập nhật → Update `NguyenLieu`
   - **Xóa**: Nhấn "Delete"
     - Kiểm tra có công thức nào dùng không
     - Nếu có, cảnh báo
     - Xác nhận → Delete
4. Hệ thống validate:
   - Tên không trống
   - Các giá trị dinh dưỡng >= 0
5. Sau mỗi thao tác, hiển thị toast và refresh bảng

**Lưu ý:**
- Xóa nguyên liệu sẽ ảnh hưởng đến các công thức có sử dụng
- Nên có cảnh báo rõ ràng

**Kết quả:**
- Database nguyên liệu được cập nhật
- User có thể dùng nguyên liệu mới khi tạo công thức

**Bảng liên quan:**
- `NguyenLieu`
- `NguyenLieuCongThuc` (check before delete)

---

### UC-048: Xem báo cáo thống kê hệ thống

**Actor:** Admin

**Mô tả:** Admin xem các số liệu tổng quan của hệ thống

**Điều kiện tiên quyết:**
- Đã đăng nhập với vai trò admin

**Luồng chính:**
1. Admin truy cập trang "Báo cáo"
2. Hệ thống gọi Edge Function `admin-analytics` (nếu có) hoặc query trực tiếp
3. Hệ thống tính toán và hiển thị:
   
   **Tổng quan:**
   - Tổng số người dùng
   - Người dùng mới (7 ngày, 30 ngày)
   - Tổng công thức
   - Công thức công khai
   - Tổng kế hoạch bữa ăn
   - Tổng nhật ký dinh dưỡng
   
   **Biểu đồ:**
   - Line chart: Người dùng mới theo thời gian
   - Bar chart: Công thức tạo mới theo tháng
   - Pie chart: Tỷ lệ user/admin
   - Table: Top users có nhiều công thức nhất
   
   **Gói đăng ký:**
   - Số lượng từng loại gói
   - Doanh thu (nếu có tích hợp payment)
   - Tỷ lệ chuyển đổi free → premium

4. Admin có thể:
   - Chọn khoảng thời gian (tuần/tháng/năm)
   - Export báo cáo (PDF/CSV)
   - Drill down vào từng metric

**Queries mẫu:**
```sql
-- Tổng người dùng
SELECT COUNT(*) FROM auth.users;

-- Người dùng mới 7 ngày
SELECT COUNT(*) FROM auth.users 
WHERE created_at > now() - interval '7 days';

-- Tổng công thức
SELECT COUNT(*) FROM CongThuc;

-- Top creators
SELECT 
  p.hoten,
  COUNT(c.id) as recipe_count
FROM CongThuc c
JOIN HoSo p ON c.nguoitao = p.nguoidungid
GROUP BY p.hoten
ORDER BY recipe_count DESC
LIMIT 10;
```

**Kết quả:**
- Admin có cái nhìn tổng quan về hệ thống
- Ra quyết định dựa trên dữ liệu

**Edge Function:**
- `admin-analytics` (optional)

**Bảng liên quan:**
- Tất cả các bảng

---

## PHỤ LỤC: EDGE FUNCTIONS DETAILS

### 1. nutrition-advisor
- **Input**: User profile, câu hỏi
- **Output**: Lời khuyên dinh dưỡng
- **API**: Lovable AI Gateway
- **Model**: GPT-4

### 2. meal-plan-generator
- **Input**: User profile, số ngày
- **Output**: Kế hoạch bữa ăn hoàn chỉnh
- **API**: OpenAI hoặc Lovable AI
- **Logic**: Generate meals phù hợp BMR, macro goals

### 3. recipe-analyzer
- **Input**: Recipe text, ingredients, image
- **Output**: Phân tích dinh dưỡng, health score
- **API**: OpenAI
- **Database**: Query `NguyenLieu` để có context

### 4. food-scanner
- **Input**: Image URL, analysis type
- **Output**: Nhận diện món ăn, dinh dưỡng
- **API**: Lovable AI Gateway (Vision)
- **Đặc biệt**: Hiểu món Việt Nam

### 5. nutrition-chatbot
- **Input**: Messages history
- **Output**: Streaming responses
- **API**: Lovable AI Gateway
- **Streaming**: True

### 6. admin-analytics (tùy chọn)
- **Input**: Date range, filters
- **Output**: Aggregated statistics
- **Logic**: Complex queries, caching

---

## KẾT LUẬN

Hệ thống ThucdonAI bao gồm **49 use cases** chính, được thiết kế để:

1. **Người dùng thông thường**: Quản lý dinh dưỡng, kế hoạch bữa ăn, theo dõi sức khỏe
2. **Admin**: Quản trị hệ thống, người dùng, dữ liệu
3. **AI System**: Hỗ trợ tư vấn, phân tích, tạo kế hoạch tự động

Tất cả các use case đều tuân thủ:
- Row Level Security (RLS)
- Authentication & Authorization
- Data validation
- Error handling
- Toast notifications
- Responsive design

Database được thiết kế cẩn thận với foreign keys, cascading deletes, và triggers tự động.
