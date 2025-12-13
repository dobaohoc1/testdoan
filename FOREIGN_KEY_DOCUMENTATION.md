# 📊 Tài liệu quan hệ Database - Foreign Keys

## Tổng quan về kiến trúc Database

Ứng dụng Nutrition AI sử dụng **PostgreSQL** với Supabase, đảm bảo tính toàn vẹn dữ liệu thông qua hệ thống **Foreign Keys** và **Row Level Security (RLS)**.

---

## 🔗 Sơ đồ quan hệ các bảng

### 1. User Management
```
auth.users (Supabase Auth)
    ↓ (CASCADE)
    ├─→ profiles (1:1)
    │   └─→ user_roles (1:1)
    │
    └─→ health_profiles (1:1)
```

**Foreign Keys:**
- `profiles.user_id` → `auth.users.id` (ON DELETE CASCADE)
- `health_profiles.user_id` → `auth.users.id` (ON DELETE CASCADE)
- `user_roles.user_id` → `auth.users.id` (ON DELETE CASCADE)

---

### 2. Recipe System
```
auth.users
    ↓ (SET NULL)
recipes
    ↓ (CASCADE)
    ├─→ recipe_ingredients (1:N)
    │   └─→ ingredients (N:1)
    │
    └─→ meal_plan_items (1:N)
```

**Foreign Keys:**
- `recipes.created_by` → `auth.users.id` (ON DELETE SET NULL)
  - *Khi user bị xóa, recipes vẫn tồn tại nhưng created_by = null*
  
- `recipe_ingredients.recipe_id` → `recipes.id` (ON DELETE CASCADE)
  - *Xóa recipe → tự động xóa tất cả ingredients*
  
- `recipe_ingredients.ingredient_id` → `ingredients.id` (ON DELETE CASCADE)

---

### 3. Meal Planning
```
auth.users
    ↓ (CASCADE)
meal_plans
    ↓ (CASCADE)
meal_plan_items
    ├─→ recipes (N:1, SET NULL)
    └─→ meal_categories (N:1, SET NULL)
```

**Foreign Keys:**
- `meal_plans.user_id` → `auth.users.id` (ON DELETE CASCADE)
  - *Xóa user → xóa toàn bộ meal plans*
  
- `meal_plan_items.meal_plan_id` → `meal_plans.id` (ON DELETE CASCADE)
  - *Xóa meal plan → xóa tất cả items*
  
- `meal_plan_items.recipe_id` → `recipes.id` (ON DELETE SET NULL)
  - *Xóa recipe → meal item vẫn tồn tại nhưng recipe_id = null*
  
- `meal_plan_items.meal_category_id` → `meal_categories.id` (ON DELETE SET NULL)

---

### 4. Nutrition Tracking
```
auth.users
    ↓ (CASCADE)
    ├─→ nutrition_logs
    │   ├─→ recipes (N:1, SET NULL)
    │   └─→ meal_categories (N:1, SET NULL)
    │
    ├─→ weight_logs
    │
    └─→ water_logs
```

**Foreign Keys:**
- `nutrition_logs.user_id` → `auth.users.id` (ON DELETE CASCADE)
- `nutrition_logs.recipe_id` → `recipes.id` (ON DELETE SET NULL)
- `nutrition_logs.meal_category_id` → `meal_categories.id` (ON DELETE SET NULL)
- `weight_logs.user_id` → `auth.users.id` (ON DELETE CASCADE)
- `water_logs.user_id` → `auth.users.id` (ON DELETE CASCADE)

---

### 5. Shopping Lists
```
auth.users
    ↓ (CASCADE)
shopping_lists
    ↓ (CASCADE)
shopping_items
```

**Foreign Keys:**
- `shopping_lists.user_id` → `auth.users.id` (ON DELETE CASCADE)
- `shopping_items.shopping_list_id` → `shopping_lists.id` (ON DELETE CASCADE)
  - *Xóa shopping list → tự động xóa tất cả items*

---

### 6. Subscription Management
```
auth.users
    ↓ (CASCADE)
user_subscriptions
    └─→ subscription_plans (N:1, SET NULL)
```

**Foreign Keys:**
- `user_subscriptions.user_id` → `auth.users.id` (ON DELETE CASCADE)
- `user_subscriptions.subscription_plan_id` → `subscription_plans.id` (ON DELETE SET NULL)

---

## 🔐 Row Level Security (RLS) Policies

### Nguyên tắc bảo mật:
1. **Users chỉ xem được dữ liệu của mình** (trừ public data)
2. **Admin có quyền xem tất cả** (qua security definer function)
3. **Public recipes** - Mọi người xem được
4. **Cascade deletes** - Đảm bảo dữ liệu nhất quán

