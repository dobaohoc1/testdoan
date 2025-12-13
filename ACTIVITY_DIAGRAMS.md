# ACTIVITY DIAGRAMS - HỆ THỐNG THUCDONAI

## 1. TỔNG QUAN
Tài liệu này mô tả các Activity Diagrams cho các business processes quan trọng trong hệ thống ThucdonAI.

---

## 2. DANH SÁCH ACTIVITY DIAGRAMS

### AD-001: Quy trình đăng ký và thiết lập tài khoản (User Registration & Onboarding)

**Swimlanes:** Guest, UI System, Auth System, Database

```
[Guest]
  |
  v
(Start) Truy cập trang đăng ký
  |
  v
Nhập email và password
  |
  v
Click "Đăng ký"
  |
  |----> [UI System]
         |
         v
       Validate input
         |
         v
       <Decision: Valid?>
         |
         |--[No]--> Show validation errors --> [Guest]
         |
         |--[Yes]
         v
       Send to Auth System
         |
         |----> [Auth System]
                |
                v
              Check email exists
                |
                v
              <Decision: Email exists?>
                |
                |--[Yes]--> Return error --> [UI System] --> Show error --> [Guest]
                |
                |--[No]
                v
              Create user account
                |
                v
              Generate userId
                |
                |----> [Database]
                       |
                       v
                     Insert into auth.users
                       |
                       v
                     Trigger: on_auth_user_created
                       |
                       v
                     <Parallel>
                       |
                       |---> Create HoSo (default profile)
                       |
                       |---> Create HoSoSucKhoe (default health profile)
                       |
                       |---> Create VaiTroNguoiDung (role='user')
                       |
                       |---> Create GoiDangKyNguoiDung (free plan)
                       |
                     </Parallel>
                       |
                       v
                     Return success
                       |
         <------------|
         |
         v
       [UI System]
         |
         v
       Show success message
         |
         v
       Redirect to Dashboard
         |
         v
       [Guest now User]
         |
         v
       View welcome page
         |
         v
       <Decision: Complete profile?>
         |
         |--[Yes]--> Navigate to Profile page
         |              |
         |              v
         |            Fill profile information
         |              |
         |              v
         |            Save profile
         |              |
         |              v
         |            Navigate to Health Profile
         |              |
         |              v
         |            Fill health information
         |              |
         |              v
         |            Save health profile
         |              |
         |              v
         |            Calculate BMI & TDEE
         |              |
         |              v
         |            Show personalized recommendations
         |
         |--[Skip]--> Navigate to Dashboard
         |
         v
       (End) Account ready
```

---

### AD-002: Quy trình tạo công thức nấu ăn (Recipe Creation Process)

**Swimlanes:** User, UI System, Recipe Service, Database, AI Service

