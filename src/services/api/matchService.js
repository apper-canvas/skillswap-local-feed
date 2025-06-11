import matchData from '../mockData/matches.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MatchService {
  constructor() {
    this.matches = [...matchData];
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
    await delay(250);
    return this.matches.filter(match => 
      match.teacherId === userId || match.learnerId === userId
    );
  }
}

export default new MatchService();