### Ví dụ RLS Policy:
```sql
-- Users can view their own meal plans
CREATE POLICY "Users can view their own meal plans" 
ON meal_plans FOR SELECT 
USING (auth.uid() = user_id);

-- Users can view public recipes
CREATE POLICY "Users can view public recipes" 
ON recipes FOR SELECT 
USING (is_public = true OR auth.uid() = created_by);
```

---

## 💻 Frontend Implementation

### Sử dụng Foreign Keys trong Query

#### ✅ **ĐÚNG** - Join với foreign keys:
```typescript
// useRecipes.tsx
const { data, error } = await supabase
  .from('recipes')
  .select(`
    *,
    recipe_ingredients (
      id,
      quantity,
      unit,
      ingredients (
        id,
        name,
        calories_per_100g
      )
    ),
    profiles!recipes_created_by_fkey (
      id,
      full_name,
      avatar_url
    )
  `)
  .eq('id', recipeId)
  .single();
```

#### ❌ **SAI** - Không tận dụng relationships:
```typescript
// SAI - Phải fetch riêng rẽ nhiều lần
const recipe = await getRecipe(recipeId);
const ingredients = await getIngredients(recipeId);
const author = await getAuthor(recipe.created_by);
```

---

## 📝 Hooks với Foreign Key Relationships

### 1. useRecipes
```typescript
getRecipe(id) → 
  ├─ recipes.*
  ├─ recipe_ingredients → ingredients
  └─ profiles (creator info)

getPublicRecipes() →
  ├─ recipes.*
  ├─ profiles (creator)
  └─ recipe_ingredients count
```

### 2. useMealPlans
```typescript
getMealPlanEntries(mealPlanId) →
  ├─ meal_plan_items.*
  ├─ recipes (full details)
  │   └─ recipe_ingredients
  ├─ meal_categories
  └─ meal_plans (parent info)
```

### 3. useNutritionLogs
```typescript
getNutritionLogsByDate(date) →
  ├─ nutrition_logs.*
  ├─ recipes (if linked)
  └─ meal_categories
```

### 4. useShoppingLists
```typescript
getMyShoppingLists() →
  ├─ shopping_lists.*
  └─ shopping_items[]
```

### 5. useProfile
```typescript
getCompleteProfile() →
  ├─ profiles.*
  │   └─ user_roles
  ├─ health_profiles
  └─ weight_logs (10 recent)
```

---

## 🎯 Best Practices cho Đồ án

### 1. Luôn sử dụng JOIN thay vì multiple queries
```typescript
// ✅ TỐT - Một query duy nhất
const data = await supabase
  .from('meal_plans')
  .select('*, meal_plan_items(*, recipes(*))')
  .eq('id', planId);

// ❌ TỆ - Nhiều queries
const plan = await getPlan(planId);
const items = await getItems(planId);
const recipes = await Promise.all(
  items.map(item => getRecipe(item.recipe_id))
);
```

### 2. Sử dụng explicit foreign key names
```typescript
// Khi có nhiều foreign keys đến cùng table
profiles!recipes_created_by_fkey (full_name, avatar_url)
profiles!meal_plans_user_id_fkey (full_name, email)
```

### 3. Cascade Operations
- User xóa account → Tất cả data cá nhân bị xóa
- Recipe xóa → Ingredients relationships bị xóa
- Meal plan xóa → Items tự động xóa

### 4. NULL handling cho optional relationships
- `recipe_id` trong `nutrition_logs` có thể NULL (manual entry)
- `created_by` trong `recipes` có thể NULL (user deleted)

---

## 🔍 Testing Foreign Key Integrity

### Test Cases quan trọng:
1. ✅ Xóa user → Kiểm tra profiles, meal_plans, logs đều bị xóa
2. ✅ Xóa recipe → meal_plan_items vẫn tồn tại (recipe_id = null)
3. ✅ Xóa meal_plan → meal_plan_items tự động xóa
4. ✅ Public recipe → Mọi user xem được
5. ✅ Private recipe → Chỉ creator xem được

---

## 📚 References

- [Supabase Foreign Keys](https://supabase.com/docs/guides/database/tables#foreign-keys)
- [PostgreSQL Foreign Keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Ghi chú cho đồ án:**
- Database đã được thiết kế với tính toàn vẹn cao
- Tất cả relationships đều có foreign keys
- RLS policies đảm bảo data security
- Frontend hooks tận dụng đầy đủ joins
- Cascade operations tự động đảm bảo consistency
