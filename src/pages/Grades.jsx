import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { studentService, assignmentService, gradeService } from '../services';

const Grades = () => {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddAssignmentModalOpen, setIsAddAssignmentModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [studentsData, assignmentsData, gradesData] = await Promise.all([
        studentService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll()
      ]);
      setStudents(studentsData);
      setAssignments(assignmentsData);
      setGrades(gradesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load grades data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssignment = async (assignmentData) => {
    try {
      const newAssignment = await assignmentService.create(assignmentData);
      setAssignments(prev => [...prev, newAssignment]);
      setIsAddAssignmentModalOpen(false);
      toast.success('Assignment added successfully');
    } catch (err) {
      toast.error('Failed to add assignment');
    }
  };

  const handleGradeChange = async (studentId, assignmentId, score) => {
    try {
      const existingGrade = grades.find(
        grade => grade.studentId === studentId && grade.assignmentId === assignmentId
      );

      if (existingGrade) {
        const updatedGrade = await gradeService.update(existingGrade.id, {
          ...existingGrade,
          score: parseFloat(score)
        });
        setGrades(prev => 
          prev.map(grade => 
            grade.id === existingGrade.id ? updatedGrade : grade
          )
        );
      } else {
        const newGrade = await gradeService.create({
          studentId,
          assignmentId,
          score: parseFloat(score),
          submittedDate: new Date().toISOString()
        });
        setGrades(prev => [...prev, newGrade]);
      }
      toast.success('Grade updated successfully');
    } catch (err) {
      toast.error('Failed to update grade');
    }
  };

  const getGrade = (studentId, assignmentId) => {
    const grade = grades.find(
      grade => grade.studentId === studentId && grade.assignmentId === assignmentId
    );
    return grade?.score ?? '';
  };

  const getStudentAverage = (studentId) => {
    const studentGrades = grades.filter(grade => grade.studentId === studentId);
    if (studentGrades.length === 0) return null;
    
    const totalPoints = studentGrades.reduce((sum, grade) => sum + grade.score, 0);
    const maxPoints = studentGrades.length * 100; // Assuming 100 points per assignment
    return Math.round((totalPoints / maxPoints) * 100);
  };

  const getAssignmentAverage = (assignmentId) => {
    const assignmentGrades = grades.filter(grade => grade.assignmentId === assignmentId);
    if (assignmentGrades.length === 0) return null;
    
    const average = assignmentGrades.reduce((sum, grade) => sum + grade.score, 0) / assignmentGrades.length;
    return Math.round(average);
  };

  const getGradeColor = (score, totalPoints = 100) => {
    const percentage = (score / totalPoints) * 100;
    if (percentage >= 90) return 'text-success';
    if (percentage >= 80) return 'text-info';
    if (percentage >= 70) return 'text-warning';
    return 'text-error';
  };

  const AddAssignmentModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
      title: '',
      category: 'homework',
      totalPoints: 100,
      dueDate: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
      setFormData({
        title: '',
        category: 'homework',
        totalPoints: 100,
        dueDate: new Date().toISOString().split('T')[0]
      });
    };

    if (!isOpen) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-surface-900">
                Add New Assignment
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Chapter 5 Quiz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="homework">Homework</option>
                  <option value="quiz">Quiz</option>
                  <option value="test">Test</option>
                  <option value="project">Project</option>
                  <option value="participation">Participation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Total Points
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.totalPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalPoints: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-surface-200 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add Assignment
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-8 bg-surface-200 rounded w-48 animate-pulse"></div>
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-surface-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-200 rounded w-1/3"></div>
                  <div className="flex space-x-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-8 w-16 bg-surface-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-8 text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">
            Failed to Load Grades
          </h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-surface-900">
            Grades
          </h1>
          <p className="text-surface-600 mt-1">
            Manage assignments and track student performance
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddAssignmentModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Assignment</span>
        </motion.button>
      </div>

      {/* Assignments Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 text-sm font-medium">Total Assignments</p>
              <p className="text-3xl font-bold text-surface-900">{assignments.length}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <ApperIcon name="BookOpen" size={24} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 text-sm font-medium">Class Average</p>
              <p className="text-3xl font-bold text-info">
                {grades.length > 0 
                  ? Math.round(grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length)
                  : 0
                }%
              </p>
            </div>
            <div className="bg-info/10 p-3 rounded-lg">
              <ApperIcon name="TrendingUp" size={24} className="text-info" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 text-sm font-medium">Grades Entered</p>
              <p className="text-3xl font-bold text-success">{grades.length}</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg">
              <ApperIcon name="CheckCircle" size={24} className="text-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Grade Matrix */}
      {students.length === 0 || assignments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-12 text-center"
        >
          <ApperIcon name="BookOpen" size={48} className="text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">
            {students.length === 0 ? 'No students found' : 'No assignments yet'}
          </h3>
          <p className="text-surface-600 mb-4">
            {students.length === 0 
              ? 'Add students to your class to start entering grades'
              : 'Create your first assignment to begin grading'
            }
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (students.length === 0) {
                window.location.href = '/students';
              } else {
                setIsAddAssignmentModalOpen(true);
              }
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            {students.length === 0 ? 'Add Students' : 'Add Assignment'}
          </motion.button>
        </motion.div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  <th className="sticky left-0 bg-surface-50 text-left px-6 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider border-r border-surface-200">
                    Student
                  </th>
                  {assignments.map(assignment => (
                    <th key={assignment.id} className="text-center px-4 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider min-w-24">
                      <div>
                        <div className="font-semibold">{assignment.title}</div>
                        <div className="text-surface-400 normal-case">
                          {assignment.totalPoints} pts
                        </div>
                        <div className="text-surface-400 normal-case text-xs">
                          Avg: {getAssignmentAverage(assignment.id) ?? '--'}%
                        </div>
                      </div>
                    </th>
                  ))}
                  <th className="text-center px-4 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Average
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {students.map((student, index) => {
                  const studentAverage = getStudentAverage(student.id);
                  
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-surface-50 transition-colors"
                    >
                      <td className="sticky left-0 bg-white px-6 py-4 border-r border-surface-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-medium text-sm">
                              {student.firstName[0]}{student.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-surface-900 text-sm">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-xs text-surface-500">
                              Grade {student.gradeLevel}
                            </div>
                          </div>
                        </div>
                      </td>
                      {assignments.map(assignment => {
                        const grade = getGrade(student.id, assignment.id);
                        const percentage = grade ? Math.round((grade / assignment.totalPoints) * 100) : null;
                        
                        return (
                          <td key={assignment.id} className="px-4 py-4 text-center">
                            <input
                              type="number"
                              min="0"
                              max={assignment.totalPoints}
                              value={grade}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= assignment.totalPoints)) {
                                  handleGradeChange(student.id, assignment.id, value);
                                }
                              }}
                              className={`w-16 px-2 py-1 text-center border border-surface-200 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                                grade ? getGradeColor(grade, assignment.totalPoints) : ''
                              }`}
                              placeholder="--"
                            />
                            {percentage !== null && (
                              <div className={`text-xs mt-1 ${getGradeColor(grade, assignment.totalPoints)}`}>
                                {percentage}%
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-4 text-center">
                        <div className={`font-semibold ${
                          studentAverage !== null ? getGradeColor(studentAverage) : 'text-surface-400'
                        }`}>
                          {studentAverage !== null ? `${studentAverage}%` : '--'}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assignment List */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
          Assignments
        </h3>
        {assignments.length === 0 ? (
          <p className="text-surface-600 text-center py-8">
            No assignments created yet. Add your first assignment to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-surface-200 rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-surface-900">{assignment.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    assignment.category === 'test' ? 'bg-error/10 text-error' :
                    assignment.category === 'quiz' ? 'bg-warning/10 text-warning' :
                    assignment.category === 'project' ? 'bg-info/10 text-info' :
                    'bg-success/10 text-success'
                  }`}>
                    {assignment.category}
                  </span>
                </div>
                <div className="text-sm text-surface-600 space-y-1">
                  <div>Points: {assignment.totalPoints}</div>
                  <div>Due: {new Date(assignment.dueDate).toLocaleDateString()}</div>
                  <div>Average: {getAssignmentAverage(assignment.id) ?? '--'}%</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Assignment Modal */}
      <AddAssignmentModal
        isOpen={isAddAssignmentModalOpen}
        onClose={() => setIsAddAssignmentModalOpen(false)}
        onSubmit={handleAddAssignment}
      />
    </div>
  );
};

export default Grades;