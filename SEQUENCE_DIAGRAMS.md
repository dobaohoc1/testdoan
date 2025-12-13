# SEQUENCE DIAGRAMS - HỆ THỐNG THUCDONAI

## 1. TỔNG QUAN
Tài liệu này mô tả các Sequence Diagrams cho các use cases quan trọng trong hệ thống ThucdonAI.

---

## 2. DANH SÁCH SEQUENCE DIAGRAMS

### SD-001: Đăng ký tài khoản (User Registration)

**Actors:** Guest, System, Supabase Auth, Database

**Flow:**
```
Guest -> UI: Nhập thông tin đăng ký (email, password)
UI -> ValidationService: Validate input
ValidationService -> UI: Validation result
UI -> AuthService: signup(email, password)
AuthService -> Supabase Auth: createUser(email, password)
Supabase Auth -> AuthService: user created {userId}
AuthService -> Database: Trigger on_auth_user_created
Database -> HoSo: INSERT default profile
Database -> HoSoSucKhoe: INSERT default health profile
Database -> VaiTroNguoiDung: INSERT role='user'
Database -> GoiDangKyNguoiDung: INSERT free plan
Database -> Supabase Auth: Success
Supabase Auth -> AuthService: Success
AuthService -> UI: Registration successful
UI -> Guest: Show success message
UI -> Guest: Redirect to /dashboard
```

**Notes:**
- Trigger `on_auth_user_created` tự động tạo profile, health profile, role và free plan
- Email verification có thể được bật trong Supabase Auth settings

---

### SD-002: Đăng nhập (User Login)

**Actors:** Guest, System, Supabase Auth

**Flow:**
```
Guest -> UI: Nhập email và password
UI -> ValidationService: Validate credentials
ValidationService -> UI: Validation OK
UI -> AuthService: login(email, password)
AuthService -> Supabase Auth: signInWithPassword(email, password)
Supabase Auth -> AuthService: {session, user}
AuthService -> UI: Login successful
UI -> ProfileService: fetchProfile(userId)
ProfileService -> Database: SELECT from HoSo WHERE nguoidungid=userId
Database -> ProfileService: Profile data
ProfileService -> UI: Profile loaded
UI -> HealthProfileService: fetchHealthProfile(userId)
HealthProfileService -> Database: SELECT from HoSoSucKhoe WHERE nguoidungid=userId
Database -> HealthProfileService: Health profile data
HealthProfileService -> UI: Health profile loaded
UI -> RoleService: fetchUserRole(userId)
RoleService -> Database: SELECT from VaiTroNguoiDung WHERE nguoidungid=userId
Database -> RoleService: Role data
RoleService -> UI: Role loaded
UI -> Guest: Redirect to /dashboard
```

---

### SD-003: Tạo công thức nấu ăn (Create Recipe)

**Actors:** User, System, Database, RecipeAnalyzer (AI)

