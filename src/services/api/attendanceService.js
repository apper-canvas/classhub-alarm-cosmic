import attendanceData from '../mockData/attendance.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let attendance = [...attendanceData];

const attendanceService = {
  async getAll() {
    await delay(200);
    return [...attendance];
  },

  async getById(id) {
    await delay(150);
    const record = attendance.find(a => a.id === id);
    if (!record) {
      throw new Error('Attendance record not found');
    }
    return { ...record };
  },

  async create(attendanceData) {
    await delay(300);
    const newRecord = {
      ...attendanceData,
      id: Date.now().toString()
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  async update(id, updates) {
    await delay(250);
    const index = attendance.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Attendance record not found');
    }
    attendance[index] = { ...attendance[index], ...updates };
    return { ...attendance[index] };
  },

  async delete(id) {
    await delay(200);
    const index = attendance.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Attendance record not found');
    }
    attendance.splice(index, 1);
    return true;
  },

  async getByStudentId(studentId) {
    await delay(150);
    return attendance.filter(a => a.studentId === studentId);
  },

  async getByDate(date) {
    await delay(150);
    return attendance.filter(a => a.date === date);
  }
};

export default attendanceService;