import gradeData from '../mockData/grades.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let grades = [...gradeData];

const gradeService = {
  async getAll() {
    await delay(200);
    return [...grades];
  },

  async getById(id) {
    await delay(150);
    const grade = grades.find(g => g.id === id);
    if (!grade) {
      throw new Error('Grade not found');
    }
    return { ...grade };
  },

  async create(gradeData) {
    await delay(300);
    const newGrade = {
      ...gradeData,
      id: Date.now().toString()
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, updates) {
    await delay(250);
    const index = grades.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Grade not found');
    }
    grades[index] = { ...grades[index], ...updates };
    return { ...grades[index] };
  },

  async delete(id) {
    await delay(200);
    const index = grades.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Grade not found');
    }
    grades.splice(index, 1);
    return true;
  },

  async getByStudentId(studentId) {
    await delay(150);
    return grades.filter(g => g.studentId === studentId);
  },

  async getByAssignmentId(assignmentId) {
    await delay(150);
    return grades.filter(g => g.assignmentId === assignmentId);
  }
};

export default gradeService;