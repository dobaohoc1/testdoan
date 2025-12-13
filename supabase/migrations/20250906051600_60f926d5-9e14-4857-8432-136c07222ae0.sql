-- Add missing RLS policies for meal_plan_entries table
-- These policies ensure users can only manage meal plan entries for their own meal plans

-- Allow users to insert meal plan entries only for their own meal plans
CREATE POLICY "Users can create meal plan entries for their own meal plans" 
ON public.meal_plan_entries 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM meal_plans 
    WHERE meal_plans.id = meal_plan_entries.meal_plan_id 
    AND meal_plans.user_id = auth.uid()
  )
);

-- Allow users to update meal plan entries only for their own meal plans
CREATE POLICY "Users can update their own meal plan entries" 
ON public.meal_plan_entries 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM meal_plans 
    WHERE meal_plans.id = meal_plan_entries.meal_plan_id 
    AND meal_plans.user_id = auth.uid()
  )
);

-- Allow users to delete meal plan entries only for their own meal plans
CREATE POLICY "Users can delete their own meal plan entries" 
ON public.meal_plan_entries 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 
    FROM meal_plans 
    WHERE meal_plans.id = meal_plan_entries.meal_plan_id 
    AND meal_plans.user_id = auth.uid()
  )
);