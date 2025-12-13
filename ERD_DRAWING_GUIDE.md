# 📐 Hướng dẫn vẽ ERD - Nutrition AI App

## 🎯 Mục đích
Tài liệu này cung cấp đầy đủ thông tin để vẽ Entity Relationship Diagram (ERD) cho hệ thống Nutrition AI.

---

## 📋 Danh sách tất cả các bảng (Entities)

### 1️⃣ **User Management Module** (Module Quản lý Người dùng)

#### **HoSo** (Profiles)
| Tên cột | Kiểu dữ liệu | PK | FK | Nullable | Default | Mô tả |
|---------|--------------|----|----|----------|---------|-------|
| id | uuid | ✅ | | No | gen_random_uuid() | Primary Key |
| nguoidungid | uuid | | ➡️ auth.users.id | No | | User ID |
| hoten | text | | | Yes | | Họ tên |
| email | text | | | Yes | | Email |
| anhdaidien | text | | | Yes | | Avatar URL |
| sodienthoai | text | | | Yes | | Số điện thoại |
| gioitinh | text | | | Yes | | Giới tính |
| ngaysinh | date | | | Yes | | Ngày sinh |
| taoluc | timestamptz | | | No | now() | Created at |
| capnhatluc | timestamptz | | | No | now() | Updated at |

**Unique Constraints:**
- `nguoidungid` (UNIQUE) - Đảm bảo 1 user chỉ có 1 profile

---

#### **HoSoSucKhoe** (Health Profiles)
| Tên cột | Kiểu dữ liệu | PK | FK | Nullable | Default | Mô tả |
|---------|--------------|----|----|----------|---------|-------|
| id | uuid | ✅ | | No | gen_random_uuid() | Primary Key |
| nguoidungid | uuid | | ➡️ auth.users.id | No | | User ID |
| chieucao | numeric | | | Yes | | Chiều cao (cm) |
| cannang | numeric | | | Yes | | Cân nặng (kg) |
| muctieucalohangngay | integer | | | Yes | | Daily calorie goal |
| mucdohoatdong | text | | | Yes | | Activity level |
| tinhtrangsuckhoe | text[] | | | Yes | {} | Health conditions |
| muctieusuckhoe | text[] | | | Yes | {} | Health goals |
| hanchechedo | text[] | | | Yes | {} | Diet restrictions |
| diung | text[] | | | Yes | {} | Allergies |
| taoluc | timestamptz | | | No | now() | Created at |
| capnhatluc | timestamptz | | | No | now() | Updated at |

**Unique Constraints:**
- `nguoidungid` (UNIQUE) - Đảm bảo 1 user chỉ có 1 health profile

---

#### **VaiTroNguoiDung** (User Roles)
| Tên cột | Kiểu dữ liệu | PK | FK | Nullable | Default | Mô tả |
|---------|--------------|----|----|----------|---------|-------|
| id | uuid | ✅ | | No | gen_random_uuid() | Primary Key |
| nguoidungid | uuid | | ➡️ auth.users.id | No | | User ID |
| vaitro | app_role | | | No | 'user' | Role (admin/user) |
| taoluc | timestamptz | | | No | now() | Created at |

**Unique Constraints:**
- `nguoidungid` (UNIQUE) - Đảm bảo 1 user chỉ có 1 role record

**Enum Type:**
```sql
app_role: 'admin' | 'user'
```

---

### 2️⃣ **Recipe Module** (Module Công thức nấu ăn)

#### **NguyenLieu** (Ingredients)
| Tên cột | Kiểu dữ liệu | PK | FK | Nullable | Default | Mô tả |
|---------|--------------|----|----|----------|---------|-------|
| id | uuid | ✅ | | No | gen_random_uuid() | Primary Key |
| ten | text | | | No | | Tên nguyên liệu |
| calo100g | numeric | | | Yes | | Calories/100g |
| dam100g | numeric | | | Yes | | Protein/100g |
| carb100g | numeric | | | Yes | | Carbs/100g |
| chat100g | numeric | | | Yes | | Fat/100g |
| xo100g | numeric | | | Yes | | Fiber/100g |
| duong100g | numeric | | | Yes | | Sugar/100g |
| natri100g | numeric | | | Yes | | Sodium/100g |
| taoluc | timestamptz | | | No | now() | Created at |

