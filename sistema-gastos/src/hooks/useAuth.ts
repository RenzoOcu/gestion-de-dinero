'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  // Mocking a logged-in user to bypass auth
  const [user] = useState<User | null>({
    id: 'public-user',
    email: 'public@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as User)
  const [loading] = useState(false)

  const signIn = async (email?: string, password?: string): Promise<{ error: { message: string } | null }> => ({ error: null })
  const signUp = async (email?: string, password?: string): Promise<{ error: { message: string } | null }> => ({ error: null })
  const signOut = async () => {}

  return { user, loading, signIn, signUp, signOut }
}