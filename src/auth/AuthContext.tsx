"use client";

import { ReactNode, createContext, useState, useContext, useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "firebase/auth"
import { app } from "../app/firebase"

export type UserType = User | null

export type AuthContextProps = {
  user: UserType
  loading: boolean
}

export type AuthProps = {
  children: ReactNode
}

const AuthContext = createContext<Partial<AuthContextProps>>({})

export const useAuthContext = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: AuthProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const auth = getAuth(app)
  const [user, setUser] = useState<UserType>(null)
  const [loading, setLoading] = useState<boolean>(true);
  const isAvailableForViewing =
    pathname === "/mypage" ||
    pathname === "/comparison" ||
    pathname === "/comparison/result"
  const value = {
    user,
    loading
  }

  useEffect(() => {
    const authStateChanged = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false)
      !user && !isAvailableForViewing && (await router.push("/"))
    })
    return () => {
      authStateChanged()
    }
  }, [])

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
