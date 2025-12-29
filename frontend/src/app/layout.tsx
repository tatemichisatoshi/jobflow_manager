import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using a font is standard, but user said "Vanilla CSS". Fonts are OK.
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jobflow Manager - ジョブ管理SaaS",
  description: "バックグラウンドジョブ管理システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Sidebar */}
            <aside style={{ width: '260px', background: '#1e293b', color: 'white', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'white', background: 'none', WebkitTextFillColor: 'initial' }}>
                  Jobflow Manager
                </h1>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Enterprise Edition</span>
              </div>
              <nav style={{ flex: 1, padding: '1.5rem 1rem' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="/dashboard" style={{ display: 'block', padding: '0.75rem 1rem', borderRadius: '6px', background: '#334155', color: 'white', textDecoration: 'none', fontWeight: 500 }}>
                      📊 ダッシュボード
                    </a>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="/jobs/new" style={{ display: 'block', padding: '0.75rem 1rem', borderRadius: '6px', color: '#cbd5e1', textDecoration: 'none', transition: 'background 0.2s' }}>
                      ➕ 新規ジョブ作成
                    </a>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="/settings" style={{ display: 'block', padding: '0.75rem 1rem', borderRadius: '6px', color: '#cbd5e1', textDecoration: 'none' }}>
                      ⚙️ 設定
                    </a>
                  </li>
                </ul>
              </nav>
              <div style={{ padding: '1rem', borderTop: '1px solid #334155', fontSize: '0.8rem', color: '#64748b' }}>
                v1.0.0
              </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <header style={{ height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  組織: <strong>開発本部</strong> / プロジェクト: <strong>Jobflow</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                    U
                  </div>
                </div>
              </header>

              {/* Page Content */}
              <div style={{ padding: '2rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
