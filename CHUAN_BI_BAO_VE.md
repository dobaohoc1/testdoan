# ✅ CHECKLIST CHUẨN BỊ BẢO VỆ ĐỒ ÁN

## 📚 TÀI LIỆU CẦN ĐỌC KỸ

### 1. Tài Liệu Kỹ Thuật
- [x] `README.md` - Tổng quan project
- [x] `DATABASE_SCHEMA.md` - Schema database chi tiết
- [x] `LOGIC_HOAT_DONG.md` - **MỚI** Logic hoạt động hệ thống
- [x] `USECASE_OVERVIEW.md` - 49 use cases
- [x] `USECASE_DETAILED.md` - Chi tiết use cases
- [x] `DE_XUAT_CAI_TIEN.md` - **MỚI** Đề xuất cải tiến

### 2. Code Cần Hiểu
- [ ] `src/hooks/useAuth.tsx` - Authentication flow
- [ ] `src/hooks/useProfile.tsx` - Profile management
- [ ] `src/hooks/useMealPlans.tsx` - Meal planning logic
- [ ] `src/hooks/useNutritionLogs.tsx` - Nutrition tracking
- [ ] `src/integrations/supabase/client.ts` - Database client
- [ ] `src/App.tsx` - Routing và structure

---

## 🎯 CÂU HỎI THƯỜNG GẶP KHI BẢO VỆ

### PHẦN 1: TỔNG QUAN

#### Q1: "Em giới thiệu về đồ án của em?"
**Trả lời mẫu:**
> "Dạ, em xin giới thiệu đồ án 'ThucdonAI - Hệ thống quản lý dinh dưỡng thông minh'. Đây là một ứng dụng web giúp người dùng quản lý chế độ ăn uống cá nhân hóa thông qua công nghệ AI.
> 
> Hệ thống cho phép:
> - Tạo kế hoạch bữa ăn tự động dựa trên thông tin sức khỏe
> - Theo dõi dinh dưỡng hàng ngày với biểu đồ trực quan
> - Quét thực phẩm qua hình ảnh để phân tích dinh dưỡng
> - Quản lý công thức nấu ăn và nguyên liệu
> - Theo dõi cân nặng và lượng nước uống
> 
> Em sử dụng stack công nghệ: React + TypeScript + Supabase + OpenAI API."

**Điểm cộng:** Nói rõ ràng, tự tin, có số liệu cụ thể

---

#### Q2: "Tại sao em chọn đề tài này?"
**Trả lời mẫu:**
> "Dạ, em chọn đề tài này vì 3 lý do:
> 1. **Thực tiễn:** Hiện nay nhiều người gặp khó khăn trong việc quản lý chế độ ăn uống khoa học, đặc biệt là người tập gym, người muốn giảm cân.
> 2. **Công nghệ:** Em muốn áp dụng AI vào bài toán thực tế, không chỉ học lý thuyết.
> 3. **Học hỏi:** Qua đồ án này, em học được full-stack development, database design, AI integration, và deployment."

---

### PHẦN 2: CÔNG NGHỆ

#### Q3: "Em giải thích tech stack của em?"
**Trả lời mẫu:**
> "Dạ, em sử dụng:
> - **Frontend:** React 18 với TypeScript để có type safety, Vite làm build tool vì compile nhanh, Tailwind CSS + Shadcn/UI cho UI components
> - **State Management:** React Query cho server state caching, React Context cho auth state
> - **Backend:** Supabase - là BaaS platform cung cấp PostgreSQL database, Authentication, Storage, và Edge Functions
> - **AI:** OpenAI GPT-4 API cho meal planning và recipe analysis, Vision API cho food scanner
> 
> Em chọn stack này vì:
> - TypeScript giúp catch bugs sớm
> - Supabase có built-in RLS (Row Level Security)
> - React Query giảm số lượng API calls"

---

