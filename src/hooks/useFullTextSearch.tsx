import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { debounce } from '@/lib/utils';

interface SearchResult {
  id: string;
  ten: string;
  mota?: string | null;
  type: 'recipe' | 'ingredient';
  // Recipe specific
  tongcalo?: number | null;
  anhdaidien?: string | null;
  // Ingredient specific
  calo100g?: number | null;
}

export const useFullTextSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  // Debounced search term update
  const debouncedSetTerm = useCallback(
    debounce((term: string) => {
      setDebouncedTerm(term);
    }, 300),
    []
  );

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    debouncedSetTerm(term);
  };

  const { data: results, isLoading, error } = useQuery({
    queryKey: ['fullTextSearch', debouncedTerm],
    queryFn: async (): Promise<SearchResult[]> => {
      if (!debouncedTerm || debouncedTerm.length < 2) {
        return [];
      }

      const searchQuery = debouncedTerm.split(' ').filter(Boolean).join(' & ');

      // Search recipes using full-text search
      const { data: recipes, error: recipesError } = await supabase
        .from('CongThuc')
        .select('id, ten, mota, tongcalo, anhdaidien')
        .textSearch('search_vector', searchQuery, {
          type: 'plain',
          config: 'simple'
        })
        .limit(10);

      if (recipesError) {
        console.error('Recipe search error:', recipesError);
      }

      // Search ingredients using full-text search  
      const { data: ingredients, error: ingredientsError } = await supabase
        .from('NguyenLieu')
        .select('id, ten, calo100g')
        .textSearch('search_vector', searchQuery, {
          type: 'plain',
          config: 'simple'
        })
        .limit(10);

      if (ingredientsError) {
        console.error('Ingredient search error:', ingredientsError);
      }

      const recipeResults: SearchResult[] = (recipes || []).map(r => ({
        id: r.id,
        ten: r.ten,
        mota: r.mota,
        tongcalo: r.tongcalo,
        anhdaidien: r.anhdaidien,
        type: 'recipe' as const
      }));

      const ingredientResults: SearchResult[] = (ingredients || []).map(i => ({
        id: i.id,
        ten: i.ten,
        calo100g: i.calo100g,
        type: 'ingredient' as const
      }));

      return [...recipeResults, ...ingredientResults];
    },
    enabled: debouncedTerm.length >= 2,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    searchTerm,
    setSearchTerm: handleSearchChange,
    results: results || [],
    isLoading,
    error,
  };
};
