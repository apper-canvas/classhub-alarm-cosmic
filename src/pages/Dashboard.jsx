import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import { studentService, attendanceService, gradeService } from '../services';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    attendanceRate: 0,
    classAverage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [students, attendance, grades] = await Promise.all([
          studentService.getAll(),
          attendanceService.getAll(),
          gradeService.getAll()
        ]);

        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = attendance.filter(record => 
          record.date.startsWith(today)
        );
        const presentToday = todayAttendance.filter(record => 
          record.status === 'present'
        ).length;
        
        const attendanceRate = students.length > 0 
          ? Math.round((presentToday / students.length) * 100)
          : 0;

        const validGrades = grades.filter(grade => grade.score != null);
        const averageGrade = validGrades.length > 0
          ? validGrades.reduce((sum, grade) => sum + grade.score, 0) / validGrades.length
          : 0;

        setStats({
          totalStudents: students.length,
          presentToday,
          attendanceRate,
          classAverage: Math.round(averageGrade)
        });
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color, suffix = '' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-surface-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-surface-900">
            {loading ? (
              <div className="h-8 w-16 bg-surface-200 rounded animate-pulse"></div>
            ) : (
              `${value}${suffix}`
            )}
          </p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );

  const CircularProgress = ({ percentage, size = 120 }) => {
    const radius = (size - 10) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#48A14D"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-surface-900">{percentage}%</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-8 text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">
            Failed to Load Dashboard
          </h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-surface-900">
            Class Overview
          </h1>
          <p className="text-surface-600 mt-1">
            Monitor your class performance and attendance
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-surface-600">Today</p>
          <p className="font-semibold text-surface-900">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="Users"
          color="bg-primary"
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon="UserCheck"
          color="bg-success"
        />
        <StatCard
          title="Attendance Rate"
          value={stats.attendanceRate}
          icon="Calendar"
          color="bg-secondary"
          suffix="%"
        />
        <StatCard
          title="Class Average"
          value={stats.classAverage}
          icon="BookOpen"
          color="bg-accent"
          suffix="%"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
        >
          <h3 className="text-lg font-heading font-semibold text-surface-900 mb-6">
            Today's Attendance
          </h3>
          <div className="flex items-center justify-center">
            <CircularProgress percentage={stats.attendanceRate} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{stats.presentToday}</p>
              <p className="text-sm text-surface-600">Present</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-error">
                {stats.totalStudents - stats.presentToday}
              </p>
              <p className="text-sm text-surface-600">Absent</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
        >
          <h3 className="text-lg font-heading font-semibold text-surface-900 mb-6">
            Quick Actions
          </h3>
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 p-4 bg-success/10 rounded-lg hover:bg-success/20 transition-colors"
              onClick={() => window.location.href = '/attendance'}
            >
              <ApperIcon name="Calendar" size={20} className="text-success" />
              <span className="font-medium text-success">Take Attendance</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              onClick={() => window.location.href = '/grades'}
            >
              <ApperIcon name="BookOpen" size={20} className="text-primary" />
              <span className="font-medium text-primary">Enter Grades</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 p-4 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
              onClick={() => window.location.href = '/students'}
            >
              <ApperIcon name="Users" size={20} className="text-secondary" />
              <span className="font-medium text-secondary">Manage Students</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
      >
        <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
          Class Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-info/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="TrendingUp" size={24} className="text-info" />
            </div>
            <h4 className="font-semibold text-surface-900">Performance</h4>
            <p className="text-sm text-surface-600 mt-1">
              Class average of {stats.classAverage}% shows consistent progress
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Clock" size={24} className="text-success" />
            </div>
            <h4 className="font-semibold text-surface-900">Punctuality</h4>
            <p className="text-sm text-surface-600 mt-1">
              {stats.attendanceRate}% attendance rate this week
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Award" size={24} className="text-accent" />
            </div>
            <h4 className="font-semibold text-surface-900">Engagement</h4>
            <p className="text-sm text-surface-600 mt-1">
              {stats.totalStudents} active students in your class
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;