```
[User]
  |
  v
(Start) Click "Tạo công thức mới"
  |
  |----> [UI System]
         |
         v
       Show RecipeForm (empty)
         |
  <------|
  |
  v
Enter recipe name
  |
  v
Enter description
  |
  v
<Decision: Upload image?>
  |
  |--[Yes]--> Select image file
  |              |
  |              |----> [UI System]
  |                     |
  |                     v
  |                   Upload to Storage
  |                     |
  |                     v
  |                   Get image URL
  |                     |
  |              <------|
  |
  |--[No]--> Skip
  |
  v
Select difficulty level
  |
  v
Enter prep time
  |
  v
Enter cooking time
  |
  v
Enter servings
  |
  v
(Activity) Add ingredients
  |
  v
<Loop: For each ingredient>
  |
  v
Search ingredient by name
  |
  |----> [UI System]
         |
         v
       Query NguyenLieu database
         |
         |----> [Database]
                |
                v
              Return matching ingredients
                |
         <------|
         |
         v
       Show ingredient list
         |
  <------|
  |
  v
Select ingredient
  |
  v
Enter quantity
  |
  v
Select unit
  |
  v
Add to recipe
  |
  v
<Decision: Add more ingredients?>
  |
  |--[Yes]--> Loop back
  |
  |--[No]
  v
</Loop>
  |
  v
(Activity) Add cooking instructions
  |
  v
<Loop: For each step>
  |
  v
Enter step description
  |
  v
<Decision: Add more steps?>
  |
  |--[Yes]--> Loop back
  |
  |--[No]
  v
</Loop>
  |
  v
Select visibility (Public/Private)
  |
  v
Click "Lưu công thức"
  |
  |----> [UI System]
         |
         v
       Validate form
         |
         v
       <Decision: Valid?>
         |
         |--[No]--> Show errors --> [User]
         |
         |--[Yes]
         v
       Send to Recipe Service
         |
         |----> [Recipe Service]
                |
                v
              Insert CongThuc record
                |
                |----> [Database]
                       |
                       v
                     Get recipeId
                       |
                <------|
                |
                v
              Insert NguyenLieuCongThuc records
                |
                |----> [Database]
                       |
                       v
                     Success
                       |
                <------|
                |
                v
              Calculate total nutrition
                |
                v
              <Parallel>
                |
                |---> Sum calories
                |
                |---> Sum protein
                |
                |---> Sum carbs
                |
                |---> Sum fat
                |
              </Parallel>
                |
                v
              Update CongThuc nutrition values
                |
                |----> [Database]
                       |
                       v
                     Success
                       |
                <------|
                |
                v
              Return success
                |
         <------|
         |
         v
       [UI System]
         |
         v
       Show success toast
         |
         v
       Redirect to recipe detail page
         |
  <------|
  |
  v
[User] View created recipe
  |
  v
<Decision: Want AI analysis?>
  |
  |--[No]--> (End)
  |
  |--[Yes]
  v
Click "Phân tích AI"
  |
  |----> [UI System]
         |
         v
       Show loading
         |
         v
       Call AI Service
         |
         |----> [AI Service]
                |
                v
              Get recipe data
                |
                v
              Call OpenAI API
                |
                v
              Generate analysis
                |
                v
              Return {benefits, warnings, tips}
                |
         <------|
         |
         v
       Display AI analysis
         |
  <------|
  |
  v
[User] Review AI feedback
  |
  v
(End) Recipe created successfully
```

---

### AD-003: Quy trình tạo kế hoạch bữa ăn tự động (AI Meal Plan Generation)

**Swimlanes:** User, UI System, Meal Plan Service, AI Service, Database

```
[User]
  |
  v
(Start) Click "Tạo kế hoạch tự động"
  |
  |----> [UI System]
         |
         v
       Fetch user health profile
         |
         |----> [Database]
                |
                v
              Return profile data
                |
         <------|
         |
         v
       Show MealPlanForm (pre-filled)
         |
  <------|
  |
  v
Review/Edit plan name
  |
  v
Select start date
  |
  v
Select end date
  |
  v
Review/Edit target calories
  |
  v
<Decision: Adjust preferences?>
  |
  |--[Yes]--> Select dietary restrictions
  |              |
  |              v
  |            Select allergies
  |              |
  |              v
  |            Select meal categories to include
  |
  |--[No]--> Use defaults from profile
  |
  v
Click "Tạo bằng AI"
  |
  |----> [UI System]
         |
         v
       Show loading indicator
         |
         v
       Send to Meal Plan Service
         |
         |----> [Meal Plan Service]
                |
                v
              Create KeHoachBuaAn record
                |
                |----> [Database]
                       |
                       v
                     Insert meal plan
                       |
                       v
                     Get mealPlanId
                       |
                <------|
                |
                v
              Gather data for AI
                |
                v
              <Parallel>
                |
                |---> Fetch health profile
                |        |
                |        |----> [Database]
                |
                |---> Fetch available recipes
                |        |
                |        |----> [Database]
                |
                |---> Calculate number of days
                |
                |---> Calculate meals per day
                |
              </Parallel>
                |
                v
              Prepare AI request
                |
                v
              Call AI Service
                |
                |----> [AI Service]
                       |
                       v
                     Analyze user profile
                       |
                       v
                     Consider restrictions & allergies
                       |
                       v
                     Select suitable recipes
                       |
                       v
                     Distribute across days
                       |
                       v
                     Balance nutrition
                       |
                       v
                     Optimize for target calories
                       |
                       v
                     Generate meal plan
                       |
                       v
                     Return {mealPlanItems: [...]}
                       |
                <------|
                |
                v
              [Meal Plan Service]
                |
                v
              <Loop: For each meal item>
                |
                v
              Insert MonAnKeHoach
                |
                |----> [Database]
                       |
                       v
                     Success
                       |
                <------|
                |
              </Loop>
                |
                v
              Calculate plan statistics
                |
                v
              Return success
                |
         <------|
         |
         v
       [UI System]
         |
         v
       Show success message
         |
         v
       Redirect to meal plan detail
         |
  <------|
  |
  v
[User] Review generated plan
  |
  v
<Decision: Satisfied with plan?>
  |
  |--[No]--> <Decision: Regenerate or Edit?>
  |              |
  |              |--[Regenerate]--> Delete plan --> Start over
  |              |
  |              |--[Edit]--> (Activity) Manual editing
  |                            |
  |                            v
  |                          Select day
  |                            |
  |                            v
  |                          Select meal
  |                            |
  |                            v
  |                          <Decision: Replace or Remove?>
  |                            |
  |                            |--[Replace]--> Search recipe
  |                            |                  |
  |                            |                  v
  |                            |                Select new recipe
  |                            |                  |
  |                            |                  v
  |                            |                Update MonAnKeHoach
  |                            |
  |                            |--[Remove]--> Delete MonAnKeHoach
  |                            |
  |                            v
  |                          Save changes
  |
  |--[Yes]
  v
<Decision: Activate plan?>
  |
  |--[Yes]--> Set danghoatdong=true
  |              |
  |              v
  |            Deactivate other plans (optional)
  |
  |--[No]--> Keep as draft
  |
  v
(End) Meal plan ready
```

