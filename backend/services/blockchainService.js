const crypto = require('crypto');

class BlockchainService {
  constructor() {
    this.blocks = [];
    this.pendingTransactions = [];
    this.difficulty = 2;
    this.miningReward = 0;

    // 創世ブロックを作成
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    const genesisBlock = {
      index: 0,
      timestamp: new Date('2024-01-01').toISOString(),
      transactions: [],
      nonce: 0,
      hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      previousHash: '0'
    };
    this.blocks.push(genesisBlock);
  }

  getLatestBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  calculateHash(index, timestamp, transactions, nonce, previousHash) {
    const data = index + timestamp + JSON.stringify(transactions) + nonce + previousHash;
    return '0x' + crypto.createHash('sha256').update(data).digest('hex');
  }

  mineBlock(transactions) {
    const index = this.blocks.length;
    const timestamp = new Date().toISOString();
    const previousHash = this.getLatestBlock().hash;
    let nonce = 0;
    let hash = this.calculateHash(index, timestamp, transactions, nonce, previousHash);

    // プルーフ・オブ・ワーク（簡易版）
    while (!hash.startsWith('0x' + '0'.repeat(this.difficulty))) {
      nonce++;
      hash = this.calculateHash(index, timestamp, transactions, nonce, previousHash);
    }

    const block = {
      index,
      timestamp,
      transactions,
      nonce,
      hash,
      previousHash
    };

    this.blocks.push(block);
    return block;
  }

  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);

    // トランザクションが一定数溜まったら自動的にブロックをマイニング
    if (this.pendingTransactions.length >= 3) {
      return this.minePendingTransactions();
    }

    return null;
  }

  minePendingTransactions() {
    if (this.pendingTransactions.length === 0) {
      return null;
    }

    const block = this.mineBlock(this.pendingTransactions);
    this.pendingTransactions = [];

    return block;
  }

  validateChain() {
    for (let i = 1; i < this.blocks.length; i++) {
      const currentBlock = this.blocks[i];
      const previousBlock = this.blocks[i - 1];

      // 現在のブロックのハッシュを検証
      const calculatedHash = this.calculateHash(
        currentBlock.index,
        currentBlock.timestamp,
        currentBlock.transactions,
        currentBlock.nonce,
        currentBlock.previousHash
      );

      if (currentBlock.hash !== calculatedHash) {
        return false;
      }

      // 前のブロックとの繋がりを検証
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

  getChainStats() {
    return {
      blockCount: this.blocks.length,
      transactionCount: this.blocks.reduce((sum, block) => sum + block.transactions.length, 0),
      pendingTransactions: this.pendingTransactions.length,
      isValid: this.validateChain(),
      latestBlock: this.getLatestBlock()
    };
  }

  getBlockByHash(hash) {
    return this.blocks.find(block => block.hash === hash);
  }

  getBlockByIndex(index) {
    return this.blocks[index];
  }

  getTransactionByHash(txHash) {
    for (const block of this.blocks) {
      const transaction = block.transactions.find(tx => tx.hash === txHash);
      if (transaction) {
        return {
          transaction,
          block: {
            index: block.index,
            hash: block.hash,
            timestamp: block.timestamp
          }
        };
      }
    }
    return null;
  }

  // NFT発行シミュレーション
  mintNFT(certificateData) {
    const nftId = `NFT-GNH3-${Date.now()}${Math.floor(Math.random() * 100000)}`;
    const nftData = {
      nftId,
      certificateId: certificateData.id,
      amount: certificateData.amount,
      issuer: certificateData.issuer,
      type: certificateData.type,
      metadata: {
        standard: 'ERC-721',
        name: `Green Ammonia Certificate #${certificateData.id}`,
        description: `${certificateData.amount}トンのグリーンアンモニア証書`,
        image: `ipfs://QmExample${Math.floor(Math.random() * 1000000)}`,
        attributes: [
          { trait_type: 'Type', value: certificateData.type },
          { trait_type: 'Amount', value: certificateData.amount },
          { trait_type: 'Issuer', value: certificateData.issuer }
        ]
      },
      timestamp: new Date().toISOString()
    };

    const hash = this.calculateHash(
      nftData.nftId,
      nftData.timestamp,
      nftData.metadata,
      0,
      this.getLatestBlock().hash
    );

    nftData.hash = hash;

    // ブロックチェーンに記録
    this.addTransaction({
      type: 'NFT_MINT',
      data: nftData,
      hash
    });

    return nftData;
  }

  // 証書検証
  verifyCertificate(nftId) {
    for (const block of this.blocks) {
      for (const transaction of block.transactions) {
        if (transaction.type === 'NFT_MINT' && transaction.data.nftId === nftId) {
          return {
            valid: true,
            nft: transaction.data,
            block: {
              index: block.index,
              hash: block.hash,
              timestamp: block.timestamp
            }
          };
        }
      }
    }

    return {
      valid: false,
      message: 'NFTが見つかりませんでした'
    };
  }
}

// シングルトンインスタンス
const blockchainService = new BlockchainService();

module.exports = blockchainService;
