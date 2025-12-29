'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    email: string;
    username: string;
    is_superuser: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
    loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const token = Cookies.get('token');
            if (token) {
                try {
                    setUser({ id: 1, email: 'admin@example.com', username: 'admin', is_superuser: true });
                } catch (error) {
                    Cookies.remove('token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = (token: string) => {
        Cookies.set('token', token, { expires: 8 });
        setUser({ id: 1, email: 'admin@example.com', username: 'admin', is_superuser: true });
        router.push('/dashboard');
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
