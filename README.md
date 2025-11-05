# グリーンNH₃レジストリシステム - デモプラットフォーム

グリーンアンモニア証明書取引プラットフォームのデモ実装。Book & Claim方式による証書管理、NFTによる改ざん防止、ブロックチェーン連携を実装したフルスタックデモアプリケーションです。

## 🌟 特徴

### 主要機能
- 📊 **リアルタイムダッシュボード** - 証書発行量、取引状況、センサーデータを可視化
- 🔐 **NFT証書発行** - ブロックチェーン技術による改ざん防止システム
- 🔄 **Book & Claim取引** - グリーンアンモニア証書の発行・取引管理
- 📈 **統計・レポート生成** - 月次、四半期、監査レポートの自動生成
- 🔍 **ブロックチェーン検証** - 証書の真正性をリアルタイムで検証
- 📡 **センサー統合監視** - NH₃濃度、流量、温度、圧力のリアルタイム監視

### 技術スタック
- **フロントエンド**: HTML5, CSS3, JavaScript (Vanilla)
- **バックエンド**: Node.js, Express.js
- **ブロックチェーン**: カスタム実装（Proof of Work）
- **データ管理**: In-Memory Store (デモ用)
- **準拠規格**: 環境省MRV, IMO, FIP

## 📁 プロジェクト構造

```
Green-ammonia-certificate-trading-platform-demo/
├── backend/
│   ├── models/              # データモデル
│   │   ├── certificate.js   # 証書モデル
│   │   └── transaction.js   # 取引モデル
│   ├── routes/              # APIルート
│   │   └── api.js          # REST APIエンドポイント
│   ├── services/            # ビジネスロジック
│   │   └── blockchainService.js  # ブロックチェーン実装
│   ├── utils/              # ユーティリティ
│   └── server.js           # メインサーバー
├── frontend/
│   └── index.html          # メインUIアプリケーション
├── data/
│   └── mockData.js         # モックデータ
├── public/                 # 静的リソース
├── package.json
├── .gitignore
└── README.md
```

## 🚀 セットアップ

### 必要要件
- Node.js >= 14.0.0
- npm >= 6.0.0

### インストール

1. リポジトリをクローン
```bash
git clone https://github.com/yourusername/Green-ammonia-certificate-trading-platform-demo.git
cd Green-ammonia-certificate-trading-platform-demo
```

2. 依存関係をインストール
```bash
npm install
```

3. サーバーを起動
```bash
npm start
```

または開発モード（ホットリロード有効）
```bash
npm run dev
```

4. ブラウザでアクセス
```
http://localhost:3000
```

## 📖 API ドキュメント

### 統計情報

#### GET /api/stats
システム全体の統計情報を取得

**レスポンス例:**
```json
{
  "totalCertificates": 1874,
  "totalVolume": 3456.7,
  "activeTrades": 47,
  "verificationRate": 99.2,
  "blockchain": {
    "blockCount": 15,
    "transactionCount": 42,
    "isValid": true
  }
}
```

### センサーデータ

#### GET /api/sensors
リアルタイムセンサーデータを取得

**レスポンス例:**
```json
{
  "nh3": { "value": "18.3", "unit": "ppm", "status": "online" },
  "flow": { "value": "195", "unit": "m³/h", "status": "online" },
  "temperature": { "value": "23.8", "unit": "°C", "status": "online" },
  "pressure": { "value": "8.67", "unit": "MPa", "status": "warning" }
}
```

### 証書管理

#### GET /api/certificates
証書一覧を取得

**クエリパラメータ:**
- `status`: フィルタリング (active, pending, completed)
- `type`: タイプでフィルタ (グリーンNH₃, Book & Claim)
- `limit`: 取得件数制限

#### POST /api/certificates
新規証書を発行

**リクエストボディ:**
```json
{
  "amount": 125.8,
  "issuer": "ABC商社",
  "type": "グリーンNH₃"
}
```

