# API リファレンス

グリーンNH₃レジストリシステムのREST APIドキュメント

## ベースURL

```
http://localhost:3000/api
```

## 認証

現在のデモバージョンでは認証は実装されていません。本番環境では適切な認証機能を実装してください。

## エンドポイント一覧

### 統計情報

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/stats | システム統計情報を取得 |
| GET | /api/sensors | センサーデータを取得 |

### 証書管理

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/certificates | 証書一覧を取得 |
| GET | /api/certificates/:id | 証書詳細を取得 |
| POST | /api/certificates | 新規証書を発行 |

### 取引管理

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/transactions | 取引履歴を取得 |
| GET | /api/transactions/:id | 取引詳細を取得 |
| POST | /api/transactions | 新規取引を作成 |
| PATCH | /api/transactions/:id | 取引ステータスを更新 |

### ブロックチェーン

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/blockchain/stats | ブロックチェーン統計 |
| GET | /api/blockchain/blocks/:index | ブロック詳細を取得 |
| GET | /api/blockchain/validate | チェーンを検証 |

### レポート

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| POST | /api/reports | レポートを生成 |

## 詳細仕様

### GET /api/stats

システム全体の統計情報を取得します。

**レスポンス**
```json
{
  "totalCertificates": 1874,
  "totalVolume": 3456.7,
  "activeTrades": 47,
  "verificationRate": 99.2,
  "monthlyVolume": 518.4,
  "blockchain": {
    "blockCount": 15,
    "transactionCount": 42,
    "pendingTransactions": 2,
    "isValid": true
  }
}
```

### GET /api/sensors

リアルタイムセンサーデータを取得します。

**レスポンス**
```json
{
  "nh3": {
    "value": "18.3",
    "unit": "ppm",
    "location": "プラントA",
    "status": "online"
  },
  "flow": {
    "value": "195",
    "unit": "m³/h",
    "location": "供給ライン",
    "status": "online"
  },
  "temperature": {
    "value": "23.8",
    "unit": "°C",
    "location": "貯蔵タンク",
    "status": "online"
  },
  "pressure": {
    "value": "8.67",
    "unit": "MPa",
    "location": "配管システム",
    "status": "warning"
  }
}
```

### GET /api/certificates

証書一覧を取得します。

**クエリパラメータ**
- `status` (string, optional): 証書ステータスでフィルタ (active, pending, completed)
- `type` (string, optional): 証書タイプでフィルタ (グリーンNH₃, Book & Claim)
- `limit` (number, optional): 取得件数の上限

**レスポンス**
```json
[
  {
    "id": "CERT-001",
    "nftId": "NFT-GNH3-2024110100234",
    "amount": 125.8,
    "issuer": "ABC商社",
    "type": "グリーンNH₃",
    "issueDate": "2024-10-28",
    "status": "active",
    "blockchainHash": "0x7a8b9c...",
    "createdAt": "2024-10-28T10:00:00Z",
    "updatedAt": "2024-10-28T10:00:00Z"
  }
]
```

### POST /api/certificates

新規証書を発行し、NFTをミントします。

**リクエストボディ**
```json
{
  "amount": 125.8,
  "issuer": "ABC商社",
  "type": "グリーンNH₃"
}
```

**レスポンス**
```json
{
  "certificate": {
    "id": "CERT-001",
    "nftId": "NFT-GNH3-2024110100234",
    "amount": 125.8,
    "issuer": "ABC商社",
    "type": "グリーンNH₃",
    "status": "active",
    "blockchainHash": "0x7a8b9c..."
  },
  "nft": {
    "nftId": "NFT-GNH3-2024110100234",
    "hash": "0x7a8b9c...",
    "metadata": {
      "standard": "ERC-721",
      "name": "Green Ammonia Certificate #CERT-001",
      "description": "125.8トンのグリーンアンモニア証書",
      "attributes": [...]
    }
  },
  "message": "証書が正常に発行されました"
}
```

### GET /api/certificates/:id

証書詳細とブロックチェーン検証結果を取得します。

**パラメータ**
- `id`: 証書IDまたはNFT ID