**Flow:**
```
User -> UI: Click "Tạo công thức mới"
UI -> User: Show RecipeForm
User -> UI: Nhập thông tin (tên, mô tả, độ khó, thời gian)
User -> UI: Upload ảnh đại diện
UI -> StorageService: uploadImage(file)
StorageService -> Supabase Storage: upload to bucket 'recipe-images'
Supabase Storage -> StorageService: {imageUrl}
StorageService -> UI: Image URL
User -> UI: Thêm nguyên liệu (select from NguyenLieu)
UI -> IngredientService: searchIngredients(keyword)
IngredientService -> Database: SELECT from NguyenLieu WHERE ten LIKE keyword
Database -> IngredientService: Ingredients list
IngredientService -> UI: Display ingredients
User -> UI: Chọn nguyên liệu + nhập số lượng, đơn vị
User -> UI: Nhập hướng dẫn (steps)
User -> UI: Chọn công khai/riêng tư
User -> UI: Click "Lưu"
UI -> RecipeService: createRecipe(recipeData)
RecipeService -> Database: INSERT into CongThuc
Database -> RecipeService: {recipeId}
RecipeService -> Database: INSERT into NguyenLieuCongThuc (multiple)
Database -> RecipeService: Success
RecipeService -> NutritionCalculator: calculateNutrition(ingredients)
NutritionCalculator -> RecipeService: {totalCalo, totalDam, totalCarb, totalChat}
RecipeService -> Database: UPDATE CongThuc SET nutrition values
Database -> RecipeService: Success
RecipeService -> UI: Recipe created {recipeId}
UI -> User: Show success toast
UI -> User: Redirect to /recipes/{recipeId}

alt: User wants AI analysis
    User -> UI: Click "Phân tích AI"
    UI -> RecipeAnalyzerService: analyzeRecipe(recipeId)
    RecipeAnalyzerService -> Database: SELECT recipe with ingredients
    Database -> RecipeAnalyzerService: Recipe data
    RecipeAnalyzerService -> EdgeFunction: POST /recipe-analyzer
    EdgeFunction -> OpenAI API: Analyze recipe nutrition
    OpenAI API -> EdgeFunction: Analysis result
    EdgeFunction -> RecipeAnalyzerService: {benefits, warnings, tips}
    RecipeAnalyzerService -> UI: Analysis result
    UI -> User: Display AI analysis
end
```

---

### SD-004: Tạo kế hoạch bữa ăn tự động bằng AI (AI Meal Plan Generation)

**Actors:** User, System, Database, MealPlanGenerator (AI)

**Flow:**
```
User -> UI: Click "Tạo kế hoạch tự động"
UI -> User: Show MealPlanForm
UI -> HealthProfileService: fetchHealthProfile(userId)
HealthProfileService -> Database: SELECT from HoSoSucKhoe
Database -> HealthProfileService: Health profile data
HealthProfileService -> UI: Display current profile
User -> UI: Nhập thông tin (tên, ngày bắt đầu, ngày kết thúc, mục tiêu calo)
User -> UI: Chọn preferences (optional)
User -> UI: Click "Tạo bằng AI"
UI -> MealPlanService: generateAIMealPlan(params)
MealPlanService -> Database: INSERT into KeHoachBuaAn
Database -> MealPlanService: {mealPlanId}
MealPlanService -> HealthProfileService: getHealthProfile(userId)
HealthProfileService -> Database: SELECT from HoSoSucKhoe
Database -> HealthProfileService: Health data
HealthProfileService -> MealPlanService: {height, weight, goals, allergies, restrictions}
MealPlanService -> RecipeService: getPublicRecipes()
RecipeService -> Database: SELECT from CongThuc WHERE congkhai=true
Database -> RecipeService: Public recipes
RecipeService -> MealPlanService: Recipes list
MealPlanService -> EdgeFunction: POST /meal-plan-generator
EdgeFunction -> AIService: Generate meal plan
EdgeFunction -> AIService: Send {profile, recipes, preferences, duration, targetCalo}
AIService -> EdgeFunction: {mealPlanItems: [{date, category, recipeId, servings}]}
EdgeFunction -> MealPlanService: AI generated plan
MealPlanService -> Database: INSERT into MonAnKeHoach (multiple)
Database -> MealPlanService: Success
MealPlanService -> UI: Meal plan created
UI -> User: Show success message
UI -> User: Redirect to /meal-plans/{mealPlanId}
UI -> MealPlanDetailService: fetchMealPlanDetails(mealPlanId)
MealPlanDetailService -> Database: SELECT meal plan with items, recipes
Database -> MealPlanDetailService: Full meal plan data
MealPlanDetailService -> UI: Display meal plan
UI -> User: Show generated meal plan calendar
```

---

### SD-005: Ghi nhận bữa ăn (Log Nutrition)

**Actors:** User, System, Database

