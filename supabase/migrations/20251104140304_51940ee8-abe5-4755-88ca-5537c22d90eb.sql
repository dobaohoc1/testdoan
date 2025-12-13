-- Revert all table and column names back to English (Fixed version)

-- Rename tables back to English
ALTER TABLE "HoSo" RENAME TO profiles;
ALTER TABLE "HoSoSucKhoe" RENAME TO health_profiles;
ALTER TABLE "VaiTroNguoiDung" RENAME TO user_roles;
ALTER TABLE "NhatKyCanNang" RENAME TO weight_logs;
ALTER TABLE "NhatKyNuoc" RENAME TO water_logs;
ALTER TABLE "NhatKyDinhDuong" RENAME TO nutrition_logs;
ALTER TABLE "CongThuc" RENAME TO recipes;
ALTER TABLE "NguyenLieu" RENAME TO ingredients;
ALTER TABLE "NguyenLieuCongThuc" RENAME TO recipe_ingredients;
ALTER TABLE "KeHoachBuaAn" RENAME TO meal_plans;
ALTER TABLE "MonAnKeHoach" RENAME TO meal_plan_items;
ALTER TABLE "DanhMucBuaAn" RENAME TO meal_categories;
ALTER TABLE "DanhSachMuaSam" RENAME TO shopping_lists;
ALTER TABLE "MonMuaSam" RENAME TO shopping_items;
ALTER TABLE "GoiDangKy" RENAME TO subscription_plans;
ALTER TABLE "DangKyNguoiDung" RENAME TO user_subscriptions;

-- Rename columns in profiles table
ALTER TABLE profiles RENAME COLUMN nguoidungid TO user_id;
ALTER TABLE profiles RENAME COLUMN hoten TO full_name;
ALTER TABLE profiles RENAME COLUMN sodienthoai TO phone;
ALTER TABLE profiles RENAME COLUMN ngaysinh TO date_of_birth;
ALTER TABLE profiles RENAME COLUMN gioitinh TO gender;
ALTER TABLE profiles RENAME COLUMN anhdaidien TO avatar_url;
ALTER TABLE profiles RENAME COLUMN taoluc TO created_at;
ALTER TABLE profiles RENAME COLUMN capnhatluc TO updated_at;

-- Rename columns in health_profiles table
ALTER TABLE health_profiles RENAME COLUMN nguoidungid TO user_id;
ALTER TABLE health_profiles RENAME COLUMN chieucao TO height;
ALTER TABLE health_profiles RENAME COLUMN cannang TO weight;
ALTER TABLE health_profiles RENAME COLUMN mucdohoatdong TO activity_level;
ALTER TABLE health_profiles RENAME COLUMN muctieucalohangngay TO daily_calorie_target;
ALTER TABLE health_profiles RENAME COLUMN muctieusuckhoe TO health_goals;
ALTER TABLE health_profiles RENAME COLUMN tinhtrangsuckhoe TO health_conditions;
ALTER TABLE health_profiles RENAME COLUMN diung TO allergies;
ALTER TABLE health_profiles RENAME COLUMN hancheanuong TO dietary_restrictions;
ALTER TABLE health_profiles RENAME COLUMN taoluc TO created_at;
ALTER TABLE health_profiles RENAME COLUMN capnhatluc TO updated_at;

-- Rename columns in user_roles table
ALTER TABLE user_roles RENAME COLUMN nguoidungid TO user_id;
ALTER TABLE user_roles RENAME COLUMN vaitro TO role;
ALTER TABLE user_roles RENAME COLUMN taoluc TO created_at;

-- Rename columns in weight_logs table
ALTER TABLE weight_logs RENAME COLUMN nguoidungid TO user_id;
ALTER TABLE weight_logs RENAME COLUMN cannang TO weight;
ALTER TABLE weight_logs RENAME COLUMN ngayghinhan TO log_date;
ALTER TABLE weight_logs RENAME COLUMN ghichu TO notes;
ALTER TABLE weight_logs RENAME COLUMN taoluc TO created_at;

-- Rename columns in water_logs table
ALTER TABLE water_logs RENAME COLUMN nguoidungid TO user_id;
ALTER TABLE water_logs RENAME COLUMN soluongml TO amount_ml;
ALTER TABLE water_logs RENAME COLUMN ngayghinhan TO log_date;
ALTER TABLE water_logs RENAME COLUMN gioghinhan TO log_time;
ALTER TABLE water_logs RENAME COLUMN taoluc TO created_at;