**レスポンス**
```json
{
  "certificate": {
    "id": "CERT-001",
    "nftId": "NFT-GNH3-2024110100234",
    "amount": 125.8,
    "issuer": "ABC商社",
    "type": "グリーンNH₃",
    "status": "active"
  },
  "verification": {
    "valid": true,
    "nft": {...},
    "block": {
      "index": 5,
      "hash": "0x7a8b9c...",
      "timestamp": "2024-10-28T10:00:00Z"
    }
  }
}
```

### POST /api/transactions

新規取引を作成し、ブロックチェーンに記録します。

**リクエストボディ**
```json
{
  "certificateId": "CERT-001",
  "sender": "ABC商社",
  "receiver": "XYZ発電",
  "amount": 45.2
}
```

**レスポンス**
```json
{
  "transaction": {
    "id": "TX-20241101-0847",
    "certificateId": "CERT-001",
    "nftId": "NFT-GNH3-2024110100234",
    "sender": "ABC商社",
    "receiver": "XYZ発電",
    "amount": 45.2,
    "value": 6780000,
    "status": "pending",
    "blockchainHash": "0x7a8b9c...",
    "timestamp": "2024-11-01T14:23:11+09:00"
  },
  "message": "取引が正常に作成されました"
}
```

### GET /api/blockchain/stats

ブロックチェーンの統計情報を取得します。

**レスポンス**
```json
{
  "blockCount": 15,
  "transactionCount": 42,
  "pendingTransactions": 2,
  "isValid": true,
  "latestBlock": {
    "index": 14,
    "hash": "0x7a8b9c...",
    "timestamp": "2024-11-01T14:23:11+09:00",
    "transactions": [...]
  }
}
```

### GET /api/blockchain/validate

ブロックチェーンの整合性を検証します。

**レスポンス**
```json
{
  "valid": true,
  "message": "ブロックチェーンは有効です"
}
```

### POST /api/reports

レポートを生成します。

**リクエストボディ**
```json
{
  "reportType": "monthly",
  "startDate": "2024-10-01",
  "endDate": "2024-11-01",
  "format": "pdf"
}
```

**レポートタイプ**
- `monthly`: 月次レポート
- `quarterly`: 四半期レポート
- `audit`: 監査レポート
- `transaction`: 取引履歴レポート

**出力形式**
- `pdf`: PDF形式
- `excel`: Excel形式
- `csv`: CSV形式

**レスポンス**
```json
{
  "report": {
    "reportType": "monthly",
    "dateRange": "2024-10-01 ~ 2024-11-01",
    "format": "pdf",
    "totalCertificates": 1874,
    "totalVolume": 3456.7,
    "totalTransactions": 156,
    "totalValue": 518400000,
    "verificationRate": 99.2,
    "generatedAt": "2024-11-01T15:30:00+09:00"
  },
  "message": "レポートが正常に生成されました"
}
```

## エラーレスポンス

すべてのエラーは以下の形式で返されます：

```json
{
  "error": "エラーメッセージ"
}
```

### HTTPステータスコード

- `200 OK`: 成功
- `201 Created`: リソース作成成功
- `400 Bad Request`: リクエストパラメータエラー
- `404 Not Found`: リソースが見つからない
- `500 Internal Server Error`: サーバーエラー

## 使用例

### curl

```bash
# 統計情報取得
curl http://localhost:3000/api/stats

# 証書発行
curl -X POST http://localhost:3000/api/certificates \
  -H "Content-Type: application/json" \
  -d '{"amount": 125.8, "issuer": "ABC商社", "type": "グリーンNH₃"}'

# 取引作成
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"certificateId": "CERT-001", "sender": "ABC商社", "receiver": "XYZ発電", "amount": 45.2}'
```

### JavaScript (fetch)

```javascript
// 証書一覧取得
const certificates = await fetch('http://localhost:3000/api/certificates')
  .then(res => res.json());

// 証書発行
const newCertificate = await fetch('http://localhost:3000/api/certificates', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 125.8,
    issuer: 'ABC商社',
    type: 'グリーンNH₃'
  })
}).then(res => res.json());
```

## レート制限

現在のデモバージョンではレート制限は実装されていません。本番環境では適切なレート制限を実装してください。

## 変更履歴

### v1.0.0 (2024-11-01)
- 初回リリース
- 基本的なCRUD操作をサポート
- ブロックチェーン統合
- NFT発行機能
