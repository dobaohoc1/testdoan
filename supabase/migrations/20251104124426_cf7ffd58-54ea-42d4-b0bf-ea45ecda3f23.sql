-- Add foreign key constraints to establish proper relationships

-- health_profiles -> profiles (user_id)
ALTER TABLE public.health_profiles
DROP CONSTRAINT IF EXISTS health_profiles_user_id_fkey,
ADD CONSTRAINT health_profiles_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- meal_plans -> profiles (user_id)
ALTER TABLE public.meal_plans
DROP CONSTRAINT IF EXISTS meal_plans_user_id_fkey,
ADD CONSTRAINT meal_plans_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- meal_plan_items -> meal_plans (meal_plan_id)
ALTER TABLE public.meal_plan_items
DROP CONSTRAINT IF EXISTS meal_plan_items_meal_plan_id_fkey,
ADD CONSTRAINT meal_plan_items_meal_plan_id_fkey 
  FOREIGN KEY (meal_plan_id) 
  REFERENCES public.meal_plans(id) 
  ON DELETE CASCADE;

-- meal_plan_items -> recipes (recipe_id)
ALTER TABLE public.meal_plan_items
DROP CONSTRAINT IF EXISTS meal_plan_items_recipe_id_fkey,
ADD CONSTRAINT meal_plan_items_recipe_id_fkey 
  FOREIGN KEY (recipe_id) 
  REFERENCES public.recipes(id) 
  ON DELETE SET NULL;

-- meal_plan_items -> meal_categories (meal_category_id)
ALTER TABLE public.meal_plan_items
DROP CONSTRAINT IF EXISTS meal_plan_items_meal_category_id_fkey,
ADD CONSTRAINT meal_plan_items_meal_category_id_fkey 
  FOREIGN KEY (meal_category_id) 
  REFERENCES public.meal_categories(id) 
  ON DELETE SET NULL;

-- nutrition_logs -> profiles (user_id)
ALTER TABLE public.nutrition_logs
DROP CONSTRAINT IF EXISTS nutrition_logs_user_id_fkey,
ADD CONSTRAINT nutrition_logs_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- nutrition_logs -> meal_categories (meal_category_id)
ALTER TABLE public.nutrition_logs
DROP CONSTRAINT IF EXISTS nutrition_logs_meal_category_id_fkey,
ADD CONSTRAINT nutrition_logs_meal_category_id_fkey 
  FOREIGN KEY (meal_category_id) 
  REFERENCES public.meal_categories(id) 
  ON DELETE SET NULL;

-- nutrition_logs -> recipes (recipe_id)
ALTER TABLE public.nutrition_logs
DROP CONSTRAINT IF EXISTS nutrition_logs_recipe_id_fkey,
ADD CONSTRAINT nutrition_logs_recipe_id_fkey 
  FOREIGN KEY (recipe_id) 
  REFERENCES public.recipes(id) 
  ON DELETE SET NULL;

-- profiles -> auth.users (user_id)
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_user_id_fkey,
ADD CONSTRAINT profiles_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- recipes -> profiles (created_by)
ALTER TABLE public.recipes
DROP CONSTRAINT IF EXISTS recipes_created_by_fkey,
ADD CONSTRAINT recipes_created_by_fkey 
  FOREIGN KEY (created_by) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- recipe_ingredients -> recipes (recipe_id)
ALTER TABLE public.recipe_ingredients
DROP CONSTRAINT IF EXISTS recipe_ingredients_recipe_id_fkey,
ADD CONSTRAINT recipe_ingredients_recipe_id_fkey 
  FOREIGN KEY (recipe_id) 
  REFERENCES public.recipes(id) 
  ON DELETE CASCADE;

-- recipe_ingredients -> ingredients (ingredient_id)
ALTER TABLE public.recipe_ingredients
DROP CONSTRAINT IF EXISTS recipe_ingredients_ingredient_id_fkey,
ADD CONSTRAINT recipe_ingredients_ingredient_id_fkey 
  FOREIGN KEY (ingredient_id) 
  REFERENCES public.ingredients(id) 
  ON DELETE CASCADE;

-- shopping_lists -> profiles (user_id)
ALTER TABLE public.shopping_lists
DROP CONSTRAINT IF EXISTS shopping_lists_user_id_fkey,
ADD CONSTRAINT shopping_lists_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- shopping_items -> shopping_lists (shopping_list_id)
ALTER TABLE public.shopping_items
DROP CONSTRAINT IF EXISTS shopping_items_shopping_list_id_fkey,
ADD CONSTRAINT shopping_items_shopping_list_id_fkey 
  FOREIGN KEY (shopping_list_id) 
  REFERENCES public.shopping_lists(id) 
  ON DELETE CASCADE;

-- user_roles -> auth.users (user_id)
ALTER TABLE public.user_roles
DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey,
ADD CONSTRAINT user_roles_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- user_subscriptions -> profiles (user_id)
ALTER TABLE public.user_subscriptions
DROP CONSTRAINT IF EXISTS user_subscriptions_user_id_fkey,
ADD CONSTRAINT user_subscriptions_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- user_subscriptions -> subscription_plans (plan_id)
ALTER TABLE public.user_subscriptions
DROP CONSTRAINT IF EXISTS user_subscriptions_plan_id_fkey,
ADD CONSTRAINT user_subscriptions_plan_id_fkey 
  FOREIGN KEY (plan_id) 
  REFERENCES public.subscription_plans(id) 
  ON DELETE SET NULL;

-- water_logs -> profiles (user_id)
ALTER TABLE public.water_logs
DROP CONSTRAINT IF EXISTS water_logs_user_id_fkey,
ADD CONSTRAINT water_logs_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- weight_logs -> profiles (user_id)
ALTER TABLE public.weight_logs
DROP CONSTRAINT IF EXISTS weight_logs_user_id_fkey,
ADD CONSTRAINT weight_logs_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Create indexes for better query performance on foreign keys
CREATE INDEX IF NOT EXISTS idx_health_profiles_user_id ON public.health_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON public.meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_items_meal_plan_id ON public.meal_plan_items(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_items_recipe_id ON public.meal_plan_items(recipe_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_id ON public.nutrition_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_log_date ON public.nutrition_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_recipes_created_by ON public.recipes(created_by);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON public.recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_shopping_items_shopping_list_id ON public.shopping_items(shopping_list_id);
CREATE INDEX IF NOT EXISTS idx_water_logs_user_id_date ON public.water_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_weight_logs_user_id_date ON public.weight_logs(user_id, log_date);