---

#### **CongThuc** (Recipes)
| Tên cột | Kiểu dữ liệu | PK | FK | Nullable | Default | Mô tả |
|---------|--------------|----|----|----------|---------|-------|
| id | uuid | ✅ | | No | gen_random_uuid() | Primary Key |
| ten | text | | | No | | Tên công thức |
| mota | text | | | Yes | | Mô tả |
| anhdaidien | text | | | Yes | | Recipe image URL |
| huongdan | jsonb | | | Yes | | Cooking instructions |
| thoigianchuanbi | integer | | | Yes | | Prep time (minutes) |
| thoigiannau | integer | | | Yes | | Cook time (minutes) |
| khauphan | integer | | | Yes | 1 | Servings |
| dokho | text | | | Yes | | Difficulty level |
| tongcalo | numeric | | | Yes | | Total calories |
| tongdam | numeric | | | Yes | | Total protein |
| tongcarb | numeric | | | Yes | | Total carbs |
| tongchat | numeric | | | Yes | | Total fat |
| nguoitao | uuid | | ➡️ auth.users.id | Yes | | Creator user ID |
| congkhai | boolean | | | Yes | false | Is public |
| taoluc | timestamptz | | | No | now() | Created at |
| capnhatluc | timestamptz | | | No | now() | Updated at |

**Foreign Key Behavior:**
- `nguoitao → auth.users.id` ON DELETE SET NULL (recipe tồn tại khi user bị xóa)

---

#### **NguyenLieuCongThuc** (Recipe Ingredients) - JUNCTION TABLE
| Tên cột | Kiểu dữ liệu | PK | FK | Nullable | Default | Mô tả |
|---------|--------------|----|----|----------|---------|-------|
| id | uuid | ✅ | | No | gen_random_uuid() | Primary Key |
| congthucid | uuid | | ➡️ CongThuc.id | Yes | | Recipe ID |
| nguyenlieuid | uuid | | ➡️ NguyenLieu.id | Yes | | Ingredient ID |
| soluong | numeric | | | No | | Quantity |
| donvi | text | | | No | | Unit (gram, kg, ml...) |

**Foreign Key Behavior:**
- `congthucid → CongThuc.id` ON DELETE CASCADE
- `nguyenlieuid → NguyenLieu.id` ON DELETE CASCADE

**Composite Unique:**
- `(congthucid, nguyenlieuid)` - Prevent duplicate ingredients in same recipe

---

### 3️⃣ **Meal Planning Module** (Module Kế hoạch bữa ăn)

#### **DanhMucBuaAn** (Meal Categories)
| Tên cột | Kiểu dữ liệu | PK | FK | Nullable | Default | Mô tả |
|---------|--------------|----|----|----------|---------|-------|
| id | uuid | ✅ | | No | gen_random_uuid() | Primary Key |
| ten | text | | | No | | Tên danh mục (Sáng, Trưa, Tối...) |
| mota | text | | | Yes | | Mô tả |
| thutuhienthi | integer | | | Yes | 0 | Display order |
| taoluc | timestamptz | | | No | now() | Created at |

**Dữ liệu mẫu:**
- Bữa sáng (Morning)
- Bữa trưa (Lunch)
- Bữa tối (Dinner)
- Bữa phụ (Snack)

---

