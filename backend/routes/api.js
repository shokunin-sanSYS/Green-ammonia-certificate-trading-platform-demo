const express = require('express');
const router = express.Router();
const Certificate = require('../models/certificate');
const Transaction = require('../models/transaction');
const blockchainService = require('../services/blockchainService');
const { mockCertificates, mockTransactions, mockStats, generateSensorData } = require('../../data/mockData');

// インメモリデータストア
let certificates = [...mockCertificates];
let transactions = [...mockTransactions];

// 統計情報取得
router.get('/stats', (req, res) => {
  try {
    const stats = {
      ...mockStats,
      blockchain: blockchainService.getChainStats()
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// センサーデータ取得
router.get('/sensors', (req, res) => {
  try {
    const sensorData = generateSensorData();
    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 証書一覧取得
router.get('/certificates', (req, res) => {
  try {
    const { status, type, limit } = req.query;
    let filtered = certificates;

    if (status) {
      filtered = filtered.filter(cert => cert.status === status);
    }

    if (type) {
      filtered = filtered.filter(cert => cert.type === type);
    }

    if (limit) {
      filtered = filtered.slice(0, parseInt(limit));
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 証書詳細取得
router.get('/certificates/:id', (req, res) => {
  try {
    const certificate = certificates.find(cert => cert.id === req.params.id || cert.nftId === req.params.id);

    if (!certificate) {
      return res.status(404).json({ error: '証書が見つかりません' });
    }

    // ブロックチェーン検証
    const verification = blockchainService.verifyCertificate(certificate.nftId);

    res.json({
      certificate,
      verification
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 証書発行
router.post('/certificates', (req, res) => {
  try {
    const { amount, issuer, type } = req.body;

    if (!amount || !issuer || !type) {
      return res.status(400).json({ error: '必要なパラメータが不足しています' });
    }

    // 新規証書作成
    const certificate = new Certificate({
      amount: parseFloat(amount),
      issuer,
      type
    });

    // NFT発行（ブロックチェーン記録）
    const nft = blockchainService.mintNFT(certificate);
    certificate.nftId = nft.nftId;
    certificate.blockchainHash = nft.hash;

    certificates.push(certificate);

    res.status(201).json({
      certificate,
      nft,
      message: '証書が正常に発行されました'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 取引履歴取得
router.get('/transactions', (req, res) => {
  try {
    const { status, limit, sender, receiver } = req.query;
    let filtered = transactions;

    if (status) {
      filtered = filtered.filter(tx => tx.status === status);
    }

    if (sender) {
      filtered = filtered.filter(tx => tx.sender === sender);
    }

    if (receiver) {
      filtered = filtered.filter(tx => tx.receiver === receiver);
    }

    if (limit) {
      filtered = filtered.slice(0, parseInt(limit));
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 取引詳細取得
router.get('/transactions/:id', (req, res) => {
  try {
    const transaction = transactions.find(tx => tx.id === req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: '取引が見つかりません' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 取引作成
router.post('/transactions', (req, res) => {
  try {
    const { certificateId, sender, receiver, amount } = req.body;

    if (!certificateId || !sender || !receiver || !amount) {
      return res.status(400).json({ error: '必要なパラメータが不足しています' });
    }

    // 証書の存在確認
    const certificate = certificates.find(cert => cert.id === certificateId);
    if (!certificate) {
      return res.status(404).json({ error: '証書が見つかりません' });
    }

    // 取引作成
    const transaction = new Transaction({
      certificateId,
      nftId: certificate.nftId,
      sender,
      receiver,
      amount: parseFloat(amount),
      value: parseFloat(amount) * 150000, // 1トンあたり15万円と仮定
      status: 'pending'
    });

    // ブロックチェーンに記録
    blockchainService.addTransaction({
      type: 'TRANSFER',
      data: transaction,
      hash: transaction.blockchainHash
    });

    transactions.unshift(transaction);

    res.status(201).json({
      transaction,
      message: '取引が正常に作成されました'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 取引ステータス更新
router.patch('/transactions/:id', (req, res) => {
  try {
    const { status } = req.body;
    const transaction = transactions.find(tx => tx.id === req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: '取引が見つかりません' });
    }

    transaction.status = status;

    res.json({
      transaction,
      message: '取引ステータスが更新されました'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ブロックチェーン情報取得
router.get('/blockchain/stats', (req, res) => {
  try {
    const stats = blockchainService.getChainStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ブロック取得
router.get('/blockchain/blocks/:index', (req, res) => {
  try {
    const block = blockchainService.getBlockByIndex(parseInt(req.params.index));

    if (!block) {
      return res.status(404).json({ error: 'ブロックが見つかりません' });
    }

    res.json(block);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// チェーン検証
router.get('/blockchain/validate', (req, res) => {
  try {
    const isValid = blockchainService.validateChain();
    res.json({
      valid: isValid,
      message: isValid ? 'ブロックチェーンは有効です' : 'ブロックチェーンが破損しています'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// レポート生成
router.post('/reports', (req, res) => {
  try {
    const { reportType, startDate, endDate, format } = req.body;

    const report = {
      reportType,
      dateRange: `${startDate} ~ ${endDate}`,
      format,
      totalCertificates: certificates.length,
      totalVolume: certificates.reduce((sum, cert) => sum + cert.amount, 0),
      totalTransactions: transactions.length,
      totalValue: transactions.reduce((sum, tx) => sum + tx.value, 0),
      verificationRate: 99.2,
      generatedAt: new Date().toISOString(),
      summary: 'グリーンNH₃証書の取引が活発に行われています。NFT技術による改ざん防止システムは100%の稼働率を維持しています。'
    };

    res.json({
      report,
      message: 'レポートが正常に生成されました'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
