# USE CASE TỔNG QUÁT - HỆ THỐNG THUCDONAI

## 1. TỔNG QUAN HỆ THỐNG
ThucdonAI là hệ thống quản lý dinh dưỡng và kế hoạch bữa ăn thông minh, tích hợp AI để hỗ trợ người dùng theo dõi sức khỏe, lập kế hoạch dinh dưỡng và quản lý công thức nấu ăn.

---

## 2. CÁC ACTOR (VAI TRÒ)

### 2.1 Guest (Khách)
- Người dùng chưa đăng nhập
- Có thể xem landing page, giá cả, thông tin về hệ thống

### 2.2 User (Người dùng)
- Người dùng đã đăng ký và đăng nhập
- Có thể sử dụng đầy đủ các tính năng cơ bản

### 2.3 Admin (Quản trị viên)
- Quản lý hệ thống
- Quản lý người dùng, nguyên liệu, danh mục bữa ăn

### 2.4 System (Hệ thống)
- AI Advisor: Tư vấn dinh dưỡng
- Meal Plan Generator: Tạo kế hoạch bữa ăn tự động
- Food Scanner: Phân tích thực phẩm từ hình ảnh
- Recipe Analyzer: Phân tích giá trị dinh dưỡng công thức

---

## 3. NHÓM CHỨC NĂNG CHÍNH

### 3.1 QUẢN LÝ TÀI KHOẢN VÀ HỒ SƠ
**UC-001: Đăng ký tài khoản**
- Actor: Guest
- Mô tả: Người dùng mới tạo tài khoản trong hệ thống

**UC-002: Đăng nhập**
- Actor: Guest
- Mô tả: Người dùng đăng nhập vào hệ thống

**UC-003: Đăng xuất**
- Actor: User, Admin
- Mô tả: Người dùng đăng xuất khỏi hệ thống

**UC-004: Quản lý hồ sơ cá nhân**
- Actor: User
- Mô tả: Cập nhật thông tin cá nhân (tên, ngày sinh, email, ảnh đại diện)

**UC-005: Quản lý hồ sơ sức khỏe**
- Actor: User
- Mô tả: Cập nhật thông tin sức khỏe (chiều cao, cân nặng, mục tiêu, hạn chế chế độ ăn, dị ứng)

**UC-006: Reset mật khẩu**
- Actor: User, Admin
- Mô tả: Người dùng quên mật khẩu và yêu cầu reset

---

### 3.2 QUẢN LÝ CÔNG THỨC NẤU ĂN

**UC-007: Xem danh sách công thức công khai**
- Actor: User
- Mô tả: Xem tất cả công thức nấu ăn được chia sẻ công khai

**UC-008: Xem chi tiết công thức**
- Actor: User
- Mô tả: Xem chi tiết một công thức bao gồm nguyên liệu, hướng dẫn, dinh dưỡng

**UC-009: Tạo công thức mới**
- Actor: User
- Mô tả: Tạo công thức nấu ăn mới với nguyên liệu và hướng dẫn

**UC-010: Chỉnh sửa công thức**
- Actor: User (chủ sở hữu)
- Mô tả: Cập nhật thông tin công thức của mình

**UC-011: Xóa công thức**
- Actor: User (chủ sở hữu)
- Mô tả: Xóa công thức của mình

**UC-012: Phân tích công thức bằng AI**
- Actor: User, System (Recipe Analyzer)
- Mô tả: Phân tích giá trị dinh dưỡng, lợi ích, cảnh báo của công thức

---

### 3.3 QUẢN LÝ KẾ HOẠCH BỮA ĂN

**UC-013: Xem danh sách kế hoạch bữa ăn**
- Actor: User
- Mô tả: Xem tất cả kế hoạch bữa ăn của mình

**UC-014: Tạo kế hoạch bữa ăn thủ công**
- Actor: User
- Mô tả: Tạo kế hoạch bữa ăn mới với các món ăn tự chọn

**UC-015: Tạo kế hoạch bữa ăn tự động bằng AI**
- Actor: User, System (Meal Plan Generator)
- Mô tả: Hệ thống AI tự động tạo kế hoạch bữa ăn dựa trên hồ sơ sức khỏe

**UC-016: Xem chi tiết kế hoạch bữa ăn**
- Actor: User
- Mô tả: Xem chi tiết kế hoạch theo ngày, bữa ăn

**UC-017: Chỉnh sửa kế hoạch bữa ăn**
- Actor: User
- Mô tả: Thêm/xóa/sửa món ăn trong kế hoạch

**UC-018: Xóa kế hoạch bữa ăn**
- Actor: User
- Mô tả: Xóa kế hoạch không còn sử dụng

---

### 3.4 THEO DÕI DINH DƯỠNG

**UC-019: Ghi nhận bữa ăn**
- Actor: User
- Mô tả: Ghi lại thức ăn đã tiêu thụ trong ngày

**UC-020: Xem lịch sử dinh dưỡng**
- Actor: User
- Mô tả: Xem lại các bữa ăn đã ghi nhận theo ngày/tuần/tháng