#### **KeHoachBuaAn** (Meal Plans)
| Tên cột | Kiểu dữ liệu | PK | FK | Nullable | Default | Mô tả |
|---------|--------------|----|----|----------|---------|-------|
| id | uuid | ✅ | | No | gen_random_uuid() | Primary Key |
| nguoidungid | uuid | | ➡️ auth.users.id | No | | User ID |
| ten | text | | | No | | Plan name |
| mota | text | | | Yes | | Description |
| muctieucalo | integer | | | Yes | | Target calories/day |
| ngaybatdau | date | | | Yes | | Start date |
| ngayketthuc | date | | | Yes | | End date |
| danghoatdong | boolean | | | Yes | true | Is active |
| taoluc | timestamptz | | | No | now() | Created at |
| capnhatluc | timestamptz | | | No | now() | Updated at |

**Foreign Key Behavior:**
- `nguoidungid → auth.users.id` ON DELETE CASCADE

---

#### **MonAnKeHoach** (Meal Plan Items)
| Tên cột | Kiểu dữ liệu | PK | FK | Nullable | Default | Mô tả |
|---------|--------------|----|----|----------|---------|-------|
| id | uuid | ✅ | | No | gen_random_uuid() | Primary Key |
| kehoachid | uuid | | ➡️ KeHoachBuaAn.id | Yes | | Meal plan ID |
| congthucid | uuid | | ➡️ CongThuc.id | Yes | | Recipe ID |
| danhmucid | uuid | | ➡️ DanhMucBuaAn.id | Yes | | Meal category ID |
| ngaydukien | date | | | No | | Scheduled date |
| giodukien | time | | | Yes | | Scheduled time |
| khauphan | numeric | | | Yes | 1 | Servings |
| taoluc | timestamptz | | | No | now() | Created at |

**Foreign Key Behavior:**
- `kehoachid → KeHoachBuaAn.id` ON DELETE CASCADE
- `congthucid → CongThuc.id` ON DELETE SET NULL
- `danhmucid → DanhMucBuaAn.id` ON DELETE SET NULL

---

### 4️⃣ **Nutrition Tracking Module** (Module Theo dõi dinh dưỡng)

#### **NhatKyDinhDuong** (Nutrition Logs)
| Tên cột | Kiểu dữ liệu | PK | FK | Nullable | Default | Mô tả |
|---------|--------------|----|----|----------|---------|-------|
| id | uuid | ✅ | | No | gen_random_uuid() | Primary Key |
| nguoidungid | uuid | | ➡️ auth.users.id | No | | User ID |
| ngayghinhan | date | | | No | | Log date |
| danhmucid | uuid | | ➡️ DanhMucBuaAn.id | Yes | | Meal category ID |
| congthucid | uuid | | ➡️ CongThuc.id | Yes | | Recipe ID (optional) |
| tenthucpham | text | | | Yes | | Food name (manual entry) |
| soluong | numeric | | | Yes | | Quantity |
| donvi | text | | | Yes | | Unit |
| calo | numeric | | | Yes | | Calories |
| dam | numeric | | | Yes | | Protein |
| carb | numeric | | | Yes | | Carbs |
| chat | numeric | | | Yes | | Fat |
| ghichu | text | | | Yes | | Notes |
| taoluc | timestamptz | | | No | now() | Created at |

**Foreign Key Behavior:**
- `nguoidungid → auth.users.id` ON DELETE CASCADE
- `congthucid → CongThuc.id` ON DELETE SET NULL
- `danhmucid → DanhMucBuaAn.id` ON DELETE SET NULL

**Logic:**
- Nếu `congthucid` có giá trị → Log từ recipe
- Nếu `congthucid` null → Manual entry (dùng `tenthucpham`)

---

#### **NhatKyCanNang** (Weight Logs)
| Tên cột | Kiểu dữ liệu | PK | FK | Nullable | Default | Mô tả |
|---------|--------------|----|----|----------|---------|-------|
| id | uuid | ✅ | | No | gen_random_uuid() | Primary Key |
| nguoidungid | uuid | | ➡️ auth.users.id | No | | User ID |
| cannang | numeric | | | No | | Weight (kg) |
| ngayghinhan | date | | | No | CURRENT_DATE | Log date |
| ghichu | text | | | Yes | | Notes |
| taoluc | timestamptz | | | No | now() | Created at |

