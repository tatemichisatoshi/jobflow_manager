'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

export default function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Need FormData for OAuth2PasswordRequestForm
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const res = await api.post('/login/access-token', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            login(res.data.access_token);
        } catch (err: any) {
            setError('Login failed. Check credentials.');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h1>ログイン</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label>ユーザー名</label>
                    <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <label>パスワード</label>
                    <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="btn" style={{ width: '100%' }}>ログイン</button>
                </form>
            </div>
        </div>
    );
}