**Flow:**
```
User -> UI: Navigate to /my-nutrition
UI -> NutritionLogService: fetchTodayLogs(userId, today)
NutritionLogService -> Database: SELECT from NhatKyDinhDuong WHERE nguoidungid=userId AND ngayghinhan=today
Database -> NutritionLogService: Today's logs
NutritionLogService -> UI: Display logs
User -> UI: Click "Thêm bữa ăn"
UI -> User: Show NutritionForm

alt: Log from recipe
    User -> UI: Select "Từ công thức"
    UI -> RecipeService: searchRecipes(keyword)
    RecipeService -> Database: SELECT from CongThuc WHERE (congkhai=true OR nguoitao=userId) AND ten LIKE keyword
    Database -> RecipeService: Recipes
    RecipeService -> UI: Display recipes
    User -> UI: Chọn công thức
    User -> UI: Nhập số khẩu phần
    User -> UI: Chọn danh mục (sáng/trưa/tối/snack)
    UI -> NutritionLogService: logFromRecipe(recipeId, servings, category, date)
    NutritionLogService -> RecipeService: getRecipe(recipeId)
    RecipeService -> Database: SELECT from CongThuc WHERE id=recipeId
    Database -> RecipeService: Recipe data {tongcalo, tongdam, tongcarb, tongchat, khauphan}
    RecipeService -> NutritionLogService: Recipe nutrition
    NutritionLogService -> NutritionCalculator: calculateForServings(nutrition, servings, originalServings)
    NutritionCalculator -> NutritionLogService: Adjusted nutrition
    NutritionLogService -> Database: INSERT into NhatKyDinhDuong
    Database -> NutritionLogService: Success
else: Log manual food
    User -> UI: Select "Thêm thủ công"
    User -> UI: Nhập tên thực phẩm
    User -> UI: Nhập số lượng, đơn vị
    User -> UI: Nhập calo, đạm, carb, chất béo
    User -> UI: Chọn danh mục
    UI -> NutritionLogService: logManualFood(foodData)
    NutritionLogService -> Database: INSERT into NhatKyDinhDuong
    Database -> NutritionLogService: Success
else: Log from food scanner (AI)
    User -> UI: Select "Quét thực phẩm"
    UI -> User: Open camera
    User -> UI: Chụp ảnh thực phẩm
    UI -> FoodScannerService: scanFood(image)
    FoodScannerService -> EdgeFunction: POST /food-scanner
    EdgeFunction -> AIService: Analyze food image
    AIService -> EdgeFunction: {foodName, estimatedCalo, estimatedDam, estimatedCarb, estimatedChat}
    EdgeFunction -> FoodScannerService: Scan result
    FoodScannerService -> UI: Display detected food
    User -> UI: Xác nhận hoặc chỉnh sửa
    User -> UI: Chọn danh mục
    UI -> NutritionLogService: logManualFood(scannedData)
    NutritionLogService -> Database: INSERT into NhatKyDinhDuong
    Database -> NutritionLogService: Success
end

NutritionLogService -> UI: Log created
UI -> User: Show success toast
UI -> NutritionLogService: fetchTodayLogs(userId, today)
NutritionLogService -> Database: SELECT today's logs
Database -> NutritionLogService: Updated logs
NutritionLogService -> NutritionCalculator: calculateDailySummary(logs)
NutritionCalculator -> NutritionLogService: {totalCalo, totalDam, totalCarb, totalChat}
NutritionLogService -> UI: Display updated summary
UI -> User: Show updated daily summary
```

---

### SD-006: Quét thực phẩm bằng AI (Food Scanner)

**Actors:** User, System, FoodScanner (AI), Database

