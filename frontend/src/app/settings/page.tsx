'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
    const { user } = useAuth();

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1f2937', marginBottom: '2rem' }}>設定 (Settings)</h1>

            <div className="card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#374151' }}>プロフィール設定</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ color: '#6b7280' }}>ユーザー名</div>
                    <div style={{ fontWeight: 600 }}>{user?.username}</div>

                    <div style={{ color: '#6b7280' }}>メールアドレス</div>
                    <div style={{ fontWeight: 600 }}>{user?.email}</div>

                    <div style={{ color: '#6b7280' }}>ロール</div>
                    <div>
                        <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.125rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                            {user?.is_superuser ? 'Administrator' : 'User'}
                        </span>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>パスワード変更</h4>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input className="input" type="password" placeholder="現在のパスワード" style={{ marginBottom: 0 }} />
                        <input className="input" type="password" placeholder="新しいパスワード" style={{ marginBottom: 0 }} />
                        <button className="btn" onClick={() => alert('デモ版のためパスワード変更は無効化されています。')}>変更</button>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#374151' }}>システム情報</h3>
                <dl style={{ margin: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                        <dt style={{ color: '#6b7280' }}>Version</dt>
                        <dd style={{ fontWeight: 500 }}>v1.0.0 (Enterprise)</dd>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                        <dt style={{ color: '#6b7280' }}>Environment</dt>
                        <dd style={{ fontWeight: 500 }}>Production (Docker)</dd>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                        <dt style={{ color: '#6b7280' }}>API Status</dt>
                        <dd style={{ color: '#16a34a', fontWeight: 600 }}>● Online</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}