---

### AD-004: Quy trình ghi nhận và theo dõi dinh dưỡng hàng ngày (Daily Nutrition Tracking)

**Swimlanes:** User, UI System, Database, AI Service

```
[User]
  |
  v
(Start) Navigate to Nutrition Tracking
  |
  |----> [UI System]
         |
         v
       Fetch today's logs
         |
         |----> [Database]
                |
                v
              SELECT from NhatKyDinhDuong (today)
                |
                v
              Return logs
                |
         <------|
         |
         v
       Calculate daily summary
         |
         v
       Display current status
         |
  <------|
  |
  v
Review today's nutrition
  |
  v
<Decision: Add meal?>
  |
  |--[No]--> <Decision: View history?>
  |              |
  |              |--[Yes]--> View past days --> (End)
  |              |
  |              |--[No]--> (End)
  |
  |--[Yes]
  v
Click "Add Meal"
  |
  |----> [UI System]
         |
         v
       Show meal input options
         |
  <------|
  |
  v
<Decision: Input method?>
  |
  |
  |--[From Recipe]
  |   |
  |   v
  | Search recipe
  |   |
  |   |----> [Database]
  |          |
  |          v
  |        Return matching recipes
  |          |
  |   <------|
  |   |
  |   v
  | Select recipe
  |   |
  |   v
  | Enter servings
  |   |
  |   v
  | Select meal category (Breakfast/Lunch/Dinner/Snack)
  |   |
  |   |----> [UI System]
  |          |
  |          v
  |        Calculate nutrition (servings × recipe nutrition)
  |          |
  |          v
  |        Insert into NhatKyDinhDuong
  |          |
  |          |----> [Database]
  |                 |
  |                 v
  |               Success
  |                 |
  |          <------|
  |
  |--[Manual Entry]
  |   |
  |   v
  | Enter food name
  |   |
  |   v
  | Enter quantity & unit
  |   |
  |   v
  | Enter nutrition values (calories, protein, carbs, fat)
  |   |
  |   v
  | Select meal category
  |   |
  |   |----> [UI System]
  |          |
  |          v
  |        Insert into NhatKyDinhDuong
  |          |
  |          |----> [Database]
  |                 |
  |                 v
  |               Success
  |                 |
  |          <------|
  |
  |--[Food Scanner (AI)]
      |
      v
    Open camera
      |
      v
    Take photo of food
      |
      v
    <Decision: Good photo?>
      |
      |--[No]--> Retake
      |
      |--[Yes]
      v
    Click "Analyze"
      |
      |----> [UI System]
             |
             v
           Upload image
             |
             v
           Call AI Service
             |
             |----> [AI Service]
                    |
                    v
                  Analyze image (OpenAI Vision)
                    |
                    v
                  Identify food
                    |
                    v
                  Estimate nutrition
                    |
                    v
                  Return {foodName, nutrition, confidence}
                    |
             <------|
             |
             v
           [UI System]
             |
             v
           Display detected food
             |
      <------|
      |
      v
    Review/Edit detected values
      |
      v
    Select meal category
      |
      v
    Confirm save
      |
      |----> [UI System]
             |
             v
           Insert into NhatKyDinhDuong
             |
             |----> [Database]
                    |
                    v
                  Success
                    |
             <------|
  |
  v
[UI System]
  |
  v
Refresh today's logs
  |
  |----> [Database]
         |
         v
       Fetch updated logs
         |
  <------|
  |
  v
Recalculate daily summary
  |
  v
Update display
  |
  v
<Parallel>
  |
  |---> Update calorie progress bar
  |
  |---> Update macro breakdown chart
  |
  |---> Update meal category distribution
  |
</Parallel>
  |
  v
Check against daily goals
  |
  v
<Decision: Exceeded target?>
  |
  |--[Yes]--> Show warning notification
  |
  |--[No]--> <Decision: Met target?>
                |
                |--[Yes]--> Show success notification
                |
                |--[No]--> Show progress
  |
  v
[User] View updated summary
  |
  v
<Decision: Need AI advice?>
  |
  |--[Yes]--> Open Nutrition Chatbot
  |              |
  |              v
  |            Ask AI about today's nutrition
  |              |
  |              v
  |            Receive personalized feedback
  |
  |--[No]
  v
<Decision: Log more meals?>
  |
  |--[Yes]--> Loop back to "Add meal?"
  |
  |--[No]
  v
(End) Nutrition logged for today
```