#### Q4: "Em giải thích về database schema?"
**Trả lời mẫu:**
> "Dạ, em thiết kế database với 16 bảng, chia thành 6 modules:
> 1. **Module User:** HoSo, HoSoSucKhoe, VaiTroNguoiDung
> 2. **Module Recipe:** CongThuc, NguyenLieu, NguyenLieuCongThuc
> 3. **Module Meal Plan:** KeHoachBuaAn, MonAnKeHoach, DanhMucBuaAn
> 4. **Module Tracking:** NhatKyDinhDuong, NhatKyCanNang, NhatKyNuoc
> 5. **Module Shopping:** DanhSachMuaSam, MonMuaSam
> 6. **Module Subscription:** GoiDangKy, GoiDangKyNguoiDung
> 
> Các bảng có relationships với Foreign Keys và CASCADE deletes để đảm bảo data integrity. Em áp dụng normalization 3NF và đánh index cho các cột thường query."

**Vẽ sơ đồ nếu được hỏi chi tiết:**
```
HoSo (1) ----< (n) NhatKyDinhDuong
CongThuc (1) ----< (n) NguyenLieuCongThuc >---- (n) NguyenLieu
```

---

#### Q5: "Row Level Security là gì? Em implement như thế nào?"
**Trả lời mẫu:**
> "Dạ, RLS là cơ chế bảo mật ở database level, filter rows dựa trên user context. 
> 
> Ví dụ policy cho bảng HoSo:
> ```sql
> CREATE POLICY 'view_own_profile' ON HoSo
> FOR SELECT USING (auth.uid() = nguoidungid);
> ```
> 
> Nghĩa là: User chỉ SELECT được rows có `nguoidungid = auth.uid()` (ID của họ).
> 
> Em apply RLS cho tất cả 16 bảng. Lợi ích:
> - Users không thể thấy data của người khác
> - Bảo mật ở database level, không bypass được
> - Admin có thể vượt qua RLS bằng SECURITY DEFINER functions"

---

### PHẦN 3: CHỨC NĂNG

#### Q6: "Flow tạo meal plan tự động hoạt động như thế nào?"
**Trả lời mẫu:**
> "Dạ, flow gồm 5 bước:
> 
> **Bước 1:** Lấy thông tin sức khỏe từ `HoSoSucKhoe` (chiều cao, cân nặng, mục tiêu)
> 
> **Bước 2:** Tính calories cần thiết:
> - BMR (Basal Metabolic Rate) dùng công thức Mifflin-St Jeor
> - TDEE (Total Daily Energy) = BMR × hệ số hoạt động
> - Điều chỉnh theo mục tiêu (giảm cân: -500 cal, tăng cân: +300 cal)
> 
> **Bước 3:** Gọi OpenAI API với prompt chứa:
> - Daily calories target
> - Dietary restrictions (chay, keto, ...)
> - Allergies
> - Preferences
> 
> **Bước 4:** AI trả về JSON với meal suggestions
> 
> **Bước 5:** Lưu vào database:
> - Insert `KeHoachBuaAn`
> - Insert nhiều `MonAnKeHoach` vớiFK references"

**Bonus:** Vẽ flowchart nếu có bảng

---

#### Q7: "Em xử lý authentication như thế nào?"
**Trả lời mẫu:**
> "Dạ, em sử dụng Supabase Auth với JWT tokens:
> 
> **Sign Up:**
> 1. User nhập email + password
> 2. Frontend call `supabase.auth.signUp()`
> 3. Supabase tạo user trong `auth.users`
> 4. Database trigger `handle_new_user()` tự động tạo:
>    - HoSo record
>    - HoSoSucKhoe record
>    - VaiTroNguoiDung record (role = 'user')
> 5. User redirect đến /profile
> 
> **Sign In:**
> 1. Supabase trả về session + JWT token
> 2. Token lưu vào localStorage
> 3. React Context subscribe `onAuthStateChange`
> 4. Auto refresh token khi hết hạn
> 
> **Authorization:**
> - JWT token đính kèm mọi request
> - RLS policies check `auth.uid()`
> - Admin check bằng function `has_role()`"

---

### PHẦN 4: AI INTEGRATION

#### Q8: "AI được tích hợp như thế nào?"
**Trả lời mẫu:**
> "Dạ, em tích hợp AI ở 3 chỗ:
> 
> **1. Meal Plan Generator:**
> - Dùng GPT-4 với prompt engineering
> - Input: health profile, preferences, restrictions
> - Output: 7-day meal plan JSON
> 
> **2. Food Scanner:**
> - Dùng Vision API
> - User chụp ảnh thực phẩm
> - AI nhận diện và estimate nutrition
> - Accuracy ~85-90%
> 
> **3. Nutrition Chatbot:**
> - GPT-4 với system prompt về nutrition
> - Context-aware (biết health profile user)
> - Trả lời các câu hỏi về dinh dưỡng
> 
> Em handle errors với try-catch và có fallback khi AI fail."

