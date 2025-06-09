import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from './ApperIcon';
import { studentService, attendanceService } from '../services';

const MainFeature = () => {
  const [quickStats, setQuickStats] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    attendanceRate: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadQuickStats();
  }, []);

  const loadQuickStats = async () => {
    try {
      const [students, attendance] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ]);

      const today = new Date().toISOString().split('T')[0];
      const todayRecords = attendance.filter(record => 
        record.date.startsWith(today)
      );
      const presentToday = todayRecords.filter(record => 
        record.status === 'present'
      ).length;
      
      const attendanceRate = students.length > 0 
        ? Math.round((presentToday / students.length) * 100)
        : 0;

      // Get recent activity (last 3 attendance records)
      const recentActivity = attendance
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3)
        .map(record => {
          const student = students.find(s => s.id === record.studentId);
          return {
            id: record.id,
            studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
            status: record.status,
            date: record.date
          };
        });

      setQuickStats({
        totalStudents: students.length,
        todayAttendance: presentToday,
        attendanceRate,
        recentActivity
      });
    } catch (err) {
      console.error('Failed to load quick stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Take Attendance',
      description: 'Mark today\'s attendance quickly',
      icon: 'Calendar',
      color: 'bg-success',
      action: () => navigate('/attendance')
    },
    {
      title: 'View Students',
      description: 'Manage your class roster',
      icon: 'Users',
      color: 'bg-primary',
      action: () => navigate('/students')
    },
    {
      title: 'Enter Grades',
      description: 'Add assignment scores',
      icon: 'BookOpen',
      color: 'bg-secondary',
      action: () => navigate('/grades')
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-8 bg-surface-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold text-surface-900">{quickStats.totalStudents}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <ApperIcon name="Users" size={24} className="text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 text-sm font-medium">Present Today</p>
              <p className="text-3xl font-bold text-success">{quickStats.todayAttendance}</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg">
              <ApperIcon name="UserCheck" size={24} className="text-success" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 text-sm font-medium">Attendance Rate</p>
              <p className="text-3xl font-bold text-info">{quickStats.attendanceRate}%</p>
            </div>
            <div className="bg-info/10 p-3 rounded-lg">
              <ApperIcon name="TrendingUp" size={24} className="text-info" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 cursor-pointer hover:shadow-md transition-all"
            onClick={action.action}
          >
            <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <ApperIcon name={action.icon} size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-surface-900 mb-2">
              {action.title}
            </h3>
            <p className="text-surface-600 text-sm">
              {action.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-semibold text-surface-900">
            Recent Activity
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            View All
          </motion.button>
        </div>

        {quickStats.recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Activity" size={48} className="text-surface-300 mx-auto mb-4" />
            <p className="text-surface-600">No recent activity</p>
            <p className="text-surface-500 text-sm mt-1">
              Start taking attendance to see activity here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {quickStats.recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${
                  activity.status === 'present' ? 'bg-success/10' :
                  activity.status === 'absent' ? 'bg-error/10' :
                  activity.status === 'late' ? 'bg-warning/10' :
                  'bg-surface/10'
                }`}>
                  <ApperIcon 
                    name={
                      activity.status === 'present' ? 'Check' :
                      activity.status === 'absent' ? 'X' :
                      activity.status === 'late' ? 'Clock' : 'Minus'
                    } 
                    size={16} 
                    className={
                      activity.status === 'present' ? 'text-success' :
                      activity.status === 'absent' ? 'text-error' :
                      activity.status === 'late' ? 'text-warning' :
                      'text-surface-600'
                    }
                  />
                </div>
                <div className="flex-1">
                  <p className="text-surface-900 font-medium">
                    {activity.studentName} marked {activity.status}
                  </p>
                  <p className="text-surface-500 text-sm">
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MainFeature;