**レスポンス:**
```json
{
  "certificate": {
    "id": "CERT-001",
    "nftId": "NFT-GNH3-2024110100234",
    "amount": 125.8,
    "issuer": "ABC商社",
    "status": "active"
  },
  "nft": {
    "nftId": "NFT-GNH3-2024110100234",
    "hash": "0x7a8b9c...",
    "metadata": { ... }
  }
}
```

#### GET /api/certificates/:id
証書詳細とブロックチェーン検証結果を取得

### 取引管理

#### GET /api/transactions
取引履歴を取得

**クエリパラメータ:**
- `status`: ステータスでフィルタ
- `sender`: 送信者でフィルタ
- `receiver`: 受信者でフィルタ
- `limit`: 取得件数制限

#### POST /api/transactions
新規取引を作成

**リクエストボディ:**
```json
{
  "certificateId": "CERT-001",
  "sender": "ABC商社",
  "receiver": "XYZ発電",
  "amount": 45.2
}
```

#### PATCH /api/transactions/:id
取引ステータスを更新

### ブロックチェーン

#### GET /api/blockchain/stats
ブロックチェーン統計情報を取得

#### GET /api/blockchain/blocks/:index
指定インデックスのブロック情報を取得

#### GET /api/blockchain/validate
ブロックチェーンの整合性を検証

### レポート

#### POST /api/reports
レポートを生成

**リクエストボディ:**
```json
{
  "reportType": "monthly",
  "startDate": "2024-10-01",
  "endDate": "2024-11-01",
  "format": "pdf"
}
```

## 🎯 使用方法

### 1. ダッシュボード
- システム全体の統計情報をリアルタイムで表示
- センサーデータのモニタリング
- 証書発行量の推移グラフ
- 最新取引履歴

### 2. 証書管理
- 発行済み証書の一覧表示
- NFT IDとブロックチェーンハッシュの確認
- 証書ステータスの確認（有効、監査中、清算済）

### 3. 取引履歴
- 全取引の詳細履歴
- ブロックチェーンハッシュによる追跡
- 取引ステータスのリアルタイム更新

### 4. レポート生成
- 月次・四半期・監査レポートの生成
- PDF/Excel/CSV形式での出力
- カスタム期間指定

## 🔐 セキュリティ

- ブロックチェーン技術による改ざん防止
- Proof of Work による取引検証
- NFTによる証書の一意性保証
- SHA-256ハッシュアルゴリズム使用

## 🌍 準拠規格

- **環境省MRV**: モニタリング・報告・検証ガイドライン準拠
- **IMO**: 国際海事機関の排出削減目標対応
- **FIP**: 燃料調達の透明性確保

## 📊 デモデータ

デモには以下のモックデータが含まれています:
- 証書: 6件
- 取引: 6件
- ブロックチェーン: 創世ブロック + 追加ブロック

## 🛠️ 開発

### 開発モードで起動
```bash
npm run dev
```

### コード構造
- `backend/models/`: データモデル定義
- `backend/routes/`: APIエンドポイント
- `backend/services/`: ビジネスロジック（ブロックチェーン等）
- `frontend/`: ユーザーインターフェース
- `data/`: モックデータとテストデータ

## 🤝 貢献

このプロジェクトはデモンストレーション用途です。本番環境での使用には以下の追加実装が推奨されます:

- データベース統合（PostgreSQL, MongoDB等）
- 実際のブロックチェーンネットワーク連携（Ethereum, Polygon等）
- ユーザー認証・認可システム
- より高度なセキュリティ機能
- スケーラビリティの向上

## 📄 ライセンス

MIT License

## 📞 サポート

問題や質問がある場合は、GitHubのIssuesセクションで報告してください。

---

**注意**: このプロジェクトはデモンストレーション目的で作成されています。本番環境での使用前に適切なセキュリティレビューとテストを実施してください。