---

### PHẦN 5: PERFORMANCE & OPTIMIZATION

#### Q9: "Em làm gì để optimize performance?"
**Trả lời mẫu:**
> "Dạ, em áp dụng:
> 
> **1. React Query Caching:**
> - Server state được cache 5-10 phút
> - Giảm 60-70% số lượng API calls
> - Automatic background refetch
> 
> **2. Database Indexes:**
> - Index trên tất cả Foreign Keys
> - Index trên `ngayghinhan` cho nutrition logs
> - Tăng tốc độ query 5-10x
> 
> **3. Code Splitting:**
> - Lazy load pages với `React.lazy()`
> - Vite automatic bundle splitting
> - Initial load nhỏ hơn 40%
> 
> **4. Image Optimization:**
> - Lazy loading images
> - Supabase Storage auto-resize
> - WebP format"

---

#### Q10: "Database có bao nhiêu records? Performance thế nào?"
**Trả lời mẫu:**
> "Dạ, để test performance, em seed:
> - 100 fake users
> - 500 recipes
> - 5000 nutrition logs
> 
> Query time:
> - Get daily nutrition: ~50ms (có index)
> - Get meal plans: ~30ms (với JOIN)
> - Search recipes: ~20ms (full-text search)
> 
> Em dùng `EXPLAIN ANALYZE` để check query plans và đảm bảo indexes được sử dụng."

---

### PHẦN 6: BẢO MẬT

#### Q11: "Em đảm bảo bảo mật như thế nào?"
**Trả lời mẫu:**
> "Dạ, em áp dụng nhiều layers:
> 
> **1. Database Level:**
> - Row Level Security trên tất cả tables
> - Foreign Key constraints
> - Audit logging (optional)
> 
> **2. Application Level:**
> - Input validation với Zod schemas
> - XSS prevention (React tự động escape)
> - CSRF protection (Supabase built-in)
> 
> **3. Authentication:**
> - JWT tokens với expiry time
> - Secure cookies (httpOnly, sameSite)
> - Password hashing (Supabase bcrypt)
> 
> **4. Environment:**
> - API keys trong .env (không commit)
> - CORS configuration
> - HTTPS only"

---

### PHẦN 7: TESTING & DEPLOYMENT

#### Q12: "Em test như thế nào?"
**Trả lời mẫu:**
> "Dạ, em test:
> 
> **1. Manual Testing:**
> - Test tất cả user flows
> - Test edge cases (empty data, invalid input)
> - Cross-browser testing (Chrome, Firefox, Safari)
> 
> **2. Database Testing:**
> - Test RLS policies
> - Test CASCADE deletes
> - Test triggers
> 
> **3. Integration Testing:**
> - Test Supabase queries
> - Test AI API calls (với mock data)
> 
> **Future:** Em sẽ thêm Jest + React Testing Library"

---

#### Q13: "Em deploy ở đâu? Process như thế nào?"
**Trả lời mẫu:**
> "Dạ, em deploy:
> 
> **Frontend:** Vercel
> - Connected với GitHub repo
> - Auto-deploy khi push to main
> - Build time ~2 phút
> - CDN global
> 
> **Backend:** Supabase Cloud
> - PostgreSQL hosted
> - Auto-scaling
> - Backups daily
> 
> **Deployment Process:**
> 1. Push code to GitHub
> 2. Vercel auto build
> 3. Run migrations nếu có changes
> 4. Deploy to production
> 
> Em có staging environment để test trước khi deploy production."

---

### PHẦN 8: THÁCH THỨC

#### Q14: "Khó khăn lớn nhất em gặp phải là gì?"
**Trả lời mẫu:**
> "Dạ, có 3 khó khăn chính:
> 
> **1. Database Design:**
> - Ban đầu em thiết kế thiếu Foreign Keys
> - Phải refactor schema nhiều lần
> - Học được: Plan trước, vẽ ERD kỹ
> 
> **2. AI Prompt Engineering:**
> - AI responses không consistent
> - Phải fine-tune prompts nhiều lần
> - Học được: Provide examples, clear instructions
> 
> **3. RLS Policies:**
> - Đôi khi JOINs không work với RLS
> - Phải dùng SECURITY DEFINER functions
> - Học được: Test RLS thoroughly
> 
> Nhưng qua đó em học được rất nhiều và cải thiện skills."

