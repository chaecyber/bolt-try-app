export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          url: string;
          platform: string;
          image_url: string | null;
          price: string | null;
          average_rating: number;
          total_reviews: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          url: string;
          platform: string;
          image_url?: string | null;
          price?: string | null;
          average_rating?: number;
          total_reviews?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          url?: string;
          platform?: string;
          image_url?: string | null;
          price?: string | null;
          average_rating?: number;
          total_reviews?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          reviewer_name: string;
          rating: number;
          comment: string;
          review_date: string;
          helpful_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          reviewer_name: string;
          rating: number;
          comment: string;
          review_date?: string;
          helpful_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          reviewer_name?: string;
          rating?: number;
          comment?: string;
          review_date?: string;
          helpful_count?: number;
          created_at?: string;
        };
      };
    };
  };
}
