'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Job {
    id: number;
    name: string;
    created_at: string;
    runs: any[];
}

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        api.get('/jobs/').then((res) => setJobs(res.data)).catch(console.error);
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>ジョブ一覧</h2>
                    <p style={{ color: '#6b7280', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>登録されたジョブのステータスと実行履歴を確認できます。</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={logout} className="btn" style={{ backgroundColor: 'white', color: '#4b5563', border: '1px solid #d1d5db', boxShadow: 'none' }}>
                        ログアウト
                    </button>
                    <Link href="/jobs/new" className="btn">
                        + 新規ジョブ作成
                    </Link>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <table className="table" style={{ margin: 0 }}>
                    <thead style={{ background: '#f9fafb' }}>
                        <tr>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280' }}>ID</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280' }}>ジョブ定義名</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280' }}>作成日時</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280' }}>実行回数</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', textAlign: 'right' }}>アクション</th>
                        </tr>
                    </thead>
                    <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
                        {jobs.map((job) => (
                            <tr key={job.id} style={{ transition: 'background-color 0.15s' }}>
                                <td style={{ padding: '1rem 1.5rem', color: '#6b7280', fontFamily: 'monospace' }}>#{job.id}</td>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#111827' }}>{job.name}</td>
                                <td style={{ padding: '1rem 1.5rem', color: '#4b5563' }}>{new Date(job.created_at).toLocaleString()}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.125rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                                        {job.runs.length} Runs
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <Link href={`/jobs/${job.id}`} style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none', fontSize: '0.875rem' }}>
                                            詳細
                                        </Link>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (confirm('本当にこのジョブを削除しますか？')) {
                                                    api.delete(`/jobs/${job.id}`).then(() => {
                                                        setJobs(jobs.filter(j => j.id !== job.id));
                                                    }).catch(err => alert('削除に失敗しました'));
                                                }
                                            }}
                                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
                                        >
                                            削除
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {jobs.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                        まだジョブがありません。「新規ジョブ作成」から最初のジョブを作成してください。
                    </div>
                )}
            </div>
        </div>
    );
}