---

### AD-005: Quy trình quản lý cân nặng (Weight Management Process)

**Swimlanes:** User, UI System, Database, Calculator Service

```
[User]
  |
  v
(Start) Navigate to Weight Tracking
  |
  |----> [UI System]
         |
         v
       Fetch weight history
         |
         |----> [Database]
                |
                v
              SELECT from NhatKyCanNang (last 30 days)
                |
                v
              Return weight logs
                |
         <------|
         |
         v
       Fetch health profile
         |
         |----> [Database]
                |
                v
              SELECT from HoSoSucKhoe
                |
                v
              Return {chieucao, cannang, muctieusuckhoe}
                |
         <------|
         |
         v
       Generate weight chart
         |
         v
       Calculate statistics
         |
         |----> [Calculator Service]
                |
                v
              Calculate current BMI
                |
                v
              Calculate average weight (7 days)
                |
                v
              Calculate trend (gaining/losing/stable)
                |
                v
              Calculate progress toward goal
                |
                v
              Return statistics
                |
         <------|
         |
         v
       Display dashboard
         |
  <------|
  |
  v
[User] Review weight history & trends
  |
  v
<Decision: Log new weight?>
  |
  |--[No]--> <Decision: View detailed history?>
  |              |
  |              |--[Yes]--> View all records --> (End)
  |              |
  |              |--[No]--> (End)
  |
  |--[Yes]
  v
Click "Log Weight"
  |
  |----> [UI System]
         |
         v
       Show weight input form
         |
  <------|
  |
  v
Enter current weight (kg)
  |
  v
<Decision: Add note?>
  |
  |--[Yes]--> Enter note (e.g., "After breakfast", "Morning")
  |
  |--[No]--> Skip
  |
  v
Click "Save"
  |
  |----> [UI System]
         |
         v
       Validate input
         |
         v
       <Decision: Valid?>
         |
         |--[No]--> Show error --> [User]
         |
         |--[Yes]
         v
       Insert weight log
         |
         |----> [Database]
                |
                v
              INSERT into NhatKyCanNang
                |
                v
              Success
                |
         <------|
         |
         v
       Update health profile
         |
         |----> [Database]
                |
                v
              UPDATE HoSoSucKhoe SET cannang=newWeight
                |
                v
              Success
                |
         <------|
         |
         v
       Recalculate statistics
         |
         |----> [Calculator Service]
                |
                v
              Calculate new BMI
                |
                v
              Recalculate trends
                |
                v
              Check goal progress
                |
                v
              Return updated stats
                |
         <------|
         |
         v
       Refresh display
         |
         v
       Show success notification
         |
  <------|
  |
  v
[User] View updated weight chart
  |
  v
<Parallel>
  |
  |---> View BMI indicator
  |
  |---> View weight trend line
  |
  |---> View goal progress
  |
</Parallel>
  |
  v
<Decision: Significant change detected?>
  |
  |--[Yes]--> [UI System]
  |              |
  |              v
  |            Show milestone notification
  |              |
  |              v
  |            <Decision: Milestone type?>
  |              |
  |              |--[Goal achieved]--> Show congratulations
  |              |
  |              |--[Rapid change]--> Show health warning
  |              |
  |              |--[Progress milestone]--> Show encouragement
  |              |
  |              v
  |            [User] Acknowledge notification
  |
  |--[No]--> Continue
  |
  v
<Decision: Want recommendations?>
  |
  |--[Yes]--> Navigate to Health Tools
  |              |
  |              v
  |            Calculate BMI
  |              |
  |              v
  |            Get AI nutrition advice
  |              |
  |              v
  |            View personalized recommendations
  |
  |--[No]
  v
(End) Weight logged successfully
```