**Flow:**
```
User -> UI: Navigate to /health-tools
UI -> User: Display health tools
User -> UI: Click "Food Scanner"
UI -> User: Show FoodScanner component
User -> UI: Click "Chụp ảnh" or "Tải ảnh lên"

alt: Take photo
    UI -> Camera: Open camera
    User -> Camera: Take photo
    Camera -> UI: Image captured
else: Upload image
    User -> UI: Select image file
    UI -> UI: Image selected
end

UI -> User: Preview image
User -> UI: Click "Phân tích"
UI -> FoodScannerService: scanFood(imageFile)
FoodScannerService -> StorageService: uploadTemp(imageFile)
StorageService -> Supabase Storage: upload to 'temp-food-scans'
Supabase Storage -> StorageService: {tempImageUrl}
StorageService -> FoodScannerService: Image URL
FoodScannerService -> EdgeFunction: POST /food-scanner {imageUrl}
EdgeFunction -> OpenAI Vision API: Analyze food image
OpenAI Vision API -> EdgeFunction: {foodName, description, confidence}
EdgeFunction -> EdgeFunction: Estimate nutrition based on food type
EdgeFunction -> FoodScannerService: {
    foodName, 
    description, 
    estimatedCalo, 
    estimatedDam, 
    estimatedCarb, 
    estimatedChat,
    confidence,
    suggestions
}
FoodScannerService -> UI: Scan result
UI -> User: Display food analysis

User -> UI: Review result
alt: Save to nutrition log
    User -> UI: Click "Lưu vào nhật ký"
    UI -> User: Show save dialog (choose category, adjust values)
    User -> UI: Confirm save
    UI -> NutritionLogService: logManualFood(scanData)
    NutritionLogService -> Database: INSERT into NhatKyDinhDuong
    Database -> NutritionLogService: Success
    NutritionLogService -> UI: Saved
    UI -> User: Show success message
    UI -> User: Redirect to /my-nutrition
else: Scan another food
    User -> UI: Click "Quét lại"
    UI -> User: Reset scanner
end
```

---

### SD-007: Tính toán BMI và nhận tư vấn (BMI Calculator & AI Advisor)

**Actors:** User, System, Database, NutritionAdvisor (AI)

**Flow:**
```
User -> UI: Navigate to /health-tools
UI -> User: Display health tools
User -> UI: Click "BMI Calculator"
UI -> BMICalculatorComponent: Render
BMICalculatorComponent -> HealthProfileService: fetchHealthProfile(userId)
HealthProfileService -> Database: SELECT from HoSoSucKhoe WHERE nguoidungid=userId
Database -> HealthProfileService: {chieucao, cannang}
HealthProfileService -> BMICalculatorComponent: Pre-fill height & weight

User -> UI: Enter/adjust height (cm)
User -> UI: Enter/adjust weight (kg)
User -> UI: Click "Tính BMI"
UI -> BMICalculator: calculateBMI(height, weight)
BMICalculator -> UI: {bmi, category, status}
UI -> User: Display BMI result

alt: User wants AI advice
    User -> UI: Click "Nhận tư vấn AI"
    UI -> NutritionAdvisorService: getAdvice(userId, bmi)
    NutritionAdvisorService -> HealthProfileService: fetchFullProfile(userId)
    HealthProfileService -> Database: SELECT from HoSoSucKhoe
    Database -> HealthProfileService: Full health profile
    HealthProfileService -> NutritionAdvisorService: Profile data
    NutritionAdvisorService -> TDEECalculator: calculateTDEE(profile)
    TDEECalculator -> NutritionAdvisorService: {bmr, tdee, recommendedCalo}
    NutritionAdvisorService -> EdgeFunction: POST /nutrition-advisor
    EdgeFunction -> AIService: Get personalized advice
    EdgeFunction -> AIService: Send {profile, bmi, tdee, goals, restrictions}
    AIService -> EdgeFunction: {
        analysis,
        recommendations,
        calorieTarget,
        macroBreakdown,
        exerciseSuggestions,
        warnings
    }
    EdgeFunction -> NutritionAdvisorService: AI advice
    NutritionAdvisorService -> UI: Display advice
    UI -> User: Show AI recommendations
    
    alt: User wants to update goals
        User -> UI: Click "Cập nhật mục tiêu"
        UI -> User: Redirect to /profile (health section)
    end
end

alt: User wants to save current weight
    User -> UI: Click "Lưu cân nặng hiện tại"
    UI -> WeightLogService: logWeight(weight, note)
    WeightLogService -> Database: INSERT into NhatKyCanNang
    Database -> WeightLogService: Success
    WeightLogService -> HealthProfileService: updateWeight(userId, weight)
    HealthProfileService -> Database: UPDATE HoSoSucKhoe SET cannang=weight
    Database -> HealthProfileService: Success
    HealthProfileService -> UI: Weight updated
    UI -> User: Show success message
end
```

