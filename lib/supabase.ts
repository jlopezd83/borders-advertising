guarden import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de datos
export interface Person {
  id: string
  name: string
  description?: string
  points: number
  created_at: string
  updated_at: string
}

export interface Nomination {
  id: string
  person_id: string
  nominator_name: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  person?: Person
}

export interface Vote {
  id: string
  nomination_id: string
  voter_name: string
  vote_type: 'for' | 'against' | 'abstain'
  created_at: string
  nomination?: Nomination
}

export interface Admin {
  id: string
  username: string
  password: string
  created_at: string
}
