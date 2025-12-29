'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewJobPage() {
    const [name, setName] = useState('月次売上レポート作成');

    // Default to current date
    const today = new Date();
    const [targetYear, setTargetYear] = useState(today.getFullYear().toString());
    const [targetMonthPart, setTargetMonthPart] = useState((today.getMonth() + 1).toString().padStart(2, '0'));

    const [department, setDepartment] = useState('sales');
    const [includeDrafts, setIncludeDrafts] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const target_month = `${targetYear}-${targetMonthPart}`;

            const parameters = {
                target_month: target_month,
                department: department,
                include_drafts: includeDrafts,
                format: "pdf"
            };

            await api.post('/jobs/', { name, parameters });
            router.push('/dashboard');
        } catch (err) {
            alert('ジョブ作成に失敗しました。');
        }
    };

    // Generate year options (Current year +/- 2 years)
    const currentYear = today.getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];

    return (
        <div className="container">
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1.5rem', color: '#6b7280', fontWeight: 500 }}>
                ← ダッシュボードへ戻る
            </Link>

            <h1>ジョブ新規作成</h1>
            <p style={{ marginBottom: '2rem', color: '#4b5563', lineHeight: '1.6' }}>
                定期実行するバッチ処理のパラメータを指定してキューに登録します。<br />
                下記のフォームから、レポート作成に必要な条件を指定してください。
            </p>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '2rem' }}>
                        <label>ジョブ処理名</label>
                        <input
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ maxWidth: '100%' }}
                        />
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', marginTop: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#1f2937' }}>処理パラメータ設定</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
                            <div>
                                <label>対象年月</label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <select
                                        className="input"
                                        value={targetYear}
                                        onChange={(e) => setTargetYear(e.target.value)}
                                        style={{ marginBottom: 0 }}
                                    >
                                        {years.map(y => (
                                            <option key={y} value={y}>{y}年</option>
                                        ))}
                                    </select>
                                    <select
                                        className="input"
                                        value={targetMonthPart}
                                        onChange={(e) => setTargetMonthPart(e.target.value)}
                                        style={{ marginBottom: 0 }}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                            <option key={m} value={m.toString().padStart(2, '0')}>{m}月</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label>対象部署</label>
                                <select
                                    className="input"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    style={{ marginBottom: 0 }}
                                >
                                    <option value="sales">営業部 (Sales)</option>
                                    <option value="marketing">マーケティング部 (Marketing)</option>
                                    <option value="engineering">開発部 (Engineering)</option>
                                    <option value="hr">人事部 (HR)</option>
                                </select>
                            </div>
                        </div>

                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            gap: '12px',
                            marginTop: '2rem',
                            padding: '1rem',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            background: '#f9fafb'
                        }}>
                            <input
                                type="checkbox"
                                checked={includeDrafts}
                                onChange={(e) => setIncludeDrafts(e.target.checked)}
                                style={{ width: '1.2rem', height: '1.2rem', margin: 0 }}
                            />
                            <span style={{ fontWeight: 500 }}>下書きデータを含める（ドラフト版）</span>
                        </label>
                    </div>

                    <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                        <button type="submit" className="btn" style={{ minWidth: '200px', fontSize: '1.1rem', padding: '1rem' }}>
                            レポート作成タスクを登録
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