**UC-021: Xem thống kê dinh dưỡng**
- Actor: User
- Mô tả: Xem biểu đồ, thống kê calories, protein, carb, fat

**UC-022: Chỉnh sửa nhật ký dinh dưỡng**
- Actor: User
- Mô tả: Cập nhật hoặc xóa bữa ăn đã ghi nhận

---

### 3.5 THEO DÕI CÂN NẶNG

**UC-023: Ghi nhận cân nặng**
- Actor: User
- Mô tả: Ghi lại cân nặng hiện tại

**UC-024: Xem lịch sử cân nặng**
- Actor: User
- Mô tả: Xem biểu đồ thay đổi cân nặng theo thời gian

**UC-025: Chỉnh sửa nhật ký cân nặng**
- Actor: User
- Mô tả: Cập nhật hoặc xóa bản ghi cân nặng

---

### 3.6 THEO DÕI UỐNG NƯỚC

**UC-026: Ghi nhận lượng nước**
- Actor: User
- Mô tả: Ghi lại lượng nước đã uống

**UC-027: Xem lịch sử uống nước**
- Actor: User
- Mô tả: Xem thống kê lượng nước uống theo ngày

**UC-028: Xóa nhật ký nước**
- Actor: User
- Mô tả: Xóa bản ghi nước không chính xác

---

### 3.7 QUẢN LÝ DANH SÁCH MUA SẮM

**UC-029: Tạo danh sách mua sắm**
- Actor: User
- Mô tả: Tạo danh sách mua sắm mới

**UC-030: Thêm món vào danh sách**
- Actor: User
- Mô tả: Thêm nguyên liệu cần mua

**UC-031: Đánh dấu đã mua**
- Actor: User
- Mô tả: Đánh dấu món đã mua xong

**UC-032: Xóa món khỏi danh sách**
- Actor: User
- Mô tả: Xóa món không cần mua nữa

**UC-033: Xóa danh sách mua sắm**
- Actor: User
- Mô tả: Xóa toàn bộ danh sách

---

### 3.8 CÔNG CỤ AI & PHỤ TRỢ

**UC-034: Quét thực phẩm bằng hình ảnh**
- Actor: User, System (Food Scanner)
- Mô tả: Chụp ảnh thực phẩm để nhận diện và phân tích dinh dưỡng

**UC-035: Trò chuyện với AI Chatbot dinh dưỡng**
- Actor: User, System (Nutrition Chatbot)
- Mô tả: Hỏi đáp về dinh dưỡng với AI

**UC-036: Nhận tư vấn dinh dưỡng**
- Actor: User, System (Nutrition Advisor)
- Mô tả: Nhận tư vấn cá nhân hóa dựa trên hồ sơ sức khỏe

**UC-037: Tính toán BMI**
- Actor: User
- Mô tả: Tính chỉ số BMI dựa trên chiều cao và cân nặng

---

### 3.9 QUẢN LÝ GÓI ĐĂNG KÝ

**UC-038: Xem các gói đăng ký**
- Actor: User
- Mô tả: Xem thông tin các gói dịch vụ

**UC-039: Đăng ký gói dịch vụ**
- Actor: User
- Mô tả: Chọn và đăng ký gói premium

**UC-040: Xem thông tin đăng ký hiện tại**
- Actor: User
- Mô tả: Xem gói đang sử dụng, ngày hết hạn

**UC-041: Hủy đăng ký**
- Actor: User
- Mô tả: Hủy gói dịch vụ đang sử dụng

---

### 3.10 QUẢN TRỊ HỆ THỐNG (ADMIN)

**UC-042: Quản lý người dùng**
- Actor: Admin
- Mô tả: Xem, chỉnh sửa, xóa tài khoản người dùng

**UC-043: Quản lý vai trò người dùng**
- Actor: Admin
- Mô tả: Gán hoặc thay đổi vai trò (user/admin)

**UC-044: Reset mật khẩu người dùng**
- Actor: Admin
- Mô tả: Reset mật khẩu cho người dùng quên

**UC-045: Quản lý nguyên liệu**
- Actor: Admin
- Mô tả: Thêm, sửa, xóa nguyên liệu trong database

**UC-046: Quản lý danh mục bữa ăn**
- Actor: Admin
- Mô tả: Thêm, sửa, xóa danh mục (sáng, trưa, tối, snack)

**UC-047: Quản lý công thức (Admin)**
- Actor: Admin
- Mô tả: Xem, chỉnh sửa, xóa bất kỳ công thức nào

**UC-048: Xem báo cáo thống kê hệ thống**
- Actor: Admin
- Mô tả: Xem số liệu người dùng, công thức, kế hoạch bữa ăn

**UC-049: Xem phân tích analytics**
- Actor: Admin
- Mô tả: Xem biểu đồ hoạt động của hệ thống

---

## 4. SƠ ĐỒ QUAN HỆ USE CASE

