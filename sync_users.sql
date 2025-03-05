-- Sync existing auth users to public users
INSERT INTO public.users (id, email, created_at)
SELECT 
  id, 
  email, 
  created_at
FROM 
  auth.users
WHERE 
  id NOT IN (SELECT id FROM public.users)
RETURNING id, email; 