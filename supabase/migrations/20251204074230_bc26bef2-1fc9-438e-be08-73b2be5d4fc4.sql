-- Fix search_path for full-text search functions
CREATE OR REPLACE FUNCTION update_congthuc_search_vector()
RETURNS trigger 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('simple', COALESCE(NEW.ten, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.mota, '')), 'B');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION update_nguyenlieu_search_vector()
RETURNS trigger 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple', COALESCE(NEW.ten, ''));
  RETURN NEW;
END;
$$;