**Foreign Key Behavior:**
- `nguoidungid → auth.users.id` ON DELETE CASCADE

---

#### **NhatKyNuoc** (Water Logs)
| Tên cột | Kiểu dữ liệu | PK | FK | Nullable | Default | Mô tả |
|---------|--------------|----|----|----------|---------|-------|
| id | uuid | ✅ | | No | gen_random_uuid() | Primary Key |
| nguoidungid | uuid | | ➡️ auth.users.id | No | | User ID |
| soluongml | integer | | | No | | Amount (ml) |
| ngayghinhan | date | | | No | CURRENT_DATE | Log date |
| gioghinhan | time | | | No | CURRENT_TIME | Log time |
| taoluc | timestamptz | | | No | now() | Created at |

**Foreign Key Behavior:**
- `nguoidungid → auth.users.id` ON DELETE CASCADE

---

### 5️⃣ **Shopping Module** (Module Danh sách mua sắm)

#### **DanhSachMuaSam** (Shopping Lists)
| Tên cột | Kiểu dữ liệu | PK | FK | Nullable | Default | Mô tả |
|---------|--------------|----|----|----------|---------|-------|
| id | uuid | ✅ | | No | gen_random_uuid() | Primary Key |
| nguoidungid | uuid | | ➡️ auth.users.id | No | | User ID |
| ten | text | | | No | | List name |
| taoluc | timestamptz | | | No | now() | Created at |
| capnhatluc | timestamptz | | | No | now() | Updated at |

**Foreign Key Behavior:**
- `nguoidungid → auth.users.id` ON DELETE CASCADE

---

#### **MonMuaSam** (Shopping Items)
| Tên cột | Kiểu dữ liệu | PK | FK | Nullable | Default | Mô tả |
|---------|--------------|----|----|----------|---------|-------|
| id | uuid | ✅ | | No | gen_random_uuid() | Primary Key |
| danhsachid | uuid | | ➡️ DanhSachMuaSam.id | No | | Shopping list ID |
| tennguyenlieu | text | | | No | | Ingredient name |
| soluong | numeric | | | No | | Quantity |
| donvi | text | | | No | | Unit |
| damua | boolean | | | Yes | false | Is purchased |
| taoluc | timestamptz | | | No | now() | Created at |

**Foreign Key Behavior:**
- `danhsachid → DanhSachMuaSam.id` ON DELETE CASCADE

---

### 6️⃣ **Subscription Module** (Module Gói đăng ký)

#### **GoiDangKy** (Subscription Plans)
| Tên cột | Kiểu dữ liệu | PK | FK | Nullable | Default | Mô tả |
|---------|--------------|----|----|----------|---------|-------|
| id | uuid | ✅ | | No | gen_random_uuid() | Primary Key |
| ten | text | | | No | | Plan name |
| mota | text | | | Yes | | Description |
| giathang | numeric | | | Yes | | Monthly price |
| gianam | numeric | | | Yes | | Yearly price |
| tinhnang | jsonb | | | Yes | [] | Features (JSON array) |
| sokehoachtoida | integer | | | Yes | | Max meal plans |
| socongthuctoida | integer | | | Yes | | Max recipes |
| danghoatdong | boolean | | | Yes | true | Is active |
| taoluc | timestamptz | | | No | now() | Created at |

**Dữ liệu mẫu:**
- Miễn phí (Free)
- Cơ bản (Basic)
- Cao cấp (Premium)

---

#### **GoiDangKyNguoiDung** (User Subscriptions)
| Tên cột | Kiểu dữ liệu | PK | FK | Nullable | Default | Mô tả |
|---------|--------------|----|----|----------|---------|-------|
| id | uuid | ✅ | | No | gen_random_uuid() | Primary Key |
| nguoidungid | uuid | | ➡️ auth.users.id | No | | User ID |
| goidangkyid | uuid | | ➡️ GoiDangKy.id | Yes | | Plan ID |
| batdauky | timestamptz | | | Yes | | Period start |
| ketthucky | timestamptz | | | Yes | | Period end |
| trangthai | text | | | Yes | | Status (active/expired) |
| stripekhachhangid | text | | | Yes | | Stripe customer ID |
| stripedangkyid | text | | | Yes | | Stripe subscription ID |
| taoluc | timestamptz | | | No | now() | Created at |
| capnhatluc | timestamptz | | | No | now() | Updated at |

