# 🧠 LOGIC HOẠT ĐỘNG - THUCDONAI

## 📋 MỤC LỤC

1. [Tổng Quan Kiến Trúc](#1-tổng-quan-kiến-trúc)
2. [Authentication Flow](#2-authentication-flow)
3. [Profile Management](#3-profile-management)
4. [Meal Planning Logic](#4-meal-planning-logic)
5. [Nutrition Tracking](#5-nutrition-tracking)
6. [AI Integration](#6-ai-integration)
7. [Data Flow & State Management](#7-data-flow--state-management)
8. [Security & RLS](#8-security--rls)

---

## 1. TỔNG QUAN KIẾN TRÚC

### 1.1. Architecture Pattern
```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│  (React Components + Pages)             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         BUSINESS LOGIC LAYER            │
│  (Custom Hooks + React Query)           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         DATA ACCESS LAYER               │
│  (Supabase Client + API Calls)          │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         DATABASE LAYER                  │
│  (PostgreSQL + RLS + Triggers)          │
└─────────────────────────────────────────┘
```

### 1.2. Tech Stack Flow
- **Frontend:** React → TypeScript → Vite
- **State:** React Query (Server State) + React Context (Auth State)
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **AI:** OpenAI API / Vision API

---

## 2. AUTHENTICATION FLOW

### 2.1. Đăng Ký (Sign Up)

```typescript
// Flow chi tiết:
1. User nhập email + password ở /auth
2. Frontend gọi: supabase.auth.signUp()
3. Supabase tạo user trong auth.users
4. Database trigger: handle_new_user() tự động chạy
5. Trigger tạo 3 records:
   - HoSo (thông tin cá nhân)
   - HoSoSucKhoe (thông tin sức khỏe)
   - VaiTroNguoiDung (role = 'user')
6. Frontend redirect đến /profile
7. User điền thông tin bổ sung
```

**Code trigger (Database):**
```sql
CREATE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Tạo HoSo
  INSERT INTO public.HoSo (nguoidungid, email)
  VALUES (NEW.id, NEW.email);
  
  -- Tạo HoSoSucKhoe
  INSERT INTO public.HoSoSucKhoe (nguoidungid)
  VALUES (NEW.id);
  
  -- Tạo VaiTroNguoiDung
  INSERT INTO public.VaiTroNguoiDung (nguoidungid, vaitro)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2.2. Đăng Nhập (Sign In)

```typescript
// useAuth.tsx
const signIn = async (email: string, password: string) => {
  // 1. Gọi Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  // 2. Supabase trả về session + JWT token
  // 3. Token được lưu vào localStorage
  // 4. onAuthStateChange listener bắt được event
  // 5. setUser() và setSession() update state
  // 6. React Query invalidate cache
  // 7. Redirect to /dashboard
};
```

### 2.3. Session Management

```typescript
// useAuth.tsx - onAuthStateChange
useEffect(() => {
  // Subscribe to auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Event types:
      // - SIGNED_IN
      // - SIGNED_OUT
      // - TOKEN_REFRESHED
      // - USER_UPDATED
    }
  );
  
  return () => subscription.unsubscribe();
}, []);
```

---

## 3. PROFILE MANAGEMENT

### 3.1. Lấy Thông Tin Profile

```typescript
// useProfile.tsx - getCompleteProfile()
const getCompleteProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // ✅ Chạy song song 3 queries bằng Promise.all
  const [profile, healthProfile, weightLogs] = await Promise.all([
    // Query 1: Lấy HoSo với JOIN VaiTroNguoiDung
    supabase
      .from('HoSo')
      .select(`
        *,
        VaiTroNguoiDung!VaiTroNguoiDung_nguoidungid_fkey (
          id, vaitro, taoluc
        )
      `)
      .eq('nguoidungid', user.id)
      .maybeSingle(),
    
    // Query 2: Lấy HoSoSucKhoe
    supabase
      .from('HoSoSucKhoe')
      .select('*')
      .eq('nguoidungid', user.id)
      .maybeSingle(),
    
    // Query 3: Lấy 10 bản ghi cân nặng gần nhất
    supabase
      .from('NhatKyCanNang')
      .select('*')
      .eq('nguoidungid', user.id)
      .order('ngayghinhan', { ascending: false })
      .limit(10)
  ]);
  
  return { profile, healthProfile, weightLogs };
};
```

**Lợi ích:**
- ✅ Giảm số lượng round-trips (3 queries song song thay vì tuần tự)
- ✅ Tận dụng Foreign Key để JOIN
- ✅ `.maybeSingle()` tránh lỗi khi chưa có data

### 3.2. Cập Nhật Profile

```typescript
// Logic update với optimistic UI
const updateProfile = async (profile: Partial<Profile>) => {
  // 1. Update trên server
  const { data } = await supabase
    .from('HoSo')
    .update({ 
      ...profile, 
      capnhatluc: new Date().toISOString() 
    })
    .eq('nguoidungid', user.id)
    .select()
    .single();
  
  // 2. React Query tự động invalidate cache
  // 3. UI re-render với data mới
  // 4. Toast notification
};
```

### 3.3. Upload Avatar

```typescript
// Upload flow với Supabase Storage
const uploadAvatar = async (file: File) => {
  // 1. Generate unique filename: userId/timestamp.ext
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;
  
  // 2. Xóa avatar cũ (nếu có)
  if (oldAvatar) {
    await supabase.storage.from('avatars').remove([oldPath]);
  }
  
  // 3. Upload file mới
  await supabase.storage.from('avatars').upload(fileName, file);
  
  // 4. Get public URL
  const { publicUrl } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);
  
  // 5. Update HoSo với URL mới
  await supabase.from('HoSo')
    .update({ anhdaidien: publicUrl })
    .eq('nguoidungid', user.id);
};
```

---

## 4. MEAL PLANNING LOGIC

### 4.1. Tạo Kế Hoạch Bữa Ăn Tự Động (AI)

```typescript
// useMealPlanGenerator.tsx
const generateMealPlan = async () => {
  // BƯỚC 1: Lấy thông tin sức khỏe người dùng
  const healthProfile = await getHealthProfile();
  
  // BƯỚC 2: Tính toán calories cần thiết
  const dailyCalories = calculateDailyCalories({
    chieucao: healthProfile.chieucao,
    cannang: healthProfile.cannang,
    mucdohoatdong: healthProfile.mucdohoatdong,
    muctieusuckhoe: healthProfile.muctieusuckhoe
  });
  
  // BƯỚC 3: Gọi AI để generate meal plan
  const aiResponse = await fetch('/api/generate-meal-plan', {
    method: 'POST',
    body: JSON.stringify({
      dailyCalories,
      restrictions: healthProfile.hanchechedo,
      allergies: healthProfile.diung,
      preferences: healthProfile.muctieusuckhoe
    })
  });
  
  // BƯỚC 4: Parse AI response
  const mealPlan = await aiResponse.json();
  
  // BƯỚC 5: Lưu vào database
  // 5.1 Tạo KeHoachBuaAn
  const { data: plan } = await supabase
    .from('KeHoachBuaAn')
    .insert({
      nguoidungid: user.id,
      ten: `Kế hoạch ${startDate} - ${endDate}`,
      muctieucalo: dailyCalories,
      ngaybatdau: startDate,
      ngayketthuc: endDate,
      danghoatdong: true
    })
    .select()
    .single();
  
  // 5.2 Tạo MonAnKeHoach cho mỗi bữa
  for (const meal of mealPlan.meals) {
    await supabase.from('MonAnKeHoach').insert({
      kehoachid: plan.id,
      congthucid: meal.recipeId,
      danhmucid: meal.categoryId, // Sáng/Trưa/Tối
      ngaydukien: meal.date,
      khauphan: meal.servings
    });
  }
  
  return plan;
};
```

### 4.2. Công Thức Tính Calories

```typescript
// BMR (Basal Metabolic Rate) - Mifflin-St Jeor Equation
function calculateBMR(weight: number, height: number, age: number, gender: string) {
  if (gender === 'Nam') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
}

// TDEE (Total Daily Energy Expenditure)
function calculateTDEE(bmr: number, activityLevel: string) {
  const multipliers = {
    'Ít vận động': 1.2,
    'Vận động nhẹ': 1.375,
    'Vận động vừa': 1.55,
    'Vận động nhiều': 1.725,
    'Vận động rất nhiều': 1.9
  };
  
  return bmr * (multipliers[activityLevel] || 1.2);
}

// Điều chỉnh theo mục tiêu
function adjustForGoal(tdee: number, goal: string) {
  switch(goal) {
    case 'Giảm cân':
      return tdee - 500; // Deficit 500 calo/ngày
    case 'Tăng cân':
      return tdee + 300; // Surplus 300 calo/ngày
    case 'Duy trì':
      return tdee;
    default:
      return tdee;
  }
}
```

### 4.3. Phân Bổ Calories Theo Bữa

```typescript
// Default distribution
const mealDistribution = {
  'Bữa sáng': 0.25,   // 25% calories
  'Bữa trưa': 0.35,   // 35% calories
  'Bữa tối': 0.30,    // 30% calories
  'Bữa phụ': 0.10     // 10% calories
};

function distributeMealCalories(totalCalories: number) {
  return {
    breakfast: totalCalories * 0.25,
    lunch: totalCalories * 0.35,
    dinner: totalCalories * 0.30,
    snack: totalCalories * 0.10
  };
}
```

---

## 5. NUTRITION TRACKING

### 5.1. Ghi Nhận Bữa Ăn

```typescript
// useNutritionLogs.tsx
const logMeal = async (mealData) => {
  // BƯỚC 1: Validate input
  if (!mealData.ngayghinhan || !mealData.calo) {
    throw new Error('Missing required fields');
  }
  
  // BƯỚC 2: Insert vào NhatKyDinhDuong
  const { data } = await supabase
    .from('NhatKyDinhDuong')
    .insert({
      nguoidungid: user.id,
      ngayghinhan: mealData.ngayghinhan,
      tenthucpham: mealData.tenthucpham,
      congthucid: mealData.congthucid, // Optional
      danhmucid: mealData.danhmucid,   // Sáng/Trưa/Tối
      soluong: mealData.soluong,
      donvi: mealData.donvi,
      calo: mealData.calo,
      dam: mealData.dam,
      carb: mealData.carb,
      chat: mealData.chat
    })
    .select()
    .single();
  
  // BƯỚC 3: Invalidate React Query cache
  queryClient.invalidateQueries(['nutrition-logs', today]);
  
  return data;
};
```

### 5.2. Tính Tổng Dinh Dưỡng Theo Ngày

```typescript
const getDailyNutrition = async (date: string) => {
  // Query tất cả logs trong ngày
  const { data: logs } = await supabase
    .from('NhatKyDinhDuong')
    .select('*')
    .eq('nguoidungid', user.id)
    .eq('ngayghinhan', date);
  
  // Aggregate
  const totals = logs.reduce((acc, log) => {
    return {
      calo: acc.calo + (log.calo || 0),
      dam: acc.dam + (log.dam || 0),
      carb: acc.carb + (log.carb || 0),
      chat: acc.chat + (log.chat || 0)
    };
  }, { calo: 0, dam: 0, carb: 0, chat: 0 });
  
  // So sánh với mục tiêu
  const progress = {
    caloPercentage: (totals.calo / dailyGoal.calo) * 100,
    damPercentage: (totals.dam / dailyGoal.dam) * 100,
    // ...
  };
  
  return { totals, progress };
};
```

### 5.3. Biểu Đồ Thống Kê

```typescript
// Lấy data 7 ngày gần nhất
const getWeeklyStats = async () => {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 7);
  
  const { data } = await supabase
    .from('NhatKyDinhDuong')
    .select('ngayghinhan, calo, dam, carb')
    .eq('nguoidungid', user.id)
    .gte('ngayghinhan', startDate.toISOString())
    .lte('ngayghinhan', endDate.toISOString())
    .order('ngayghinhan', { ascending: true });
  
  // Group by date và aggregate
  const dailyTotals = groupByDate(data);
  
  return dailyTotals; // Dùng cho chart
};
```

---

## 6. AI INTEGRATION

### 6.1. Food Scanner (Vision API)

```typescript
// useFoodScanner.tsx
const scanFood = async (imageFile: File) => {
  // BƯỚC 1: Upload ảnh lên Supabase Storage
  const { publicUrl } = await uploadToStorage(imageFile);
  
  // BƯỚC 2: Gọi Vision API
  const response = await fetch('/api/scan-food', {
    method: 'POST',
    body: JSON.stringify({ imageUrl: publicUrl })
  });
  
  // BƯỚC 3: Parse kết quả
  const result = await response.json();
  // {
  //   foodName: "Cơm gà",
  //   calories: 450,
  //   protein: 25g,
  //   carbs: 50g,
  //   confidence: 0.92
  // }
  
  // BƯỚC 4: Lưu vào scan history
  await supabase.from('LichSuQuetThucPham').insert({
    nguoidungid: user.id,
    anhurl: publicUrl,
    ketqua: result,
    thoigian: new Date()
  });
  
  return result;
};
```

### 6.2. Recipe Analyzer (OpenAI)

```typescript
// useRecipeAnalyzer.tsx
const analyzeRecipe = async (recipe) => {
  // BƯỚC 1: Chuẩn bị prompt
  const prompt = `
    Phân tích công thức nấu ăn sau:
    Tên: ${recipe.ten}
    Nguyên liệu: ${recipe.nguyenlieu.join(', ')}
    Hướng dẫn: ${recipe.huongdan}
    
    Hãy cung cấp:
    1. Tổng calories ước tính
    2. Phân tích dinh dưỡng (protein, carb, fat)
    3. Lợi ích sức khỏe
    4. Cảnh báo (nếu có)
  `;
  
  // BƯỚC 2: Gọi OpenAI API
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }]
  });
  
  // BƯỚC 3: Parse response
  const analysis = parseAIResponse(response.choices[0].message.content);
  
  // BƯỚC 4: Cập nhật recipe với thông tin dinh dưỡng
  await supabase.from('CongThuc').update({
    tongcalo: analysis.calories,
    tongdam: analysis.protein,
    tongcarb: analysis.carbs,
    // ...
  }).eq('id', recipe.id);
  
  return analysis;
};
```

### 6.3. Nutrition Chatbot

```typescript
// ChatBot.tsx
const chatWithAI = async (userMessage: string, context: HealthProfile) => {
  // BƯỚC 1: Build conversation context
  const systemPrompt = `
    Bạn là chuyên gia dinh dưỡng AI. 
    Thông tin người dùng:
    - Chiều cao: ${context.chieucao}cm
    - Cân nặng: ${context.cannang}kg
    - Mục tiêu: ${context.muctieusuckhoe.join(', ')}
    - Hạn chế: ${context.hanchechedo.join(', ')}
    - Dị ứng: ${context.diung.join(', ')}
  `;
  
  // BƯỚC 2: Gọi AI
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ]
  });
  
  return response.choices[0].message.content;
};
```

---

## 7. DATA FLOW & STATE MANAGEMENT

### 7.1. React Query Pattern

```typescript
// Định nghĩa query hooks
const useRecipes = () => {
  return useQuery({
    queryKey: ['recipes', 'public'],
    queryFn: async () => {
      const { data } = await supabase
        .from('CongThuc')
        .select('*')
        .eq('congkhai', true);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    cacheTime: 10 * 60 * 1000 // 10 phút
  });
};

// Mutation hooks
const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (recipe) => {
      const { data } = await supabase
        .from('CongThuc')
        .insert(recipe)
        .select()
        .single();
      return data;
    },
    onSuccess: () => {
      // Invalidate cache để refetch
      queryClient.invalidateQueries(['recipes']);
    }
  });
};
```

### 7.2. Optimistic Updates

```typescript
const useLikeMeal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (mealId) => {
      // Server update
      const { data } = await supabase
        .from('MonAnYeuThich')
        .insert({ nguoidungid: user.id, monanid: mealId });
      return data;
    },
    // Optimistic update - UI update trước
    onMutate: async (mealId) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries(['meals']);
      
      // Snapshot current value
      const previous = queryClient.getQueryData(['meals']);
      
      // Optimistically update
      queryClient.setQueryData(['meals'], (old) => {
        return old.map(meal => 
          meal.id === mealId 
            ? { ...meal, liked: true }
            : meal
        );
      });
      
      return { previous };
    },
    // Rollback nếu error
    onError: (err, mealId, context) => {
      queryClient.setQueryData(['meals'], context.previous);
    }
  });
};
```

---

## 8. SECURITY & RLS

### 8.1. Row Level Security Policies

```sql
-- Policy: User chỉ xem được profile của mình
CREATE POLICY "view_own_profile" ON HoSo
FOR SELECT
USING (auth.uid() = nguoidungid);