```
GUEST
  ├── UC-001: Đăng ký tài khoản
  └── UC-002: Đăng nhập

USER
  ├── Hồ sơ
  │   ├── UC-003: Đăng xuất
  │   ├── UC-004: Quản lý hồ sơ cá nhân
  │   ├── UC-005: Quản lý hồ sơ sức khỏe
  │   └── UC-006: Reset mật khẩu
  │
  ├── Công thức
  │   ├── UC-007: Xem danh sách công thức công khai
  │   ├── UC-008: Xem chi tiết công thức
  │   ├── UC-009: Tạo công thức mới
  │   ├── UC-010: Chỉnh sửa công thức
  │   ├── UC-011: Xóa công thức
  │   └── UC-012: Phân tích công thức bằng AI
  │
  ├── Kế hoạch bữa ăn
  │   ├── UC-013: Xem danh sách kế hoạch
  │   ├── UC-014: Tạo kế hoạch thủ công
  │   ├── UC-015: Tạo kế hoạch tự động (AI)
  │   ├── UC-016: Xem chi tiết kế hoạch
  │   ├── UC-017: Chỉnh sửa kế hoạch
  │   └── UC-018: Xóa kế hoạch
  │
  ├── Theo dõi
  │   ├── UC-019: Ghi nhận bữa ăn
  │   ├── UC-020: Xem lịch sử dinh dưỡng
  │   ├── UC-021: Xem thống kê dinh dưỡng
  │   ├── UC-022: Chỉnh sửa nhật ký dinh dưỡng
  │   ├── UC-023: Ghi nhận cân nặng
  │   ├── UC-024: Xem lịch sử cân nặng
  │   ├── UC-025: Chỉnh sửa nhật ký cân nặng
  │   ├── UC-026: Ghi nhận lượng nước
  │   ├── UC-027: Xem lịch sử uống nước
  │   └── UC-028: Xóa nhật ký nước
  │
  ├── Mua sắm
  │   ├── UC-029: Tạo danh sách mua sắm
  │   ├── UC-030: Thêm món vào danh sách
  │   ├── UC-031: Đánh dấu đã mua
  │   ├── UC-032: Xóa món khỏi danh sách
  │   └── UC-033: Xóa danh sách mua sắm
  │
  ├── AI Tools
  │   ├── UC-034: Quét thực phẩm bằng hình ảnh
  │   ├── UC-035: Trò chuyện với AI Chatbot
  │   ├── UC-036: Nhận tư vấn dinh dưỡng
  │   └── UC-037: Tính toán BMI
  │
  └── Đăng ký
      ├── UC-038: Xem các gói đăng ký
      ├── UC-039: Đăng ký gói dịch vụ
      ├── UC-040: Xem thông tin đăng ký
      └── UC-041: Hủy đăng ký

ADMIN
  ├── UC-042: Quản lý người dùng
  ├── UC-043: Quản lý vai trò người dùng
  ├── UC-044: Reset mật khẩu người dùng
  ├── UC-045: Quản lý nguyên liệu
  ├── UC-046: Quản lý danh mục bữa ăn
  ├── UC-047: Quản lý công thức
  ├── UC-048: Xem báo cáo thống kê
  └── UC-049: Xem phân tích analytics
```

---

## 5. PHÂN LOẠI THEO ĐỘ ƯU TIÊN

### Critical (Quan trọng nhất)
- UC-001, UC-002, UC-003: Đăng ký, đăng nhập, đăng xuất
- UC-004, UC-005: Quản lý hồ sơ
- UC-019: Ghi nhận bữa ăn
- UC-023: Ghi nhận cân nặng

### High (Quan trọng)
- UC-007, UC-008, UC-009: Xem và tạo công thức
- UC-013, UC-014, UC-015: Quản lý kế hoạch bữa ăn
- UC-020, UC-021: Xem lịch sử và thống kê dinh dưỡng

### Medium (Trung bình)
- UC-029 - UC-033: Quản lý danh sách mua sắm
- UC-034 - UC-037: Công cụ AI
- UC-038 - UC-041: Quản lý gói đăng ký

### Low (Thấp)
- UC-042 - UC-049: Chức năng admin

---

## 6. TÍCH HỢP HỆ THỐNG NGOÀI

### 6.1 Supabase
- Authentication
- Database (PostgreSQL)
- Storage (cho hình ảnh)
- Edge Functions

### 6.2 AI Services
- OpenAI API (cho AI Advisor, Recipe Analyzer)
- Lovable AI Gateway (cho Food Scanner, Nutrition Chatbot)

### 6.3 Payment (Tương lai)
- Stripe (cho subscription)

---

## 7. YÊU CẦU PHI CHỨC NĂNG

### 7.1 Bảo mật
- RLS (Row Level Security) trên tất cả các bảng
- Chỉ user được xem/sửa dữ liệu của mình
- Admin có quyền cao hơn nhưng vẫn có giới hạn

### 7.2 Hiệu năng
- Lazy loading cho danh sách dài
- Caching cho dữ liệu tĩnh (nguyên liệu, danh mục)

### 7.3 Khả năng mở rộng
- Thiết kế database có thể scale
- Edge Functions tự động scale

### 7.4 Trải nghiệm người dùng
- Responsive design
- Real-time updates
- Toast notifications
- Loading states
