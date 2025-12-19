-- Drop the old constraint and add correct one for plan types
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

-- Add the correct constraint for standard/premium plans
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_plan_type_check 
  CHECK (plan_type = ANY (ARRAY['standard'::text, 'premium'::text, 'free'::text]));

-- Add billing_period column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'billing_period') THEN
    ALTER TABLE public.subscriptions ADD COLUMN billing_period text DEFAULT 'monthly';
  END IF;
END $$;

-- Add constraint for billing period
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_billing_period_check;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_billing_period_check 
  CHECK (billing_period IS NULL OR billing_period = ANY (ARRAY['monthly'::text, 'annually'::text]));