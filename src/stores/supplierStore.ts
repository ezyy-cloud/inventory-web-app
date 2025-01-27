import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Supplier = Database['public']['Tables']['suppliers']['Row'];

interface SupplierState {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  fetchSuppliers: () => Promise<void>;
  createSupplier: (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateSupplier: (id: number, supplier: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: number) => Promise<void>;
}

export const useSupplierStore = create<SupplierState>((set) => ({
  suppliers: [],
  loading: false,
  error: null,
  
  fetchSuppliers: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');

      if (error) {
        set({ error: error.message, loading: false });
        return;
      }

      set({ suppliers: data || [], loading: false });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'An unknown error occurred', 
        loading: false 
      });
    }
  },

  createSupplier: async (supplier) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .insert(supplier);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Error creating supplier:', err);
    }
  },

  updateSupplier: async (id, supplier) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .update(supplier)
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Error updating supplier:', err);
    }
  },

  deleteSupplier: async (id) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Error deleting supplier:', err);
    }
  }
}));
