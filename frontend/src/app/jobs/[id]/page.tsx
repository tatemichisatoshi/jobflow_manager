'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface JobRun {
    id: number;
    status: string;
    started_at: string;
    finished_at: string;
    logs: string;
    result_summary: any;
}

interface Job {
    id: number;
    name: string;
    parameters: any;
    runs: JobRun[];
}

export default function JobDetailPage() {
    const { id } = useParams();
    const [job, setJob] = useState<Job | null>(null);

    const fetchJob = () => {
        api.get(`/jobs/${id}`).then((res) => setJob(res.data)).catch(console.error);
    };

    useEffect(() => {
        if (id) {
            fetchJob();
            // Polling for status updates
            const interval = setInterval(fetchJob, 3000);
            return () => clearInterval(interval);
        }
    }, [id]);

    const handleRun = async () => {
        if (!confirm('このジョブを実行しますか？')) return;
        try {
            await api.post(`/jobs/${id}/run`);
            fetchJob();
        } catch (err) {
            alert('実行に失敗しました');
        }
    };

    if (!job) return <div style={{ padding: '2rem', textAlign: 'center' }}>読み込み中...</div>;

    return (
        <div>
            {/* Breadcrumb / Back Link */}
            <div style={{ marginBottom: '1.5rem' }}>
                <Link href="/dashboard" style={{ color: '#6b7280', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                    <span>&larr;</span> ダッシュボードへ戻る
                </Link>
            </div>

            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>ジョブ定義</span>
                        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#1f2937' }}>{job.name}</h1>
                    </div>
                    <p style={{ margin: 0, color: '#6b7280' }}>ID: {job.id} / 作成日: {new Date().toLocaleDateString()}</p>
                </div>
                <div>
                    <button onClick={handleRun} className="btn">
                        ▶ レポート作成を実行
                    </button>
                </div>
            </div>

            {/* Content Switcher / Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>

                {/* Left: Configuration / Parameters */}
                <div>
                    <div className="card" style={{ position: 'sticky', top: '2rem' }}>
                        <h3 style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '1rem', fontSize: '1.1rem', color: '#374151' }}>
                            設定パラメータ
                        </h3>
                        <dl style={{ margin: 0 }}>
                            {Object.entries(job.parameters || {}).map(([key, value]) => (
                                <div key={key} style={{ marginBottom: '1rem' }}>
                                    <dt style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 600, marginBottom: '0.25rem' }}>
                                        {key === 'target_month' ? '対象年月' :
                                            key === 'department' ? '対象部署' :
                                                key === 'include_drafts' ? 'オプション' : key}
                                    </dt>
                                    <dd style={{ margin: 0, fontSize: '1rem', fontWeight: 500, color: '#1f2937' }}>
                                        {key === 'include_drafts' && typeof value === 'boolean' ?
                                            (value ? '下書きを含む' : '含まない') :
                                            key === 'department' ?
                                                (String(value).toUpperCase()) :
                                                String(value)
                                        }
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                {/* Right: Execution History */}
                <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        実行履歴と詳細ログ <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#6b7280' }}>※最新の履歴から表示</span>
                    </h3>

                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table className="table" style={{ margin: 0 }}>
                            <thead style={{ background: '#f9fafb' }}>
                                <tr>
                                    <th style={{ width: '80px', fontSize: '0.75rem', color: '#6b7280' }}>実行ID</th>
                                    <th style={{ width: '120px', fontSize: '0.75rem', color: '#6b7280' }}>ステータス</th>
                                    <th style={{ width: '180px', fontSize: '0.75rem', color: '#6b7280' }}>開始日時</th>
                                    <th style={{ fontSize: '0.75rem', color: '#6b7280' }}>出力ログ / 処理結果</th>
                                </tr>
                            </thead>
                            <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
                                {job.runs && job.runs.length > 0 ? (
                                    [...job.runs].reverse().map((run) => (
                                        <tr key={run.id} style={{ verticalAlign: 'top' }}>
                                            <td style={{ color: '#9ca3af', fontFamily: 'monospace' }}>#{run.id}</td>
                                            <td>
                                                <span className={`status-badge ${run.status === 'success' ? 'status-success' :
                                                    run.status === 'failed' ? 'status-failed' :
                                                        run.status === 'running' ? 'status-running' :
                                                            'status-queued'
                                                    }`}>
                                                    {run.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.9rem', color: '#4b5563' }}>
                                                {run.started_at ? new Date(run.started_at).toLocaleString() : '-'}
                                            </td>
                                            <td>
                                                {/* Result Actions */}
                                                {run.status === 'success' && run.result_summary && (
                                                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div style={{ fontSize: '0.85rem', color: '#166534' }}>
                                                            <strong>処理完了</strong><br />
                                                            件数: {run.result_summary.record_count?.toLocaleString()} | サイズ: {run.result_summary.file_size}
                                                        </div>
                                                        <a
                                                            href={run.result_summary.download_url || '#'}
                                                            target="_blank"
                                                            className="btn"
                                                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', height: 'auto', background: 'white', color: '#166534', border: '1px solid #166534' }}
                                                        >
                                                            ⬇ レポートをダウンロード
                                                        </a>
                                                    </div>
                                                )}

                                                <details style={{ fontSize: '0.85rem', color: '#6b7280', cursor: 'pointer' }}>
                                                    <summary style={{ marginBottom: '0.5rem', userSelect: 'none' }}>詳細ログ（技術者向け）を表示</summary>
                                                    <div style={{ background: '#1e293b', color: '#e2e8f0', padding: '1rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.8rem', maxHeight: '300px', overflowY: 'auto' }}>
                                                        {run.logs || (
                                                            <span style={{ color: '#64748b' }}>ログ待機中...</span>
                                                        )}
                                                    </div>
                                                </details>

                                                {run.finished_at && (
                                                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280', textAlign: 'right' }}>
                                                        完了日時: {new Date(run.finished_at).toLocaleString()}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                                            実行履歴がありません
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
