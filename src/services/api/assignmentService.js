import assignmentData from '../mockData/assignments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let assignments = [...assignmentData];

const assignmentService = {
  async getAll() {
    await delay(200);
    return [...assignments];
  },

  async getById(id) {
    await delay(150);
    const assignment = assignments.find(a => a.id === id);
    if (!assignment) {
      throw new Error('Assignment not found');
    }
    return { ...assignment };
  },

  async create(assignmentData) {
    await delay(300);
    const newAssignment = {
      ...assignmentData,
      id: Date.now().toString()
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, updates) {
    await delay(250);
    const index = assignments.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Assignment not found');
    }
    assignments[index] = { ...assignments[index], ...updates };
    return { ...assignments[index] };
  },

  async delete(id) {
    await delay(200);
    const index = assignments.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Assignment not found');
    }
    assignments.splice(index, 1);
    return true;
  }
};

export default assignmentService;