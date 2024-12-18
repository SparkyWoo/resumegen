export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          stripe_customer_id?: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          stripe_customer_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          stripe_customer_id?: string
          created_at?: string
        }
      }
      premium_features: {
        Row: {
          id: string
          user_id: string
          resume_id: string
          feature_type: 'ats_score' | 'interview_tips'
          is_active: boolean
          expires_at?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resume_id: string
          feature_type: 'ats_score' | 'interview_tips'
          is_active?: boolean
          expires_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resume_id?: string
          feature_type?: 'ats_score' | 'interview_tips'
          is_active?: boolean
          expires_at?: string
          created_at?: string
        }
      }
      ats_scores: {
        Row: {
          id: string
          resume_id: string
          score: number
          breakdown: Json
          suggestions: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          resume_id: string
          score: number
          breakdown: Json
          suggestions: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          resume_id?: string
          score?: number
          breakdown?: Json
          suggestions?: Json
          created_at?: string
          updated_at?: string
        }
      }
      interview_tips: {
        Row: {
          id: string
          resume_id: string
          company_culture: Json
          role_keywords: Json
          talking_points: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          resume_id: string
          company_culture: Json
          role_keywords: Json
          talking_points: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          resume_id?: string
          company_culture?: Json
          role_keywords?: Json
          talking_points?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 