-- Policy: User chỉ sửa được profile của mình
CREATE POLICY "update_own_profile" ON HoSo
FOR UPDATE
USING (auth.uid() = nguoidungid);

-- Policy: Xem công thức công khai HOẶC của mình
CREATE POLICY "view_recipes" ON CongThuc
FOR SELECT
USING (
  congkhai = true OR 
  auth.uid() = nguoitao
);

-- Policy: Chỉ tạo công thức cho chính mình
CREATE POLICY "create_recipes" ON CongThuc
FOR INSERT
WITH CHECK (auth.uid() = nguoitao);
```

### 8.2. Secure API Calls

```typescript
// Luôn validate user trước khi thực hiện action
const createMealPlan = async (planData) => {
  // 1. Verify authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  // 2. Validate input
  if (!planData.ten || !planData.muctieucalo) {
    throw new Error('Invalid input');
  }
  
  // 3. Check permissions (nếu cần)
  const hasPermission = await checkUserPermission(user.id, 'create_plan');
  if (!hasPermission) throw new Error('Forbidden');
  
  // 4. Execute với RLS tự động enforce
  const { data } = await supabase
    .from('KeHoachBuaAn')
    .insert({
      ...planData,
      nguoidungid: user.id // Must match auth.uid()
    });
  
  return data;
};
```

### 8.3. Data Cascade & Integrity

```sql
-- Foreign Key với CASCADE
ALTER TABLE NguyenLieuCongThuc
ADD CONSTRAINT fk_congthuc
FOREIGN KEY (congthucid) 
REFERENCES CongThuc(id)
ON DELETE CASCADE;