-- Rename columns in nutrition_logs table
ALTER TABLE nutrition_logs RENAME COLUMN nguoidungid TO user_id;
ALTER TABLE nutrition_logs RENAME COLUMN ngayghinhan TO log_date;
ALTER TABLE nutrition_logs RENAME COLUMN danhmucbuaanid TO meal_category_id;
ALTER TABLE nutrition_logs RENAME COLUMN congthucid TO recipe_id;
ALTER TABLE nutrition_logs RENAME COLUMN tenthucpham TO food_item;
ALTER TABLE nutrition_logs RENAME COLUMN soluong TO quantity;
ALTER TABLE nutrition_logs RENAME COLUMN donvi TO unit;
ALTER TABLE nutrition_logs RENAME COLUMN calo TO calories;
-- protein column is already correct, skip it
ALTER TABLE nutrition_logs RENAME COLUMN carbon TO carbs;
ALTER TABLE nutrition_logs RENAME COLUMN chatbeo TO fat;
ALTER TABLE nutrition_logs RENAME COLUMN ghichu TO notes;
ALTER TABLE nutrition_logs RENAME COLUMN taoluc TO created_at;

-- Rename columns in recipes table
ALTER TABLE recipes RENAME COLUMN ten TO name;
ALTER TABLE recipes RENAME COLUMN mota TO description;
ALTER TABLE recipes RENAME COLUMN huongdan TO instructions;
ALTER TABLE recipes RENAME COLUMN thoigianchuanbi TO prep_time;
ALTER TABLE recipes RENAME COLUMN thoigiannau TO cook_time;
ALTER TABLE recipes RENAME COLUMN sokhauphan TO servings;
ALTER TABLE recipes RENAME COLUMN tongcalo TO total_calories;
ALTER TABLE recipes RENAME COLUMN tongprotein TO total_protein;
ALTER TABLE recipes RENAME COLUMN tongcarbon TO total_carbs;
ALTER TABLE recipes RENAME COLUMN tongchatbeo TO total_fat;
ALTER TABLE recipes RENAME COLUMN nguoitao TO created_by;
ALTER TABLE recipes RENAME COLUMN congkhai TO is_public;
ALTER TABLE recipes RENAME COLUMN anhurl TO image_url;
ALTER TABLE recipes RENAME COLUMN dokho TO difficulty;
ALTER TABLE recipes RENAME COLUMN taoluc TO created_at;
ALTER TABLE recipes RENAME COLUMN capnhatluc TO updated_at;

-- Rename columns in ingredients table
ALTER TABLE ingredients RENAME COLUMN ten TO name;
ALTER TABLE ingredients RENAME COLUMN caloper100g TO calories_per_100g;
ALTER TABLE ingredients RENAME COLUMN proteinper100g TO protein_per_100g;
ALTER TABLE ingredients RENAME COLUMN carbonper100g TO carbs_per_100g;
ALTER TABLE ingredients RENAME COLUMN chatbeoper100g TO fat_per_100g;
ALTER TABLE ingredients RENAME COLUMN chaper100g TO fiber_per_100g;
ALTER TABLE ingredients RENAME COLUMN duongper100g TO sugar_per_100g;
ALTER TABLE ingredients RENAME COLUMN natriper100g TO sodium_per_100g;
ALTER TABLE ingredients RENAME COLUMN taoluc TO created_at;

-- Rename columns in recipe_ingredients table
ALTER TABLE recipe_ingredients RENAME COLUMN congthucid TO recipe_id;
ALTER TABLE recipe_ingredients RENAME COLUMN nguyenlieuid TO ingredient_id;
ALTER TABLE recipe_ingredients RENAME COLUMN soluong TO quantity;
ALTER TABLE recipe_ingredients RENAME COLUMN donvi TO unit;