**Unique Constraints:**
- `nguoidungid` (UNIQUE) - Đảm bảo 1 user chỉ có 1 active subscription

**Foreign Key Behavior:**
- `nguoidungid → auth.users.id` ON DELETE CASCADE
- `goidangkyid → GoiDangKy.id` ON DELETE SET NULL

---

## 🔗 Chi tiết các mối quan hệ (Relationships)

### ⭐ **1:1 Relationships**

| Parent Entity | Child Entity | Foreign Key | Cascade | Ghi chú |
|--------------|--------------|-------------|---------|---------|
| auth.users | HoSo | nguoidungid | CASCADE | Mỗi user 1 profile |
| auth.users | HoSoSucKhoe | nguoidungid | CASCADE | Mỗi user 1 health profile |
| auth.users | VaiTroNguoiDung | nguoidungid | CASCADE | Mỗi user 1 role |
| auth.users | GoiDangKyNguoiDung | nguoidungid | CASCADE | Mỗi user 1 subscription |

**Cách vẽ:**
```
┌──────────┐ 1     1 ┌──────────┐
│auth.users├─────────┤   HoSo   │
└──────────┘         └──────────┘
```

---

### ⭐ **1:N Relationships**

#### User → Multiple Records

| Parent (1) | Child (N) | Foreign Key | Cascade | Ghi chú |
|-----------|----------|-------------|---------|---------|
| auth.users | CongThuc | nguoitao | SET NULL | User tạo nhiều recipes |
| auth.users | KeHoachBuaAn | nguoidungid | CASCADE | User có nhiều meal plans |
| auth.users | NhatKyDinhDuong | nguoidungid | CASCADE | User có nhiều nutrition logs |
| auth.users | NhatKyCanNang | nguoidungid | CASCADE | User có nhiều weight logs |
| auth.users | NhatKyNuoc | nguoidungid | CASCADE | User có nhiều water logs |
| auth.users | DanhSachMuaSam | nguoidungid | CASCADE | User có nhiều shopping lists |

**Cách vẽ:**
```
┌──────────┐ 1     N ┌──────────────┐
│auth.users├─────────┤  CongThuc    │
└──────────┘         └──────────────┘
                     (crow's foot)
```

#### Meal Planning Relationships

| Parent (1) | Child (N) | Foreign Key | Cascade | Ghi chú |
|-----------|----------|-------------|---------|---------|
| KeHoachBuaAn | MonAnKeHoach | kehoachid | CASCADE | Plan có nhiều items |
| CongThuc | MonAnKeHoach | congthucid | SET NULL | Recipe trong nhiều items |
| DanhMucBuaAn | MonAnKeHoach | danhmucid | SET NULL | Category cho nhiều items |

#### Nutrition Tracking Relationships

| Parent (1) | Child (N) | Foreign Key | Cascade | Ghi chú |
|-----------|----------|-------------|---------|---------|
| CongThuc | NhatKyDinhDuong | congthucid | SET NULL | Recipe được log nhiều lần |
| DanhMucBuaAn | NhatKyDinhDuong | danhmucid | SET NULL | Category cho logs |

#### Shopping Relationships

| Parent (1) | Child (N) | Foreign Key | Cascade | Ghi chú |
|-----------|----------|-------------|---------|---------|
| DanhSachMuaSam | MonMuaSam | danhsachid | CASCADE | List có nhiều items |

#### Subscription Relationships

| Parent (1) | Child (N) | Foreign Key | Cascade | Ghi chú |
|-----------|----------|-------------|---------|---------|
| GoiDangKy | GoiDangKyNguoiDung | goidangkyid | SET NULL | Plan có nhiều subscriptions |