-- Khi xóa CongThuc → Tự động xóa NguyenLieuCongThuc
-- Khi xóa User → Tự động xóa tất cả data liên quan
```

---

## 🎯 ĐIỂM QUAN TRỌNG KHI BẢO VỆ

### 1. Giải Thích Flow Tạo Meal Plan
> "Khi người dùng tạo kế hoạch, hệ thống sẽ lấy thông tin sức khỏe từ `HoSoSucKhoe`, tính toán calories cần thiết dựa trên công thức Mifflin-St Jeor, sau đó gọi AI để generate danh sách món ăn phù hợp. Kết quả được lưu vào `KeHoachBuaAn` và các món ăn được lưu vào `MonAnKeHoach` với foreign key reference."

### 2. Giải Thích Authentication
> "Em sử dụng Supabase Auth với JWT token. Khi user đăng ký, database trigger `handle_new_user` tự động tạo 3 records cần thiết. Session được quản lý bởi React Context và tự động refresh token khi hết hạn."

### 3. Giải Thích RLS
> "Row Level Security đảm bảo users chỉ truy cập được dữ liệu của mình. Mọi query đều được filter bởi `auth.uid() = nguoidungid`. Điều này được enforce ở database level, không thể bypass từ client."

### 4. Giải Thích State Management
> "Em sử dụng React Query để cache server state, giảm số lượng API calls và cải thiện performance. Các mutations tự động invalidate cache để UI luôn đồng bộ với database."

---

## 📝 CHECKLIST HIỂU LOGIC

- [ ] Hiểu flow đăng ký và trigger tự động
- [ ] Hiểu cách tính calories (BMR, TDEE)
- [ ] Hiểu React Query (queryKey, staleTime, invalidation)
- [ ] Hiểu RLS policies và cách hoạt động
- [ ] Hiểu Foreign Keys và CASCADE
- [ ] Hiểu cách AI được tích hợp
- [ ] Hiểu cách upload file lên Supabase Storage
- [ ] Hiểu optimistic updates
- [ ] Hiểu authentication flow
- [ ] Hiểu data aggregation (tính tổng dinh dưỡng)

---

**LƯU Ý:** Tài liệu này phục vụ cho bảo vệ đồ án. Hãy đọc kỹ và thực hành giải thích từng phần!
