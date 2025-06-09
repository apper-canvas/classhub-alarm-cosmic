import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { studentService, attendanceService } from '../services';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isWeekend } from 'date-fns';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ]);
      setStudents(studentsData);
      setAttendance(attendanceData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (studentId, date, status) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    try {
      // Find existing attendance record
      const existingRecord = attendance.find(
        record => record.studentId === studentId && record.date === dateStr
      );

      if (existingRecord) {
        // Update existing record
        const updatedRecord = await attendanceService.update(existingRecord.id, {
          ...existingRecord,
          status
        });
        setAttendance(prev => 
          prev.map(record => 
            record.id === existingRecord.id ? updatedRecord : record
          )
        );
      } else {
        // Create new record
        const newRecord = await attendanceService.create({
          studentId,
          date: dateStr,
          status,
          notes: ''
        });
        setAttendance(prev => [...prev, newRecord]);
      }
    } catch (err) {
      toast.error('Failed to mark attendance');
    }
  };

  const markAllPresent = async () => {
    setSaving(true);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    try {
      for (const student of students) {
        const existingRecord = attendance.find(
          record => record.studentId === student.id && record.date === dateStr
        );

        if (!existingRecord) {
          const newRecord = await attendanceService.create({
            studentId: student.id,
            date: dateStr,
            status: 'present',
            notes: ''
          });
          setAttendance(prev => [...prev, newRecord]);
        } else if (existingRecord.status !== 'present') {
          const updatedRecord = await attendanceService.update(existingRecord.id, {
            ...existingRecord,
            status: 'present'
          });
          setAttendance(prev => 
            prev.map(record => 
              record.id === existingRecord.id ? updatedRecord : record
            )
          );
        }
      }
      toast.success('All students marked present');
    } catch (err) {
      toast.error('Failed to mark all present');
    } finally {
      setSaving(false);
    }
  };

  const getAttendanceStatus = (studentId, date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const record = attendance.find(
      record => record.studentId === studentId && record.date === dateStr
    );
    return record?.status || null;
  };

  const getAttendanceStats = () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const todayRecords = attendance.filter(record => record.date === dateStr);
    const present = todayRecords.filter(record => record.status === 'present').length;
    const absent = todayRecords.filter(record => record.status === 'absent').length;
    const late = todayRecords.filter(record => record.status === 'late').length;
    const total = students.length;
    const unmarked = total - (present + absent + late);
    
    return { present, absent, late, unmarked, total };
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const stats = getAttendanceStats();

  const StatusButton = ({ status, currentStatus, onClick, icon, label, color }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
        currentStatus === status
          ? `${color} text-white`
          : `${color.replace('bg-', 'bg-').replace(/\/\d+/, '/10')} ${color.replace('bg-', 'text-').replace(/\/\d+/, '')}`
      }`}
    >
      <ApperIcon name={icon} size={12} />
      <span>{label}</span>
    </motion.button>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-8 bg-surface-200 rounded w-48 animate-pulse"></div>
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-surface-200 rounded-full"></div>
                <div className="flex-1 h-4 bg-surface-200 rounded"></div>
                <div className="w-32 h-4 bg-surface-200 rounded"></div>
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
            Failed to Load Attendance
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
            Attendance
          </h1>
          <p className="text-surface-600 mt-1">
            Track daily attendance for {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {isToday(selectedDate) && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={markAllPresent}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <ApperIcon name="Loader" size={16} className="animate-spin" />
              ) : (
                <ApperIcon name="CheckCircle" size={16} />
              )}
              <span>Mark All Present</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{stats.present}</div>
            <div className="text-sm text-surface-600">Present</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-error">{stats.absent}</div>
            <div className="text-sm text-surface-600">Absent</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{stats.late}</div>
            <div className="text-sm text-surface-600">Late</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-surface-600">{stats.unmarked}</div>
            <div className="text-sm text-surface-600">Unmarked</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
            </div>
            <div className="text-sm text-surface-600">Rate</div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      {students.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-12 text-center"
        >
          <ApperIcon name="Users" size={48} className="text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">
            No students found
          </h3>
          <p className="text-surface-600 mb-4">
            Add students to your class to start taking attendance
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/students'}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Add Students
          </motion.button>
        </motion.div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {students.map((student, index) => {
                  const currentStatus = getAttendanceStatus(student.id, selectedDate);
                  
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-surface-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-medium">
                              {student.firstName[0]}{student.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-surface-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-surface-500">
                              Grade {student.gradeLevel}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          {currentStatus ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              currentStatus === 'present' ? 'bg-success/10 text-success' :
                              currentStatus === 'absent' ? 'bg-error/10 text-error' :
                              currentStatus === 'late' ? 'bg-warning/10 text-warning' :
                              'bg-surface/10 text-surface'
                            }`}>
                              <ApperIcon 
                                name={
                                  currentStatus === 'present' ? 'Check' :
                                  currentStatus === 'absent' ? 'X' :
                                  currentStatus === 'late' ? 'Clock' : 'Minus'
                                } 
                                size={12} 
                                className="mr-1" 
                              />
                              {currentStatus === 'present' ? 'Present' :
                               currentStatus === 'absent' ? 'Absent' :
                               currentStatus === 'late' ? 'Late' : 'Unknown'}
                            </span>
                          ) : (
                            <span className="text-surface-400 text-sm">Not marked</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-2">
                          <StatusButton
                            status="present"
                            currentStatus={currentStatus}
                            onClick={() => markAttendance(student.id, selectedDate, 'present')}
                            icon="Check"
                            label="Present"
                            color="bg-success"
                          />
                          <StatusButton
                            status="late"
                            currentStatus={currentStatus}
                            onClick={() => markAttendance(student.id, selectedDate, 'late')}
                            icon="Clock"
                            label="Late"
                            color="bg-warning"
                          />
                          <StatusButton
                            status="absent"
                            currentStatus={currentStatus}
                            onClick={() => markAttendance(student.id, selectedDate, 'absent')}
                            icon="X"
                            label="Absent"
                            color="bg-error"
                          />
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

      {/* Monthly Calendar View */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-semibold text-surface-900">
            {format(currentDate, 'MMMM yyyy')} Overview
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
              className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
              className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-surface-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {monthDays.map(day => {
            const dayAttendance = attendance.filter(
              record => record.date === format(day, 'yyyy-MM-dd')
            );
            const presentCount = dayAttendance.filter(record => record.status === 'present').length;
            const attendanceRate = students.length > 0 ? (presentCount / students.length) * 100 : 0;
            
            return (
              <motion.button
                key={day.toISOString()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(day)}
                className={`p-2 rounded-lg text-center transition-all ${
                  isSameDay(day, selectedDate)
                    ? 'bg-primary text-white'
                    : isToday(day)
                    ? 'bg-primary/10 text-primary'
                    : isWeekend(day)
                    ? 'text-surface-400'
                    : 'text-surface-900 hover:bg-surface-100'
                }`}
              >
                <div className="text-sm font-medium">{format(day, 'd')}</div>
                {!isWeekend(day) && dayAttendance.length > 0 && (
                  <div className="text-xs mt-1">
                    <div className={`h-1 rounded-full ${
                      attendanceRate >= 90 ? 'bg-success' :
                      attendanceRate >= 75 ? 'bg-warning' :
                      'bg-error'
                    }`} style={{ width: `${Math.max(attendanceRate, 10)}%` }}></div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Attendance;