-- Rename columns in meal_plans table
ALTER TABLE meal_plans RENAME COLUMN nguoidungid TO user_id;
ALTER TABLE meal_plans RENAME COLUMN ten TO name;
ALTER TABLE meal_plans RENAME COLUMN mota TO description;
ALTER TABLE meal_plans RENAME COLUMN muctieucalo TO calorie_goal;
ALTER TABLE meal_plans RENAME COLUMN ngaybatdau TO start_date;
ALTER TABLE meal_plans RENAME COLUMN ngayketthuc TO end_date;
ALTER TABLE meal_plans RENAME COLUMN hoatdong TO is_active;
ALTER TABLE meal_plans RENAME COLUMN taoluc TO created_at;
ALTER TABLE meal_plans RENAME COLUMN capnhatluc TO updated_at;

-- Rename columns in meal_plan_items table
ALTER TABLE meal_plan_items RENAME COLUMN kehoachbuaanid TO meal_plan_id;
ALTER TABLE meal_plan_items RENAME COLUMN danhmucbuaanid TO meal_category_id;
ALTER TABLE meal_plan_items RENAME COLUMN congthucid TO recipe_id;
ALTER TABLE meal_plan_items RENAME COLUMN ngaydukien TO planned_date;
ALTER TABLE meal_plan_items RENAME COLUMN giodukien TO planned_time;
ALTER TABLE meal_plan_items RENAME COLUMN sokhauphan TO servings;
ALTER TABLE meal_plan_items RENAME COLUMN taoluc TO created_at;

-- Rename columns in meal_categories table
ALTER TABLE meal_categories RENAME COLUMN ten TO name;
ALTER TABLE meal_categories RENAME COLUMN mota TO description;
ALTER TABLE meal_categories RENAME COLUMN thutuhienthi TO display_order;
ALTER TABLE meal_categories RENAME COLUMN taoluc TO created_at;

-- Rename columns in shopping_lists table
ALTER TABLE shopping_lists RENAME COLUMN nguoidungid TO user_id;
ALTER TABLE shopping_lists RENAME COLUMN ten TO name;
ALTER TABLE shopping_lists RENAME COLUMN taoluc TO created_at;
ALTER TABLE shopping_lists RENAME COLUMN capnhatluc TO updated_at;

-- Rename columns in shopping_items table
ALTER TABLE shopping_items RENAME COLUMN danhsachmuasamid TO shopping_list_id;
ALTER TABLE shopping_items RENAME COLUMN tennguyenlieu TO ingredient_name;
ALTER TABLE shopping_items RENAME COLUMN soluong TO quantity;
ALTER TABLE shopping_items RENAME COLUMN donvi TO unit;
ALTER TABLE shopping_items RENAME COLUMN damua TO is_purchased;
ALTER TABLE shopping_items RENAME COLUMN taoluc TO created_at;

-- Rename columns in subscription_plans table
ALTER TABLE subscription_plans RENAME COLUMN ten TO name;
ALTER TABLE subscription_plans RENAME COLUMN mota TO description;
ALTER TABLE subscription_plans RENAME COLUMN giathang TO price_monthly;
ALTER TABLE subscription_plans RENAME COLUMN gianam TO price_yearly;
ALTER TABLE subscription_plans RENAME COLUMN tinhnang TO features;
ALTER TABLE subscription_plans RENAME COLUMN maxkehoach TO max_meal_plans;
ALTER TABLE subscription_plans RENAME COLUMN maxcongthuc TO max_recipes;
ALTER TABLE subscription_plans RENAME COLUMN hoatdong TO is_active;
ALTER TABLE subscription_plans RENAME COLUMN taoluc TO created_at;

-- Rename columns in user_subscriptions table
ALTER TABLE user_subscriptions RENAME COLUMN nguoidungid TO user_id;
ALTER TABLE user_subscriptions RENAME COLUMN goidangkyid TO subscription_plan_id;
ALTER TABLE user_subscriptions RENAME COLUMN trangthai TO status;
ALTER TABLE user_subscriptions RENAME COLUMN kybatdau TO period_start;
ALTER TABLE user_subscriptions RENAME COLUMN kyketthuc TO period_end;
ALTER TABLE user_subscriptions RENAME COLUMN stripekhachhangid TO stripe_customer_id;
ALTER TABLE user_subscriptions RENAME COLUMN stripedangkyid TO stripe_subscription_id;
ALTER TABLE user_subscriptions RENAME COLUMN taoluc TO created_at;
ALTER TABLE user_subscriptions RENAME COLUMN capnhatluc TO updated_at;