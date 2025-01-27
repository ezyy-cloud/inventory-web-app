export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          email: string;
          username: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: number;
          email: string;
          username: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          email?: string;
          username?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: number;
          name: string;
          description?: string;
          sku: string;
          price: number;
          quantity: number;
          supplier_id: number;
          category?: string;
          stock?: number;
          location_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string;
          sku: string;
          price: number;
          quantity: number;
          supplier_id: number;
          category?: string;
          stock?: number;
          location_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string;
          sku?: string;
          price?: number;
          quantity?: number;
          supplier_id?: number;
          category?: string;
          stock?: number;
          location_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      suppliers: {
        Row: {
          id: number;
          name: string;
          email: string;
          phone: string;
          address: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: number;
          name: string;
          email: string;
          phone: string;
          address: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          email?: string;
          phone?: string;
          address?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      locations: {
        Row: {
          id: string;
          name: string;
          type: string;
          address: string;
          capacity: number;
          manager: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          address: string;
          capacity: number;
          manager: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          address?: string;
          capacity?: number;
          manager?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