---

### AD-006: Quy trình admin quản lý hệ thống (Admin System Management)

**Swimlanes:** Admin, UI System, Database, Auth Service, Email Service

```
[Admin]
  |
  v
(Start) Login as admin
  |
  |----> [Auth Service]
         |
         v
       Verify credentials
         |
         v
       Check role in VaiTroNguoiDung
         |
         |----> [Database]
                |
                v
              SELECT vaitro WHERE nguoidungid=adminId
                |
                v
              <Decision: vaitro='admin'?>
                |
                |--[No]--> Return unauthorized
                |            |
                |            v
                |          [UI System]
                |            |
                |            v
                |          Redirect to /dashboard
                |            |
                |            v
                |          (End) Access denied
                |
                |--[Yes]
                v
              Return authorized
                |
         <------|
         |
         v
       [UI System]
         |
         v
       Show AdminDashboard
         |
  <------|
  |
  v
View admin menu
  |
  v
<Decision: Admin task?>
  |
  |
  |--[User Management]
  |   |
  |   v
  | View users list
  |   |
  |   |----> [Database]
  |          |
  |          v
  |        Fetch all users with profiles, roles, subscriptions
  |          |
  |   <------|
  |   |
  |   v
  | <Decision: User action?>
  |   |
  |   |--[View Details]
  |   |   |
  |   |   v
  |   | Select user
  |   |   |
  |   |   v
  |   | View full user information
  |   |
  |   |--[Change Role]
  |   |   |
  |   |   v
  |   | Select user
  |   |   |
  |   |   v
  |   | Choose new role (admin/user)
  |   |   |
  |   |   v
  |   | Confirm change
  |   |   |
  |   |   |----> [Database]
  |   |          |
  |   |          v
  |   |        UPDATE VaiTroNguoiDung
  |   |          |
  |   |          v
  |   |        Success
  |   |          |
  |   |   <------|
  |   |   |
  |   |   v
  |   | Show success message
  |   |
  |   |--[Reset Password]
  |   |   |
  |   |   v
  |   | Select user
  |   |   |
  |   |   v
  |   | Confirm reset
  |   |   |
  |   |   |----> [Auth Service]
  |   |          |
  |   |          v
  |   |        Generate reset link
  |   |          |
  |   |          v
  |   |        [Email Service]
  |   |          |
  |   |          v
  |   |        Send reset email
  |   |          |
  |   |          v
  |   |        Success
  |   |          |
  |   |   <------|
  |   |   |
  |   |   v
  |   | Show confirmation
  |   |
  |   |--[Disable Account]
  |       |
  |       v
  |     Select user
  |       |
  |       v
  |     Confirm disable
  |       |
  |       |----> [Auth Service]
  |              |
  |              v
  |            Disable user
  |              |
  |              v
  |            Success
  |              |
  |       <------|
  |       |
  |       v
  |     Update UI
  |
  |--[Ingredient Management]
  |   |
  |   v
  | View ingredients list
  |   |
  |   |----> [Database]
  |          |
  |          v
  |        SELECT from NguyenLieu
  |          |
  |   <------|
  |   |
  |   v
  | <Decision: Ingredient action?>
  |   |
  |   |--[Add New]
  |   |   |
  |   |   v
  |   | Enter ingredient info (name, nutrition per 100g)
  |   |   |
  |   |   v
  |   | Save
  |   |   |
  |   |   |----> [Database]
  |   |          |
  |   |          v
  |   |        INSERT into NguyenLieu
  |   |          |
  |   |   <------|
  |   |
  |   |--[Edit]
  |   |   |
  |   |   v
  |   | Select ingredient
  |   |   |
  |   |   v
  |   | Modify values
  |   |   |
  |   |   v
  |   | Save
  |   |   |
  |   |   |----> [Database]
  |   |          |
  |   |          v
  |   |        UPDATE NguyenLieu
  |   |          |
  |   |   <------|
  |   |
  |   |--[Delete]
  |       |
  |       v
  |     Select ingredient
  |       |
  |       v
  |     <Decision: Used in recipes?>
  |       |
  |       |--[Yes]--> Show warning --> Confirm --> DELETE
  |       |
  |       |--[No]--> Confirm --> DELETE
  |       |
  |       |----> [Database]
  |              |
  |              v
  |            DELETE from NguyenLieu
  |              |
  |       <------|
  |
  |--[Meal Categories Management]
  |   |
  |   v
  | (Similar to Ingredient Management)
  |   |
  |   v
  | CRUD operations on DanhMucBuaAn
  |
  |--[Recipe Management]
  |   |
  |   v
  | View all recipes (public + private)
  |   |
  |   |----> [Database]
  |          |
  |          v
  |        SELECT from CongThuc (no RLS filter)
  |          |
  |   <------|
  |   |
  |   v
  | <Decision: Recipe action?>
  |   |
  |   |--[View]--> View recipe details
  |   |
  |   |--[Edit]--> Modify recipe (any user's recipe)
  |   |
  |   |--[Delete]--> Delete recipe
  |   |              |
  |   |              v
  |   |            Confirm deletion
  |   |              |
  |   |              |----> [Database]
  |   |                     |
  |   |                     v
  |   |                   DELETE from CongThuc (CASCADE)
  |   |                     |
  |   |              <------|
  |   |
  |   |--[Change Visibility]--> Toggle congkhai status
  |
  |--[Analytics & Reports]
      |
      v
    Select report type
      |
      v
    <Parallel>
      |
      |---> Count total users
      |        |
      |        |----> [Database]
      |               |
      |               v
      |             COUNT(auth.users)
      |
      |---> Count active subscriptions
      |        |
      |        |----> [Database]
      |
      |---> Count total recipes
      |        |
      |        |----> [Database]
      |
      |---> Count total meal plans
      |        |
      |        |----> [Database]
      |
      |---> Calculate nutrition logs trend
      |        |
      |        |----> [Database]
      |
    </Parallel>
      |
      v
    Aggregate data
      |
      v
    Generate charts
      |
      v
    Display admin analytics dashboard
      |
      v
    [Admin] Review system statistics
      |
      v
    <Decision: Export report?>
      |
      |--[Yes]--> Generate PDF/CSV
      |              |
      |              v
      |            Download file
      |
      |--[No]
      v
    <Decision: Another admin task?>
      |
      |--[Yes]--> Loop back to "Admin task?"
      |
      |--[No]
      v
    Logout
      |
      v
    (End) Admin session complete
```