---

### SD-008: Chat với AI Nutrition Bot

**Actors:** User, System, NutritionChatbot (AI), Database

**Flow:**
```
User -> UI: Navigate to /dashboard or any page
User -> UI: Click chatbot icon
UI -> User: Open ChatBot component
UI -> ChatbotService: initializeSession(userId)
ChatbotService -> HealthProfileService: fetchHealthProfile(userId)
HealthProfileService -> Database: SELECT from HoSoSucKhoe WHERE nguoidungid=userId
Database -> HealthProfileService: Health profile
HealthProfileService -> ChatbotService: Profile context
ChatbotService -> UI: Chatbot ready

User -> UI: Type message "Tôi nên ăn gì để giảm cân?"
User -> UI: Click send
UI -> ChatbotService: sendMessage(message, userId)
ChatbotService -> EdgeFunction: POST /nutrition-chatbot
EdgeFunction -> EdgeFunction: Load conversation context
EdgeFunction -> HealthProfileService: getHealthContext(userId)
HealthProfileService -> Database: SELECT profile, recent nutrition logs
Database -> HealthProfileService: User context
HealthProfileService -> EdgeFunction: Context data
EdgeFunction -> OpenAI API: Chat completion
EdgeFunction -> OpenAI API: Send {message, context, profile, conversationHistory}
OpenAI API -> EdgeFunction: AI response
EdgeFunction -> ChatbotService: {reply, suggestions}
ChatbotService -> UI: Display AI message
UI -> User: Show AI response

loop: Conversation continues
    User -> UI: Type follow-up question
    User -> UI: Click send
    UI -> ChatbotService: sendMessage(message, userId)
    ChatbotService -> EdgeFunction: POST /nutrition-chatbot
    EdgeFunction -> OpenAI API: Chat completion (with history)
    OpenAI API -> EdgeFunction: AI response
    EdgeFunction -> ChatbotService: Reply
    ChatbotService -> UI: Display message
    UI -> User: Show response
end

alt: AI suggests creating a meal plan
    ChatbotService -> UI: Show "Tạo kế hoạch" button
    User -> UI: Click button
    UI -> User: Redirect to /create-meal-plan (pre-filled with AI suggestions)
end

alt: AI suggests logging food
    ChatbotService -> UI: Show "Ghi nhận bữa ăn" button
    User -> UI: Click button
    UI -> User: Redirect to /my-nutrition (with suggested food pre-filled)
end

User -> UI: Close chatbot
UI -> ChatbotService: endSession()
ChatbotService -> UI: Session ended
```

---

### SD-009: Quản lý danh sách mua sắm (Shopping List Management)

**Actors:** User, System, Database

