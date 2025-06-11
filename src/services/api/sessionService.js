import sessionData from '../mockData/sessions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SessionService {
  constructor() {
    this.sessions = [...sessionData];
  }

  async getAll() {
    await delay(300);
    return [...this.sessions];
  }

  async getById(id) {
    await delay(200);
    const session = this.sessions.find(session => session.id === id);
    if (!session) {
      throw new Error('Session not found');
    }
    return { ...session };
  }

  async create(sessionData) {
    await delay(400);
    const newSession = {
      ...sessionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.sessions.push(newSession);
    return { ...newSession };
  }

  async update(id, sessionData) {
    await delay(350);
    const index = this.sessions.findIndex(session => session.id === id);
    if (index === -1) {
      throw new Error('Session not found');
    }
    this.sessions[index] = { ...this.sessions[index], ...sessionData };
    return { ...this.sessions[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.sessions.findIndex(session => session.id === id);
    if (index === -1) {
      throw new Error('Session not found');
    }
    this.sessions.splice(index, 1);
    return true;
  }

  async getByMatchId(matchId) {
    await delay(250);
    return this.sessions.filter(session => session.matchId === matchId);
  }
}

export default new SessionService();