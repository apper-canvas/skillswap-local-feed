import transactionData from '../mockData/transactions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TransactionService {
  constructor() {
    this.transactions = [...transactionData];
  }

  async getAll() {
    await delay(300);
    return [...this.transactions];
  }

  async getById(id) {
    await delay(200);
    const transaction = this.transactions.find(transaction => transaction.id === id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return { ...transaction };
  }

  async create(transactionData) {
    await delay(400);
    const newTransaction = {
      ...transactionData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    this.transactions.push(newTransaction);
    return { ...newTransaction };
  }

  async update(id, transactionData) {
    await delay(350);
    const index = this.transactions.findIndex(transaction => transaction.id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    this.transactions[index] = { ...this.transactions[index], ...transactionData };
    return { ...this.transactions[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.transactions.findIndex(transaction => transaction.id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    this.transactions.splice(index, 1);
    return true;
  }

  async getByUserId(userId) {
    await delay(250);
    return this.transactions.filter(transaction => 
      transaction.fromUserId === userId || transaction.toUserId === userId
    );
  }
}

export default new TransactionService();