---

### ⭐ **N:N Relationship** (Many-to-Many)

| Entity A | Junction Table | Entity B | Mô tả |
|----------|----------------|----------|-------|
| CongThuc | NguyenLieuCongThuc | NguyenLieu | Recipes ↔ Ingredients |

**Foreign Keys trong Junction Table:**
```
NguyenLieuCongThuc
├─ congthucid → CongThuc.id (CASCADE)
└─ nguyenlieuid → NguyenLieu.id (CASCADE)
```

**Cách vẽ:**
```
┌──────────┐ N         N ┌──────────────┐
│ CongThuc ├─────┬──────┤  NguyenLieu  │
└──────────┘     │      └──────────────┘
                 │
         ┌───────┴──────────┐
         │NguyenLieuCongThuc│
         │  (Junction)      │
         └──────────────────┘
```

---

## 📊 Bảng tổng hợp Cardinality (Bản số)

| Relationship Type | Ký hiệu | Số lượng |
|------------------|---------|----------|
| **1:1** (One-to-One) | `─────` | 4 relationships |
| **1:N** (One-to-Many) | `────<` | 16 relationships |
| **N:N** (Many-to-Many) | `>───<` | 1 relationship |

---

## 🎨 Hướng dẫn vẽ ERD

### 📌 **Chọn công cụ vẽ:**

1. **Draw.io** (diagrams.net) - Miễn phí
   - https://app.diagrams.net/
   - Template: Entity Relationship

2. **Lucidchart** - Chuyên nghiệp
   - https://www.lucidchart.com/
   - Template: ERD

3. **dbdiagram.io** - Code-based
   - https://dbdiagram.io/
   - Viết code tạo ERD tự động

4. **MySQL Workbench** - Từ database
   - Reverse engineer từ DB schema

---

### 🖌️ **Các ký hiệu cần dùng:**

#### Primary Key (PK):
```
┌──────────────┐
│  CongThuc    │
├──────────────┤
│ 🔑 id (PK)   │ ← Dùng icon key hoặc gạch chân
│ ten          │
└──────────────┘
```

#### Foreign Key (FK):
```
┌──────────────┐
│  CongThuc    │
├──────────────┤
│ 🔑 id        │
│ 🔗 nguoitao  │ ← Dùng icon link
└──────────────┘
```

#### Cardinality Notations (Chen vs Crow's Foot):

**Chen Notation:**
```
[Entity A] ─── 1:N ─── [Entity B]
```

**Crow's Foot Notation (Khuyên dùng):**
```
One-to-One (1:1):
Entity A ──│─────│── Entity B

One-to-Many (1:N):
Entity A ──│─────<── Entity B
           (1)   (N - crow's foot)

Many-to-Many (N:N):
Entity A ──>─────<── Entity B
```

---

### 📐 **Cách sắp xếp layout:**

```
┌─────────────────────────────────────────┐
│         USER MANAGEMENT MODULE          │
├─────────────────────────────────────────┤
│  auth.users ─┬─ HoSo                   │
│              ├─ HoSoSucKhoe            │
│              └─ VaiTroNguoiDung        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          RECIPE MODULE                   │
├─────────────────────────────────────────┤
│  CongThuc ←───┬─── NguyenLieuCongThuc  │
│               │                         │
│  NguyenLieu ──┘                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│       MEAL PLANNING MODULE              │
├─────────────────────────────────────────┤
│  KeHoachBuaAn ──→ MonAnKeHoach         │
│                    ↑                    │
│  CongThuc ─────────┤                   │
│  DanhMucBuaAn ─────┘                   │
└─────────────────────────────────────────┘

... (các module khác tương tự)
```

---

### ✅ **Checklist khi vẽ ERD:**