---

## 3. NOTES CHO VẼ ACTIVITY DIAGRAMS

### 3.1 Ký hiệu (UML Notation)
- **(Start)**: Initial node (hình tròn đen)
- **(End)**: Final node (hình tròn đen có viền)
- **[Activity]**: Action/Activity (hình chữ nhật bo tròn)
- **<Decision>**: Decision node (hình thoi)
- **<Parallel>**: Fork/Join (thanh ngang đen)
- **<Loop>**: Vòng lặp
- **|**: Transition/Flow
- **Swimlanes**: Các cột phân chia trách nhiệm (Actor, System, Service)

### 3.2 Swimlanes
Mỗi activity diagram nên được chia thành swimlanes để rõ ràng trách nhiệm:
- **User/Guest/Admin**: Người thực hiện
- **UI System**: Frontend/React components
- **Service Layer**: Business logic (RecipeService, MealPlanService, etc.)
- **Database**: Supabase PostgreSQL
- **AI Service**: OpenAI/Lovable AI
- **Auth Service**: Supabase Auth
- **Email Service**: Email notifications
- **Storage Service**: Supabase Storage

### 3.3 Decision Points
Các decision nodes quan trọng:
- Validation checks
- Authorization checks
- User choices (Yes/No, Option A/B/C)
- Error handling paths
- Feature toggles

### 3.4 Parallel Activities
Sử dụng fork/join cho:
- Multiple database queries
- Parallel calculations
- Concurrent API calls
- Independent validations

### 3.5 Error Handling
Mỗi activity diagram nên include:
- Validation error paths
- Network error recovery
- User cancellation flows
- Rollback mechanisms

### 3.6 Best Practices
1. Luôn có (Start) và (End) node
2. Mỗi decision phải có tất cả các outcomes
3. Avoid crossing swimlanes unnecessarily
4. Keep activities at consistent granularity
5. Document loops and conditions clearly
