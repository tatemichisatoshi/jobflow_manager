# Jobflow Manager

Jobflow Manager は、社内利用を想定して設計されたバックグラウンドジョブ管理SaaSです。
ユーザーはパラメータ付きのジョブを作成し、Celeryワーカーによる非同期実行を行い、そのステータスや実行ログをWeb UIからリアルタイムに確認できます。

## 想定ユースケース

- 社内でのデータ収集・検証バッチの実行管理
- 定期・手動ジョブの実行履歴と結果の可視化
- 複数人で利用する業務ツールのバックグラウンド処理基盤

## 設計上のポイント

- **非同期処理の分離**: Celeryを採用し、Web/API層（FastAPI）と重い実行処理（Worker）を完全に分離することで、レスポンス性能と安定性を確保。
- **スケーラビリティを考慮したDB設計**: 将来的なデータ増大を見越し、ジョブ定義（Job）と実行履歴（JobRun）を正規化して分離。
- **実用性重視のUI**: 業務アプリケーションであることを前提に、過度な装飾を避け、情報の視認性と操作の明確さ（Readability）を最優先にデザイン。

## アーキテクチャ

- **認証・認可**: JWTを使用したセキュアなログイン（Admin/User権限の分離）。
- **ジョブ管理**: ジョブの作成、一覧表示、詳細確認。
- **非同期実行**: ジョブはRedisキューに登録され、Celeryワーカーによって非同期に処理されます。
- **リアルタイムステータス**: ジョブの状態遷移（Queued -> Running -> Success/Failed）を追跡可能。
- **ログ・結果確認**: 実行時のログや処理結果サマリを詳細画面で確認できます。

## 画面構成

- **ログイン画面**: 安全な認証フォーム。
- **ダッシュボード**: 全ジョブと実行履歴の一覧表示。
- **ジョブ詳細**: ジョブパラメータ、実行ログ、結果の確認。再実行ボタンも配置。

## アーキテクチャ

実運用を想定したモダンな構成を採用しています。

- **Frontend**: Next.js 14 (App Router), TypeScript, Vanilla CSS
- **Backend**: FastAPI, Python 3.11, SQLAlchemy (Async)
- **Database**: PostgreSQL (Data), Redis (Queue)
- **Worker**: Celery
- **Infrastructure**: Docker Compose, Docker
- **CI**: GitHub Actions

## ディレクトリ構成

```
jobflow-manager/
├── backend/          # FastAPI アプリケーション
│   ├── app/
│   │   ├── api/      # APIエンドポイント
│   │   ├── core/     # 認証・設定
│   │   ├── models/   # DBモデル
│   │   └── worker.py # Celeryタスク定義
│   ├── alembic/      # DBマイグレーション
│   └── tests/        # Pytest
├── frontend/         # Next.js アプリケーション
│   ├── src/
│   │   ├── app/      # ページコンポーネント
│   │   ├── components/
│   │   └── lib/      # APIクライアント
├── docker-compose.yml
└── Makefile          # 操作用コマンド
```

## 起動方法

### 前提条件

- Docker & Docker Compose
- Make (オプション)

### セットアップ手順

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/tatemichisatoshi/jobflow_manager.git
   cd jobflow_manager
   ```

2. **環境変数の設定**
   `.env.example` をコピーして `.env` を作成してください。
   ```bash
   cp .env.example .env
   # 必要に応じて frontend/.env.local も確認してください
   ```

3. **サービスの起動**
   ```bash
   make up
   # または
   docker compose up -d
   ```

4. **管理者ユーザーの作成**
   初期セットアップとして管理者ユーザーを作成します。
   ```bash
   make user-create
   ```
   *作成されるユーザー: `admin@example.com` / `admin`*

5. **アクセス**
   - フロントエンド: [http://localhost:3000](http://localhost:3000)
   - APIドキュメント: [http://localhost:8000/docs](http://localhost:8000/docs)

## 今後の拡張案

- **WebSocket対応**: [Issue #1](https://github.com/tatemichisatoshi/jobflow_manager/issues/1) - ポーリング不要でリアルタイムにステータス更新を反映。
- **定期実行**: [Issue #2](https://github.com/tatemichisatoshi/jobflow_manager/issues/2) - cronライクなスケジュールジョブ機能の追加。
- **通知連携**: [Issue #3](https://github.com/tatemichisatoshi/jobflow_manager/issues/3) - ジョブ完了時にSlack/Emailで通知を受け取る機能。
- **パラメータ検証**: JSON Schemaを用いたジョブパラメータの厳密なバリデーション。

## 開発用コマンド

- **バックエンドテスト実行**: `make test-backend`
- **フロントエンドLint**: `cd frontend && npm run lint`
