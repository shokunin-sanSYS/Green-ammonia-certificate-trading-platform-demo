const Certificate = require('../backend/models/certificate');
const Transaction = require('../backend/models/transaction');

// モック証書データ
const mockCertificates = [
  new Certificate({
    id: 'CERT-001',
    nftId: 'NFT-GNH3-2024110100234',
    amount: 125.8,
    issuer: 'ABC商社',
    type: 'グリーンNH₃',
    issueDate: '2024-10-28',
    status: 'active',
    blockchainHash: '0x7a8b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b'
  }),
  new Certificate({
    id: 'CERT-002',
    nftId: 'NFT-GNH3-2024110100189',
    amount: 87.3,
    issuer: 'XYZ海運',
    type: 'Book & Claim',
    issueDate: '2024-10-27',
    status: 'completed',
    blockchainHash: '0x4d5e6f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9'
  }),
  new Certificate({
    id: 'CERT-003',
    nftId: 'NFT-GNH3-2024110100145',
    amount: 203.6,
    issuer: 'DEF発電',
    type: 'グリーンNH₃',
    issueDate: '2024-10-26',
    status: 'pending',
    blockchainHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2'
  }),
  new Certificate({
    id: 'CERT-004',
    nftId: 'NFT-GNH3-2024110100098',
    amount: 156.2,
    issuer: 'GHI商社',
    type: 'グリーンNH₃',
    issueDate: '2024-10-25',
    status: 'active',
    blockchainHash: '0x9e8f7d6c5b4a3e2f1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9e8'
  }),
  new Certificate({
    id: 'CERT-005',
    nftId: 'NFT-GNH3-2024110100067',
    amount: 92.4,
    issuer: 'JKL海運',
    type: 'Book & Claim',
    issueDate: '2024-10-24',
    status: 'active',
    blockchainHash: '0x6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7'
  }),
  new Certificate({
    id: 'CERT-006',
    nftId: 'NFT-GNH3-2024110100023',
    amount: 178.9,
    issuer: 'MNO発電',
    type: 'グリーンNH₃',
    issueDate: '2024-10-23',
    status: 'completed',
    blockchainHash: '0x3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4'
  })
];

// モック取引データ
const mockTransactions = [
  new Transaction({
    id: 'TX-20241101-0847',
    certificateId: 'CERT-001',
    nftId: 'NFT-GNH3-2024110100234',
    sender: 'ABC商社',
    receiver: 'XYZ発電',
    amount: 45.2,
    value: 6780000,
    status: 'active',
    blockchainHash: '0x7a8b9c...',
    timestamp: '2024-11-01T14:23:11+09:00'
  }),
  new Transaction({
    id: 'TX-20241101-0846',
    certificateId: 'CERT-002',
    nftId: 'NFT-GNH3-2024110100189',
    sender: 'XYZ海運',
    receiver: 'DEF商社',
    amount: 78.9,
    value: 11835000,
    status: 'completed',
    blockchainHash: '0x4d5e6f...',
    timestamp: '2024-11-01T14:18:45+09:00'
  }),
  new Transaction({
    id: 'TX-20241101-0845',
    certificateId: 'CERT-003',
    nftId: 'NFT-GNH3-2024110100145',
    sender: 'DEF発電',
    receiver: 'GHI海運',
    amount: 120.5,
    value: 18075000,
    status: 'pending',
    blockchainHash: '0x1a2b3c...',
    timestamp: '2024-11-01T14:05:32+09:00'
  }),
  new Transaction({
    id: 'TX-20241101-0844',
    certificateId: 'CERT-004',
    nftId: 'NFT-GNH3-2024110100098',
    sender: 'GHI商社',
    receiver: 'JKL発電',
    amount: 63.7,
    value: 9555000,
    status: 'completed',
    blockchainHash: '0x9e8f7d...',
    timestamp: '2024-11-01T13:52:18+09:00'
  }),
  new Transaction({
    id: 'TX-20241101-0843',
    certificateId: 'CERT-005',
    nftId: 'NFT-GNH3-2024110100067',
    sender: 'JKL海運',
    receiver: 'ABC商社',
    amount: 92.4,
    value: 13860000,
    status: 'completed',
    blockchainHash: '0x6c7d8e...',
    timestamp: '2024-11-01T13:38:52+09:00'
  }),
  new Transaction({
    id: 'TX-20241101-0842',
    certificateId: 'CERT-006',
    nftId: 'NFT-GNH3-2024110100023',
    sender: 'MNO発電',
    receiver: 'PQR海運',
    amount: 178.9,
    value: 26835000,
    status: 'completed',
    blockchainHash: '0x3b4c5d...',
    timestamp: '2024-11-01T13:21:37+09:00'
  })
];

// 統計データ
const mockStats = {
  totalCertificates: 1874,
  totalVolume: 3456.7,
  activeTrades: 47,
  verificationRate: 99.2,
  monthlyVolume: 518.4,
  verificationBreakdown: {
    verified: 1856,
    pending: 12,
    failed: 3
  },
  monthlyIssuance: [
    { month: '7月', value: 245 },
    { month: '8月', value: 565 },
    { month: '9月', value: 389 },
    { month: '10月', value: 312 },
    { month: '11月', value: 23 }
  ]
};

// センサーデータ生成関数
function generateSensorData() {
  return {
    nh3: {
      value: (Math.random() * 5 + 15).toFixed(1),
      unit: 'ppm',
      location: 'プラントA',
      status: 'online'
    },
    flow: {
      value: (Math.random() * 20 + 180).toFixed(0),
      unit: 'm³/h',
      location: '供給ライン',
      status: 'online'
    },
    temperature: {
      value: (Math.random() * 3 + 22).toFixed(1),
      unit: '°C',
      location: '貯蔵タンク',
      status: 'online'
    },
    pressure: {
      value: (Math.random() * 0.3 + 8.5).toFixed(2),
      unit: 'MPa',
      location: '配管システム',
      status: 'warning'
    }
  };
}

module.exports = {
  mockCertificates,
  mockTransactions,
  mockStats,
  generateSensorData
};
