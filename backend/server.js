const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静的ファイル提供
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// APIルート
app.use('/api', apiRoutes);

// ルートパス
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404ハンドラ
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

// エラーハンドラ
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  グリーンNH₃レジストリシステム - デモサーバー          ║
╚══════════════════════════════════════════════════════════╝

✓ サーバーが起動しました
✓ ポート: ${PORT}
✓ URL: http://localhost:${PORT}
✓ API: http://localhost:${PORT}/api
✓ ブロックチェーン: 稼働中
✓ NFT発行システム: 有効

利用可能なエンドポイント:
  GET  /api/stats              - 統計情報
  GET  /api/sensors            - センサーデータ
  GET  /api/certificates       - 証書一覧
  POST /api/certificates       - 証書発行
  GET  /api/transactions       - 取引履歴
  POST /api/transactions       - 取引作成
  GET  /api/blockchain/stats   - ブロックチェーン統計
  POST /api/reports            - レポート生成

準拠規格: 環境省MRV / IMO / FIP
  `);
});

module.exports = app;
