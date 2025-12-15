-- Fix the broken RLS policy for leagues
DROP POLICY IF EXISTS "Leagues are viewable by members" ON public.leagues;

CREATE POLICY "Leagues are viewable by members" 
ON public.leagues 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM league_members
    WHERE league_members.league_id = leagues.id 
    AND league_members.user_id = auth.uid()
  )
);

-- Also fix the same issue in league_members policy
DROP POLICY IF EXISTS "League members viewable by league members" ON public.league_members;

CREATE POLICY "League members viewable by league members" 
ON public.league_members 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM league_members lm
    WHERE lm.league_id = league_members.league_id 
    AND lm.user_id = auth.uid()
  )
);