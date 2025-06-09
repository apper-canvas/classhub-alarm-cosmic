import studentData from '../mockData/students.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let students = [...studentData];

const studentService = {
  async getAll() {
    await delay(200);
    return [...students];
  },

  async getById(id) {
    await delay(150);
    const student = students.find(s => s.id === id);
    if (!student) {
      throw new Error('Student not found');
    }
    return { ...student };
  },

  async create(studentData) {
    await delay(300);
    const newStudent = {
      ...studentData,
      id: Date.now().toString(),
      enrollmentDate: new Date().toISOString(),
      status: 'active'
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, updates) {
    await delay(250);
    const index = students.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Student not found');
    }
    students[index] = { ...students[index], ...updates };
    return { ...students[index] };
  },

  async delete(id) {
    await delay(200);
    const index = students.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Student not found');
    }
    students.splice(index, 1);
    return true;
  }
};

export default studentService;