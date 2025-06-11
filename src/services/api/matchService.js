import matchData from '../mockData/matches.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MatchService {
  constructor() {
    this.matches = [...matchData];
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  _getCacheKey(method, ...args) {
    return `${method}:${args.join(':')}`;
  }

  _getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  _setCache(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  async getAll() {
    await delay(300);
    return [...this.matches];
  }

  async getById(id) {
    await delay(200);
    const match = this.matches.find(match => match.id === id);
    if (!match) {
      throw new Error('Match not found');
    }
    return { ...match };
  }

  async create(matchData) {
    await delay(400);
    const newMatch = {
      ...matchData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.matches.push(newMatch);
    return { ...newMatch };
  }

  async update(id, matchData) {
    await delay(350);
    const index = this.matches.findIndex(match => match.id === id);
    if (index === -1) {
      throw new Error('Match not found');
    }
    this.matches[index] = { ...this.matches[index], ...matchData };
    return { ...this.matches[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.matches.findIndex(match => match.id === id);
    if (index === -1) {
      throw new Error('Match not found');
    }
this.matches.splice(index, 1);
    return true;
  }

  async getByUserId(userId) {
    const cacheKey = this._getCacheKey('getByUserId', userId);
    const cached = this._getFromCache(cacheKey);
    if (cached) return cached;
    
    await delay(250);
    const result = this.matches.filter(match => 
      match.teacherId === userId || match.learnerId === userId
    );
    return this._setCache(cacheKey, result);
  }
}

export default new MatchService();