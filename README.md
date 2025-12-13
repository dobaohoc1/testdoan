# 🍽️ ThucdonAI - Hệ Thống Quản Lý Dinh Dưỡng Thông Minh

## 📖 Giới Thiệu

**ThucdonAI** là ứng dụng web quản lý dinh dưỡng và sức khỏe cá nhân hóa, tích hợp công nghệ AI để hỗ trợ người dùng:
- 🎯 Lập kế hoạch bữa ăn cá nhân hóa
- 📊 Theo dõi dinh dưỡng hàng ngày
- 🍳 Quản lý công thức nấu ăn
- ⚖️ Theo dõi cân nặng và tiến độ
- 💧 Theo dõi lượng nước uống
- 🛒 Quản lý danh sách mua sắm thông minh
- 📸 Quét và phân tích thực phẩm bằng AI

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling Framework
- **Shadcn/UI** - Component Library
- **React Query (TanStack Query)** - Data Fetching & State Management
- **React Router DOM** - Routing
- **React Hook Form + Zod** - Form Validation

### Backend & Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - Relational Database
- **Supabase Auth** - Authentication System
- **Supabase Storage** - File Storage
- **Row Level Security (RLS)** - Data Security

### AI Integration
- **OpenAI API** - AI Advisor & Recipe Analyzer
- **Vision API** - Food Scanner & Image Recognition
- **Natural Language Processing** - Chatbot

---

## 📁 Cấu Trúc Dự Án

```
an-ai-menu-mate-main/
├── src/
│   ├── components/        # React Components
│   │   ├── admin/        # Admin Components
│   │   └── ui/           # UI Components (Shadcn)
│   ├── pages/            # Page Components
│   ├── hooks/            # Custom React Hooks
│   ├── integrations/     # Third-party Integrations
│   │   └── supabase/    # Supabase Client & Types
│   ├── lib/             # Utility Functions
│   └── data/            # Static Data
├── supabase/            # Supabase Schema & Migrations
├── public/              # Static Assets
└── docs/                # Documentation Files
    ├── DATABASE_SCHEMA.md
    ├── USECASE_OVERVIEW.md
    └── ...
```

---

## 🚀 Cài Đặt và Chạy Dự Án

### Yêu Cầu Hệ Thống
- Node.js >= 18.x
- npm >= 9.x

### Bước 1: Clone Repository
```bash
git clone <repository-url>
cd an-ai-menu-mate-main
```

### Bước 2: Cài Đặt Dependencies
```bash
npm install
```

### Bước 3: Cấu Hình Environment Variables
Tạo file `.env` trong thư mục gốc:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### Bước 4: Chạy Development Server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### Bước 5: Build Production
```bash
npm run build
npm run preview
```

---

## 📊 Database Schema

Hệ thống sử dụng **16 bảng** được tổ chức thành 6 module chính:

### 1. Module Người Dùng
- `HoSo` - Thông tin cá nhân
- `HoSoSucKhoe` - Thông tin sức khỏe
- `VaiTroNguoiDung` - Phân quyền

### 2. Module Công Thức
- `CongThuc` - Công thức nấu ăn
- `NguyenLieu` - Danh mục nguyên liệu
- `NguyenLieuCongThuc` - Liên kết nguyên liệu

### 3. Module Kế Hoạch Bữa Ăn
- `KeHoachBuaAn` - Kế hoạch dinh dưỡng
- `MonAnKeHoach` - Món ăn trong kế hoạch
- `DanhMucBuaAn` - Danh mục bữa ăn

### 4. Module Theo Dõi
- `NhatKyDinhDuong` - Nhật ký dinh dưỡng
- `NhatKyCanNang` - Nhật ký cân nặng
- `NhatKyNuoc` - Nhật ký nước uống

### 5. Module Mua Sắm
- `DanhSachMuaSam` - Danh sách mua sắm
- `MonMuaSam` - Món trong danh sách

### 6. Module Gói Đăng Ký
- `GoiDangKy` - Gói dịch vụ
- `GoiDangKyNguoiDung` - Đăng ký người dùng

**Chi tiết schema:** Xem [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

---

## ✨ Tính Năng Chính

### Cho Người Dùng
- ✅ Đăng ký/Đăng nhập với Supabase Auth
- ✅ Quản lý hồ sơ cá nhân và sức khỏe
- ✅ Tạo và quản lý công thức nấu ăn
- ✅ Lập kế hoạch bữa ăn tự động/thủ công
- ✅ Theo dõi dinh dưỡng với biểu đồ chi tiết
- ✅ Theo dõi cân nặng và tiến độ
- ✅ Theo dõi lượng nước uống hàng ngày
- ✅ Quét thực phẩm bằng AI
- ✅ Chat với AI Nutrition Advisor
- ✅ Tính toán BMI và chỉ số sức khỏe
- ✅ Quản lý danh sách mua sắm thông minh

### Cho Quản Trị Viên
- ✅ Dashboard quản lý hệ thống
- ✅ Quản lý người dùng và phân quyền
- ✅ Quản lý nguyên liệu và danh mục
- ✅ Xem thống kê và analytics
- ✅ Reset mật khẩu người dùng

---

## 🔐 Bảo Mật

- **Row Level Security (RLS)** - Mỗi user chỉ truy cập dữ liệu của mình
- **Foreign Key Constraints** - Đảm bảo tính toàn vẹn dữ liệu
- **Cascade Deletes** - Tự động xóa dữ liệu liên quan
- **Secure Authentication** - Supabase Auth với JWT
- **Environment Variables** - Bảo mật API keys

---

## 📈 Performance Optimization

- **React Query Caching** - Giảm số lượng API calls
- **Lazy Loading** - Load components khi cần
- **Database Indexes** - 18+ indexes tối ưu query
- **Image Optimization** - Compression và lazy loading
- **Code Splitting** - Vite automatic code splitting

---

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run type checking
npx tsc --noEmit
```

---

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build with development mode
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 📚 Tài Liệu

Xem thêm tài liệu chi tiết trong thư mục gốc:
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Chi tiết schema database
- [USECASE_OVERVIEW.md](./USECASE_OVERVIEW.md) - Tổng quan 49 use cases
- [USECASE_DETAILED.md](./USECASE_DETAILED.md) - Chi tiết từng use case
- [SEQUENCE_DIAGRAMS.md](./SEQUENCE_DIAGRAMS.md) - Sequence diagrams
- [ACTIVITY_DIAGRAMS.md](./ACTIVITY_DIAGRAMS.md) - Activity diagrams
- [CLASS_DIAGRAM.md](./CLASS_DIAGRAM.md) - Class diagram
- [ERD_DRAWING_GUIDE.md](./ERD_DRAWING_GUIDE.md) - ERD guide

---

## 🤝 Đóng Góp

Dự án này là đồ án tốt nghiệp. Mọi đóng góp, báo lỗi hoặc đề xuất đều được hoan nghênh!

---

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

---

## 👥 Tác Giả

**[Tên của bạn]** - [Email/GitHub]

Đồ Án Tốt Nghiệp - [Tên Trường] - 2025

---

## 🙏 Lời Cảm Ơn

- **Supabase** - Backend as a Service platform
- **OpenAI** - AI API for nutrition analysis
- **Shadcn/UI** - Beautiful component library
- **Vercel** - Deployment platform
- Và tất cả các thư viện open-source được sử dụng trong dự án

---

**⭐ Nếu bạn thấy dự án này hữu ích, hãy cho một star nhé!**