---

#### Q15: "Nếu làm lại, em sẽ làm gì khác?"
**Trả lời mẫu:**
> "Dạ, em sẽ:
> 
> **1. Database:**
> - Dùng Materialized Views cho stats
> - Partition tables cho better performance
> 
> **2. Testing:**
> - Viết tests từ đầu
> - CI/CD pipeline đầy đủ hơn
> 
> **3. Features:**
> - Thêm mobile app (React Native)
> - WebSocket cho real-time updates
> - More advanced AI (personalized recommendations)
> 
> **4. Documentation:**
> - API docs với Swagger
> - User guide videos
> 
> Nhưng với thời gian và scope của đồ án, em nghĩ mình đã làm tốt được những gì quan trọng nhất."

---

## 💡 TIPS BẢO VỆ

### DO ✅

1. **Nói chậm, rõ ràng**
   - Pause trước khi trả lời
   - Think before you speak

2. **Dùng ví dụ cụ thể**
   - "Ví dụ như bảng HoSo có FK đến auth.users..."
   - Dễ hiểu hơn lý thuyết trừu tượng

3. **Thừa nhận không biết**
   - "Em chưa tìm hiểu sâu về phần này"
   - Tốt hơn là trả lời sai

4. **Vẽ sơ đồ nếu cần**
   - Database ERD
   - Flow diagrams
   - Architecture

5. **Tự tin**
   - Đây là project của bạn
   - Bạn hiểu nó nhất

### DON'T ❌

1. **Không đọc thuộc lòng**
   - Nghe không tự nhiên
   - Dễ quên

2. **Không nói dối**
   - "Em code 100% không tham khảo"
   - Hội đồng có kinh nghiệm

3. **Không quá kỹ thuật**
   - Giải thích cho người không chuyên hiểu
   - Tránh jargon quá nhiều

4. **Không đổ lỗi cho tools**
   - "Lovable nó generate sai"
   - Mất điểm

5. **Không panic**
   - Bình tĩnh, thở sâu
   - Có thể xin phép uống nước

---

## 📝 PRACTICE QUESTIONS

### Tự hỏi - tự trả lời 10 câu sau:

1. [ ] Giải thích flow đăng ký user (từ frontend → database)
2. [ ] Tại sao dùng TypeScript thay vì JavaScript?
3. [ ] Foreign Key cascade delete hoạt động thế nào?
4. [ ] React Query cache invalidation khi nào?
5. [ ] Làm sao AI biết preferences của user?
6. [ ] Xử lý upload file như thế nào?
7. [ ] Database migration process?
8. [ ] Optimize large nutrition logs table?
9. [ ] Handle concurrent updates?
10. [ ] Backup và disaster recovery strategy?

---

## 🎯 ĐIỂM CỘNG TRONG BẢO VỆ

1. **Demo sống động**
   - Chuẩn bị demo scenarios
   - Test trước kỹ

2. **Số liệu cụ thể**
   - "16 bảng, 18 indexes"
   - "Query time < 100ms"

3. **Trade-offs**
   - "Em chọn A thay vì B vì..."
   - Cho thấy critical thinking

4. **Future work**
   - Biết mình có thể improve gì
   - Vision dài hạn

5. **Business value**
   - Không chỉ technical
   - Giải quyết vấn đề gì

---

## ✅ FINAL CHECKLIST

Trước ngày bảo vệ:

- [ ] Đọc lại toàn bộ documents
- [ ] Test demo kỹ (internet, projector)
- [ ] Chuẩn bị slide (nếu có)
- [ ] In ERD, diagrams
- [ ] Ngủ đủ giấc 😴
- [ ] Ăn sáng no ☕
- [ ] Mặc đẹp 👔
- [ ] Mang laptop backup
- [ ] Đến sớm 30 phút

---

**Chúc bạn bảo vệ thành công! 🎉🎓**

Nhớ rằng: Hội đồng muốn thấy bạn hiểu project, không phải nhớ từng dòng code!
