class Certificate {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.nftId = data.nftId || `NFT-GNH3-${this.generateNftId()}`;
    this.amount = data.amount || 0;
    this.issuer = data.issuer || '';
    this.type = data.type || 'グリーンNH₃';
    this.issueDate = data.issueDate || new Date().toISOString().split('T')[0];
    this.status = data.status || 'active';
    this.blockchainHash = data.blockchainHash || this.generateHash();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  generateId() {
    return `CERT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  generateNftId() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 100000);
    return `${timestamp.slice(-10)}${random.toString().padStart(5, '0')}`;
  }

  generateHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  toJSON() {
    return {
      id: this.id,
      nftId: this.nftId,
      amount: this.amount,
      issuer: this.issuer,
      type: this.type,
      issueDate: this.issueDate,
      status: this.status,
      blockchainHash: this.blockchainHash,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Certificate;
