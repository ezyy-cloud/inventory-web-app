import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Supplier = Database['public']['Tables']['suppliers']['Row'];
type SupplierInsert = Database['public']['Tables']['suppliers']['Insert'];
type SupplierUpdate = Database['public']['Tables']['suppliers']['Update'];

interface SupplierState {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  fetchSuppliers: () => Promise<void>;
  createSupplier: (supplier: SupplierInsert) => Promise<boolean>;
  updateSupplier: (id: number, supplier: SupplierUpdate) => Promise<boolean>;
  deleteSupplier: (id: number) => Promise<boolean>;
}

export const useSupplierStore = create<SupplierState>((set, get) => ({
  suppliers: [],
  loading: false,
  error: null,

  fetchSuppliers: async () => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');

      if (error) throw error;

      set({ suppliers: data || [], loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch suppliers',
        loading: false 
      });
      return false;
    }
  },

  createSupplier: async (supplier) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('suppliers')
        .insert(supplier)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        suppliers: [...state.suppliers, data],
        loading: false
      }));

      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create supplier',
        loading: false 
      });
      return false;
    }
  },

  updateSupplier: async (id, supplier) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('suppliers')
        .update(supplier)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        suppliers: state.suppliers.map(s => s.id === id ? data : s),
        loading: false
      }));

      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update supplier',
        loading: false 
      });
      return false;
    }
  },

  deleteSupplier: async (id) => {
    try {
      set({ loading: true, error: null });

      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        suppliers: state.suppliers.filter(s => s.id !== id),
        loading: false
      }));

      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete supplier',
        loading: false 
      });
      return false;
    }
  }
}));
