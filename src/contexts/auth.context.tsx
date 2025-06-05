import { ReactNode, createContext, useContext, useState } from 'react'

export interface User {
  id: string
  name: string
  phone: string
  role: 'Parent' | 'Nurse' | 'Admin'
  avatar: string
}

// Fake user accounts
export const fakeUsers = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    password: 'parent123',
    role: 'Parent' as const,
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: '2',
    name: 'Trần Thị B',
    phone: '0987654321',
    password: 'nurse123',
    role: 'Nurse' as const,
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: '3',
    name: 'Lê Văn C',
    phone: '0909090909',
    password: 'admin123',
    role: 'Admin' as const,
    avatar: 'https://i.pravatar.cc/150?img=8'
  }
]

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (phone: string, password: string) => Promise<{ success: boolean; message: string; redirectUrl?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => ({ success: false, message: 'Not implemented' }),
  logout: () => {}
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const isAuthenticated = !!user

  const login = async (phone: string, password: string) => {
    // Find user with matching phone and password
    const foundUser = fakeUsers.find((u) => u.phone === phone && u.password === password)

    if (foundUser) {
      // Create a user object without the password
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword as User)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))

      let redirectUrl = '/home'
      if (foundUser.role === 'Nurse') redirectUrl = '/nurse/health-record-censorship'
      if (foundUser.role === 'Admin') redirectUrl = '/admin/censor-list'

      return {
        success: true,
        message: 'Đăng nhập thành công!',
        redirectUrl
      }
    }

    return { success: false, message: 'Số điện thoại hoặc mật khẩu không đúng!' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
