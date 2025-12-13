-- Add missing foreign key constraints
-- Check and add only constraints that don't exist

-- recipe_ingredients
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'recipe_ingredients_recipe_id_fkey'
  ) THEN
    ALTER TABLE public.recipe_ingredients
    ADD CONSTRAINT recipe_ingredients_recipe_id_fkey 
    FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'recipe_ingredients_ingredient_id_fkey'
  ) THEN
    ALTER TABLE public.recipe_ingredients
    ADD CONSTRAINT recipe_ingredients_ingredient_id_fkey 
    FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(id) ON DELETE CASCADE;
  END IF;
END $$;

-- meal_plan_entries
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'meal_plan_entries_meal_plan_id_fkey'
  ) THEN
    ALTER TABLE public.meal_plan_entries
    ADD CONSTRAINT meal_plan_entries_meal_plan_id_fkey 
    FOREIGN KEY (meal_plan_id) REFERENCES public.meal_plans(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'meal_plan_entries_recipe_id_fkey'
  ) THEN
    ALTER TABLE public.meal_plan_entries
    ADD CONSTRAINT meal_plan_entries_recipe_id_fkey 
    FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'meal_plan_entries_meal_category_id_fkey'
  ) THEN
    ALTER TABLE public.meal_plan_entries
    ADD CONSTRAINT meal_plan_entries_meal_category_id_fkey 
    FOREIGN KEY (meal_category_id) REFERENCES public.meal_categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- meal_plans
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'meal_plans_user_id_fkey'
  ) THEN
    ALTER TABLE public.meal_plans
    ADD CONSTRAINT meal_plans_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- nutrition_logs
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'nutrition_logs_user_id_fkey'
  ) THEN
    ALTER TABLE public.nutrition_logs
    ADD CONSTRAINT nutrition_logs_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'nutrition_logs_meal_category_id_fkey'
  ) THEN
    ALTER TABLE public.nutrition_logs
    ADD CONSTRAINT nutrition_logs_meal_category_id_fkey 
    FOREIGN KEY (meal_category_id) REFERENCES public.meal_categories(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'nutrition_logs_recipe_id_fkey'
  ) THEN
    ALTER TABLE public.nutrition_logs
    ADD CONSTRAINT nutrition_logs_recipe_id_fkey 
    FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE SET NULL;
  END IF;
END $$;

-- recipes
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'recipes_created_by_fkey'
  ) THEN
    ALTER TABLE public.recipes
    ADD CONSTRAINT recipes_created_by_fkey 
    FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- user_subscriptions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_subscriptions_user_id_fkey'
  ) THEN
    ALTER TABLE public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_subscriptions_plan_id_fkey'
  ) THEN
    ALTER TABLE public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_plan_id_fkey 
    FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id) ON DELETE SET NULL;
  END IF;
END $$;

-- profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_id_fkey'
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_health_profiles_user_id ON public.health_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON public.recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient_id ON public.recipe_ingredients(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_entries_meal_plan_id ON public.meal_plan_entries(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_entries_recipe_id ON public.meal_plan_entries(recipe_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_entries_planned_date ON public.meal_plan_entries(planned_date);
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON public.meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_start_date ON public.meal_plans(start_date);
CREATE INDEX IF NOT EXISTS idx_meal_plans_end_date ON public.meal_plans(end_date);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_id ON public.nutrition_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_log_date ON public.nutrition_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_recipes_created_by ON public.recipes(created_by);
CREATE INDEX IF NOT EXISTS idx_recipes_is_public ON public.recipes(is_public);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Add updated_at triggers for tables that don't have them
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_meal_plans_updated_at'
  ) THEN
    CREATE TRIGGER update_meal_plans_updated_at
    BEFORE UPDATE ON public.meal_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_recipes_updated_at'
  ) THEN
    CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON public.recipes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_subscriptions_updated_at'
  ) THEN
    CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Enable RLS policies for recipe_ingredients (currently missing CRUD policies)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert recipe ingredients for their own recipes'
  ) THEN
    CREATE POLICY "Users can insert recipe ingredients for their own recipes"
    ON public.recipe_ingredients
    FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.recipes
        WHERE recipes.id = recipe_ingredients.recipe_id
        AND recipes.created_by = auth.uid()
      )
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update recipe ingredients for their own recipes'
  ) THEN
    CREATE POLICY "Users can update recipe ingredients for their own recipes"
    ON public.recipe_ingredients
    FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM public.recipes
        WHERE recipes.id = recipe_ingredients.recipe_id
        AND recipes.created_by = auth.uid()
      )
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete recipe ingredients for their own recipes'
  ) THEN
    CREATE POLICY "Users can delete recipe ingredients for their own recipes"
    ON public.recipe_ingredients
    FOR DELETE
    USING (
      EXISTS (
        SELECT 1 FROM public.recipes
        WHERE recipes.id = recipe_ingredients.recipe_id
        AND recipes.created_by = auth.uid()
      )
    );
  END IF;
END $$;