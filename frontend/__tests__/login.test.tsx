import { render, screen, fireEvent } from '@testing-library/react'
import LoginPage from '@/app/login/page'
import '@testing-library/jest-dom'

// Mock useAuth
jest.mock('@/contexts/AuthContext', () => ({
    useAuth: () => ({
        login: jest.fn(),
    }),
}))

// Mock API
jest.mock('@/lib/api', () => ({
    post: jest.fn(),
}))

describe('LoginPage', () => {
    it('renders login form', () => {
        render(<LoginPage />)

        expect(screen.getByText('Login')).toBeInTheDocument()
        expect(screen.getByLabelText('Username')).toBeInTheDocument()
        expect(screen.getByLabelText('Password')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    })

    it('updates input fields', () => {
        render(<LoginPage />)

        const usernameInput = screen.getByLabelText('Username') as HTMLInputElement
        const passwordInput = screen.getByLabelText('Password') as HTMLInputElement

        fireEvent.change(usernameInput, { target: { value: 'testuser' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })

        expect(usernameInput.value).toBe('testuser')
        expect(passwordInput.value).toBe('password123')
    })
})
