import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

interface UserStore {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (user: UserInsert) => Promise<User | null>;
  updateUser: (id: number, user: UserUpdate) => Promise<User | null>;
  deleteUser: (id: number) => Promise<boolean>;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ users: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createUser: async (user) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single();

      if (error) throw error;
      
      set((state) => ({
        users: [data, ...state.users],
        loading: false
      }));
      
      return data;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return null;
    }
  },

  updateUser: async (id, user) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('users')
        .update(user)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? data : u)),
        loading: false
      }));
      
      return data;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return null;
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        loading: false
      }));
      
      return true;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return false;
    }
  }
}));