- [ ] **Tất cả entities** (16 bảng)
- [ ] **Primary Keys** được đánh dấu rõ ràng
- [ ] **Foreign Keys** được nối đến đúng parent table
- [ ] **Cardinality** (1:1, 1:N, N:N) chính xác
- [ ] **Junction table** cho N:N relationship
- [ ] **ON DELETE behavior** (CASCADE vs SET NULL) được ghi chú
- [ ] **Modules** được nhóm theo màu sắc
- [ ] **Legend** giải thích ký hiệu

---

## 🎯 **Ví dụ chi tiết: Vẽ Recipe Module**

### Bước 1: Vẽ 3 entities

```
┌─────────────────────┐
│     NguyenLieu      │
├─────────────────────┤
│ 🔑 id (PK)          │
│ ten                 │
│ calo100g            │
│ dam100g             │
│ ...                 │
└─────────────────────┘

┌─────────────────────┐
│      CongThuc       │
├─────────────────────┤
│ 🔑 id (PK)          │
│ ten                 │
│ mota                │
│ 🔗 nguoitao (FK)    │
│ ...                 │
└─────────────────────┘

┌─────────────────────┐
│ NguyenLieuCongThuc  │
├─────────────────────┤
│ 🔑 id (PK)          │
│ 🔗 congthucid (FK)  │
│ 🔗 nguyenlieuid (FK)│
│ soluong             │
│ donvi               │
└─────────────────────┘
```

### Bước 2: Nối relationships

```
            N:N Relationship
            
NguyenLieu ─────┬───── CongThuc
    ▲           │         ▲
    │           │         │
    │      ┌────┴────┐    │
    │      │Junction │    │
    └──────┤  Table  ├────┘
           │         │
           │NguyenLieu│
           │CongThuc  │
           └─────────┘
```

### Bước 3: Thêm cardinality

```
          (N)              (N)
NguyenLieu >──────┬──────< CongThuc
              (1) │ (1)
                  │
         ┌────────▼────────┐
         │NguyenLieuCongThuc│
         └──────────────────┘
```

---

## 💡 **Tips vẽ ERD đẹp:**

1. **Sắp xếp theo modules** (User, Recipe, Meal Planning...)
2. **Dùng màu sắc** phân biệt modules
3. **Căn chỉnh thẳng hàng** các entity boxes
4. **Tránh đường nối chéo nhau** quá nhiều
5. **Ghi chú CASCADE vs SET NULL** bằng text nhỏ
6. **Thêm Legend** giải thích ký hiệu
7. **Export PNG/SVG** có độ phân giải cao

---

## 📝 **Sample Code cho dbdiagram.io**

```sql
Table HoSo {
  id uuid [pk]
  nguoidungid uuid [ref: - auth.users.id]
  hoten text
  email text
}

Table CongThuc {
  id uuid [pk]
  ten text
  nguoitao uuid [ref: > auth.users.id]
}

Table NguyenLieu {
  id uuid [pk]
  ten text
}

Table NguyenLieuCongThuc {
  id uuid [pk]
  congthucid uuid [ref: > CongThuc.id]
  nguyenlieuid uuid [ref: > NguyenLieu.id]
}

// ... (thêm các bảng khác)
```

Paste code này vào https://dbdiagram.io/ sẽ tự động generate ERD!

---

## 🔍 **Kiểm tra lại ERD:**

### ✅ Đúng:
- [ ] 16 bảng đầy đủ
- [ ] 4 relationships 1:1
- [ ] 16 relationships 1:N
- [ ] 1 relationship N:N với junction table
- [ ] Foreign keys đúng hướng
- [ ] Cascade behaviors chính xác

### ❌ Lỗi thường gặp:
- Thiếu junction table cho CongThuc ↔ NguyenLieu
- Nhầm 1:N thành 1:1
- Quên CASCADE vs SET NULL
- Không nối auth.users với các bảng user-related

---

## 📞 **Liên hệ nếu cần hỗ trợ:**

Nếu bạn gặp khó khăn trong quá trình vẽ ERD, hãy liên hệ để được hỗ trợ thêm!

**Good luck! 🚀**
