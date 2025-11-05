class Transaction {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.certificateId = data.certificateId || '';
    this.nftId = data.nftId || '';
    this.sender = data.sender || '';
    this.receiver = data.receiver || '';
    this.amount = data.amount || 0;
    this.value = data.value || 0;
    this.status = data.status || 'pending';
    this.blockchainHash = data.blockchainHash || this.generateHash();
    this.timestamp = data.timestamp || new Date().toISOString();
  }

  generateId() {
    const now = new Date();
    const date = now.toISOString().split('T')[0].replace(/-/g, '');
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '').slice(0, 4);
    const random = Math.floor(Math.random() * 1000).toString().padStart(4, '0');
    return `TX-${date}-${time}`;
  }

  generateHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 6; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash + '...';
  }

  toJSON() {
    return {
      id: this.id,
      certificateId: this.certificateId,
      nftId: this.nftId,
      sender: this.sender,
      receiver: this.receiver,
      amount: this.amount,
      value: this.value,
      status: this.status,
      blockchainHash: this.blockchainHash,
      timestamp: this.timestamp
    };
  }
}

module.exports = Transaction;