**Flow:**
```
User -> UI: Navigate to /shopping-list
UI -> ShoppingListService: fetchShoppingLists(userId)
ShoppingListService -> Database: SELECT from DanhSachMuaSam WHERE nguoidungid=userId
Database -> ShoppingListService: Shopping lists
ShoppingListService -> UI: Display lists

alt: Create new list
    User -> UI: Click "Tạo danh sách mới"
    UI -> User: Show create form
    User -> UI: Enter list name
    User -> UI: Click "Tạo"
    UI -> ShoppingListService: createList(name, userId)
    ShoppingListService -> Database: INSERT into DanhSachMuaSam
    Database -> ShoppingListService: {listId}
    ShoppingListService -> UI: List created
    UI -> User: Show new list
end

User -> UI: Select a shopping list
UI -> ShoppingListService: fetchListItems(listId)
ShoppingListService -> Database: SELECT from MonMuaSam WHERE danhsachid=listId
Database -> ShoppingListService: Items
ShoppingListService -> UI: Display items

alt: Add item manually
    User -> UI: Click "Thêm món"
    UI -> User: Show add form
    User -> UI: Enter ingredient name, quantity, unit
    User -> UI: Click "Thêm"
    UI -> ShoppingListService: addItem(listId, itemData)
    ShoppingListService -> Database: INSERT into MonMuaSam
    Database -> ShoppingListService: Success
    ShoppingListService -> UI: Item added
    UI -> User: Update list display
end

alt: Add items from recipe
    User -> UI: Click "Thêm từ công thức"
    UI -> RecipeService: searchRecipes(keyword)
    RecipeService -> Database: SELECT from CongThuc
    Database -> RecipeService: Recipes
    RecipeService -> UI: Display recipes
    User -> UI: Select recipe
    UI -> RecipeService: getRecipeIngredients(recipeId)
    RecipeService -> Database: SELECT from NguyenLieuCongThuc WHERE congthucid=recipeId
    Database -> RecipeService: Ingredients with quantities
    RecipeService -> UI: Show ingredients
    User -> UI: Select ingredients to add
    User -> UI: Adjust quantities (optional)
    User -> UI: Click "Thêm vào danh sách"
    UI -> ShoppingListService: addMultipleItems(listId, items)
    ShoppingListService -> Database: INSERT into MonMuaSam (multiple)
    Database -> ShoppingListService: Success
    ShoppingListService -> UI: Items added
    UI -> User: Update list display
end

User -> UI: Check off item as purchased
UI -> ShoppingListService: markAsPurchased(itemId)
ShoppingListService -> Database: UPDATE MonMuaSam SET damua=true WHERE id=itemId
Database -> ShoppingListService: Success
ShoppingListService -> UI: Item marked
UI -> User: Update visual (strikethrough)

User -> UI: Delete item
UI -> ShoppingListService: deleteItem(itemId)
ShoppingListService -> Database: DELETE from MonMuaSam WHERE id=itemId
Database -> ShoppingListService: Success
ShoppingListService -> UI: Item deleted
UI -> User: Update list display

User -> UI: Delete entire list
UI -> User: Show confirmation dialog
User -> UI: Confirm delete
UI -> ShoppingListService: deleteList(listId)
ShoppingListService -> Database: DELETE from DanhSachMuaSam WHERE id=listId
Database -> Database: Cascade delete MonMuaSam items
Database -> ShoppingListService: Success
ShoppingListService -> UI: List deleted
UI -> User: Redirect to shopping lists page
```

---

### SD-010: Admin quản lý người dùng (Admin User Management)

**Actors:** Admin, System, Database

