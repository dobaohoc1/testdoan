-- Add foreign keys to establish relationships between tables

-- Profiles table foreign keys
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_user_id_fkey,
ADD CONSTRAINT profiles_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Health profiles foreign keys
ALTER TABLE public.health_profiles
DROP CONSTRAINT IF EXISTS health_profiles_user_id_fkey,
ADD CONSTRAINT health_profiles_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- User roles foreign keys
ALTER TABLE public.user_roles
DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey,
ADD CONSTRAINT user_roles_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Recipes foreign keys
ALTER TABLE public.recipes
DROP CONSTRAINT IF EXISTS recipes_created_by_fkey,
ADD CONSTRAINT recipes_created_by_fkey 
  FOREIGN KEY (created_by) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL;

-- Recipe ingredients foreign keys
ALTER TABLE public.recipe_ingredients
DROP CONSTRAINT IF EXISTS recipe_ingredients_recipe_id_fkey,
ADD CONSTRAINT recipe_ingredients_recipe_id_fkey 
  FOREIGN KEY (recipe_id) 
  REFERENCES public.recipes(id) 
  ON DELETE CASCADE;

ALTER TABLE public.recipe_ingredients
DROP CONSTRAINT IF EXISTS recipe_ingredients_ingredient_id_fkey,
ADD CONSTRAINT recipe_ingredients_ingredient_id_fkey 
  FOREIGN KEY (ingredient_id) 
  REFERENCES public.ingredients(id) 
  ON DELETE CASCADE;

-- Meal plans foreign keys
ALTER TABLE public.meal_plans
DROP CONSTRAINT IF EXISTS meal_plans_user_id_fkey,
ADD CONSTRAINT meal_plans_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Meal plan items foreign keys
ALTER TABLE public.meal_plan_items
DROP CONSTRAINT IF EXISTS meal_plan_items_meal_plan_id_fkey,
ADD CONSTRAINT meal_plan_items_meal_plan_id_fkey 
  FOREIGN KEY (meal_plan_id) 
  REFERENCES public.meal_plans(id) 
  ON DELETE CASCADE;

ALTER TABLE public.meal_plan_items
DROP CONSTRAINT IF EXISTS meal_plan_items_recipe_id_fkey,
ADD CONSTRAINT meal_plan_items_recipe_id_fkey 
  FOREIGN KEY (recipe_id) 
  REFERENCES public.recipes(id) 
  ON DELETE SET NULL;

ALTER TABLE public.meal_plan_items
DROP CONSTRAINT IF EXISTS meal_plan_items_meal_category_id_fkey,
ADD CONSTRAINT meal_plan_items_meal_category_id_fkey 
  FOREIGN KEY (meal_category_id) 
  REFERENCES public.meal_categories(id) 
  ON DELETE SET NULL;

-- Nutrition logs foreign keys
ALTER TABLE public.nutrition_logs
DROP CONSTRAINT IF EXISTS nutrition_logs_user_id_fkey,
ADD CONSTRAINT nutrition_logs_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.nutrition_logs
DROP CONSTRAINT IF EXISTS nutrition_logs_recipe_id_fkey,
ADD CONSTRAINT nutrition_logs_recipe_id_fkey 
  FOREIGN KEY (recipe_id) 
  REFERENCES public.recipes(id) 
  ON DELETE SET NULL;

ALTER TABLE public.nutrition_logs
DROP CONSTRAINT IF EXISTS nutrition_logs_meal_category_id_fkey,
ADD CONSTRAINT nutrition_logs_meal_category_id_fkey 
  FOREIGN KEY (meal_category_id) 
  REFERENCES public.meal_categories(id) 
  ON DELETE SET NULL;

-- Weight logs foreign keys
ALTER TABLE public.weight_logs
DROP CONSTRAINT IF EXISTS weight_logs_user_id_fkey,
ADD CONSTRAINT weight_logs_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Water logs foreign keys
ALTER TABLE public.water_logs
DROP CONSTRAINT IF EXISTS water_logs_user_id_fkey,
ADD CONSTRAINT water_logs_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Shopping lists foreign keys
ALTER TABLE public.shopping_lists
DROP CONSTRAINT IF EXISTS shopping_lists_user_id_fkey,
ADD CONSTRAINT shopping_lists_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Shopping items foreign keys
ALTER TABLE public.shopping_items
DROP CONSTRAINT IF EXISTS shopping_items_shopping_list_id_fkey,
ADD CONSTRAINT shopping_items_shopping_list_id_fkey 
  FOREIGN KEY (shopping_list_id) 
  REFERENCES public.shopping_lists(id) 
  ON DELETE CASCADE;

-- User subscriptions foreign keys
ALTER TABLE public.user_subscriptions
DROP CONSTRAINT IF EXISTS user_subscriptions_user_id_fkey,
ADD CONSTRAINT user_subscriptions_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.user_subscriptions
DROP CONSTRAINT IF EXISTS user_subscriptions_subscription_plan_id_fkey,
ADD CONSTRAINT user_subscriptions_subscription_plan_id_fkey 
  FOREIGN KEY (subscription_plan_id) 
  REFERENCES public.subscription_plans(id) 
  ON DELETE SET NULL;