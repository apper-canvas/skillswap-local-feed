import skillData from '../mockData/skills.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SkillService {
  constructor() {
    this.skills = [...skillData];
  }

  async getAll() {
    await delay(300);
    return [...this.skills];
  }

  async getById(id) {
    await delay(200);
    const skill = this.skills.find(skill => skill.id === id);
    if (!skill) {
      throw new Error('Skill not found');
    }
    return { ...skill };
  }

  async create(skillData) {
    await delay(400);
    const newSkill = {
      ...skillData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.skills.push(newSkill);
    return { ...newSkill };
  }

  async update(id, skillData) {
    await delay(350);
    const index = this.skills.findIndex(skill => skill.id === id);
    if (index === -1) {
      throw new Error('Skill not found');
    }
    this.skills[index] = { ...this.skills[index], ...skillData };
    return { ...this.skills[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.skills.findIndex(skill => skill.id === id);
    if (index === -1) {
      throw new Error('Skill not found');
    }
    this.skills.splice(index, 1);
    return true;
  }

  async getByCategory(category) {
    await delay(250);
    return this.skills.filter(skill => skill.category === category);
  }

  async getByUserId(userId) {
    await delay(250);
    return this.skills.filter(skill => skill.userId === userId);
  }
}

export default new SkillService();