**Flow:**
```
Admin -> UI: Navigate to /admin
UI -> RoleService: checkUserRole(adminId)
RoleService -> Database: SELECT from VaiTroNguoiDung WHERE nguoidungid=adminId
Database -> RoleService: {vaitro: 'admin'}
RoleService -> UI: Role verified

alt: Not admin
    RoleService -> UI: Unauthorized
    UI -> Admin: Redirect to /dashboard
end

UI -> User: Show AdminDashboard
Admin -> UI: Click "Quản lý người dùng"
UI -> EdgeFunction: POST /user-management (action: 'list')
EdgeFunction -> Database: SELECT auth.users with profiles
Database -> EdgeFunction: Users list
EdgeFunction -> UI: Users data
UI -> Admin: Display users table

alt: View user details
    Admin -> UI: Click on user
    UI -> EdgeFunction: POST /user-management (action: 'get', userId)
    EdgeFunction -> Database: SELECT user, profile, health profile, role, subscription
    Database -> EdgeFunction: Full user data
    EdgeFunction -> UI: User details
    UI -> Admin: Display user details modal
end

alt: Change user role
    Admin -> UI: Click "Thay đổi vai trò"
    UI -> Admin: Show role selection
    Admin -> UI: Select role (admin/user)
    Admin -> UI: Click "Cập nhật"
    UI -> EdgeFunction: POST /user-management (action: 'updateRole', userId, newRole)
    EdgeFunction -> Database: UPDATE VaiTroNguoiDung SET vaitro=newRole
    Database -> EdgeFunction: Success
    EdgeFunction -> UI: Role updated
    UI -> Admin: Show success message
    UI -> Admin: Update display
end

alt: Reset user password
    Admin -> UI: Click "Reset mật khẩu"
    UI -> Admin: Show confirmation
    Admin -> UI: Confirm reset
    UI -> EdgeFunction: POST /reset-password (userId, isAdmin: true)
    EdgeFunction -> Supabase Auth: generatePasswordResetLink(email)
    Supabase Auth -> EdgeFunction: Reset link
    EdgeFunction -> EmailService: sendPasswordResetEmail(email, link)
    EmailService -> EdgeFunction: Email sent
    EdgeFunction -> UI: Password reset initiated
    UI -> Admin: Show success message
end

alt: Delete user (soft delete or disable)
    Admin -> UI: Click "Vô hiệu hóa tài khoản"
    UI -> Admin: Show warning dialog
    Admin -> UI: Confirm action
    UI -> EdgeFunction: POST /user-management (action: 'disable', userId)
    EdgeFunction -> Supabase Auth: updateUser(userId, {disabled: true})
    Supabase Auth -> EdgeFunction: User disabled
    EdgeFunction -> UI: User disabled
    UI -> Admin: Show success message
    UI -> Admin: Update user list
end
```

---

## 3. NOTES CHO VẼ SEQUENCE DIAGRAMS

### 3.1 Ký hiệu
- `->` : Synchronous message (gọi và chờ response)
- `-->` : Return message (response)
- `alt` : Alternative path (if-else)
- `loop` : Lặp lại
- `opt` : Optional path
- `par` : Parallel execution

### 3.2 Actors
- **User**: Người dùng đã đăng nhập
- **Guest**: Người dùng chưa đăng nhập
- **Admin**: Quản trị viên
- **System**: Hệ thống
- **UI**: User Interface (React components)
- **Database**: Supabase PostgreSQL
- **Supabase Auth**: Authentication service
- **EdgeFunction**: Supabase Edge Functions
- **AIService**: OpenAI API hoặc Lovable AI Gateway

### 3.3 Services
- **AuthService**: Xử lý authentication
- **ProfileService**: Quản lý profile
- **HealthProfileService**: Quản lý health profile
- **RecipeService**: Quản lý recipes
- **MealPlanService**: Quản lý meal plans
- **NutritionLogService**: Quản lý nutrition logs
- **FoodScannerService**: AI food scanning
- **RecipeAnalyzerService**: AI recipe analysis
- **MealPlanGeneratorService**: AI meal plan generation
- **ChatbotService**: AI chatbot
- **ShoppingListService**: Quản lý shopping lists
- **ValidationService**: Input validation

### 3.4 Timing
- Authentication: ~500-1000ms
- Database queries: ~100-300ms
- AI calls (OpenAI): ~2-5 seconds
- Image upload: ~1-3 seconds
- File processing: ~500-2000ms

### 3.5 Error Handling
Mỗi sequence nên bao gồm error handling paths:
- Network errors
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- AI service errors
