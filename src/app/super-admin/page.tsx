'use client'

import { useState, useEffect } from 'react'
import { createClientBrowser } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export default function SuperAdmin() {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientBrowser()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        if (error) {
          console.error('Error fetching profile:', error)
        } else {
          setRole(profile.role)
          if (profile.role !== 'superAdmin') {
            router.push('/')
          }
        }
      } else {
        router.push('/auth/login')
      }
    }
    fetchUser()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Super Admin Page
        </h1>
        {user && role && role === 'superAdmin' && (
          <div className="space-y-4">
            <p>Welcome, {role}!</p>
          </div>
        )}
      </div>
    </div>
  )
}
