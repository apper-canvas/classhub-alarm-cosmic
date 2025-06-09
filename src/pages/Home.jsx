import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';

const Home = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Take Attendance',
      description: 'Mark today\'s attendance for all students',
      icon: 'Calendar',
      color: 'bg-success',
      action: () => navigate('/attendance')
    },
    {
      title: 'View Students',
      description: 'Manage student records and information',
      icon: 'Users',
      color: 'bg-primary',
      action: () => navigate('/students')
    },
    {
      title: 'Enter Grades',
      description: 'Add or update assignment grades',
      icon: 'BookOpen',
      color: 'bg-secondary',
      action: () => navigate('/grades')
    },
    {
      title: 'Dashboard',
      description: 'View class overview and statistics',
      icon: 'LayoutDashboard',
      color: 'bg-accent',
      action: () => navigate('/dashboard')
    }
  ];

  const recentActivities = [
    {
      type: 'attendance',
      message: 'Attendance marked for Math Period 1',
      time: '2 hours ago',
      icon: 'Calendar'
    },
    {
      type: 'grade',
      message: 'Quiz grades entered for Chapter 5',
      time: '4 hours ago',
      icon: 'BookOpen'
    },
    {
      type: 'student',
      message: 'New student Sarah Johnson added',
      time: '1 day ago',
      icon: 'UserPlus'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-surface-200 p-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold text-primary mb-4">
            Welcome to ClassHub
          </h1>
          <p className="text-lg text-surface-600 max-w-2xl mx-auto">
            Streamline your classroom management with our comprehensive student tracking system. 
            Keep attendance, manage grades, and monitor progress all in one place.
          </p>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold text-surface-900">24</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <ApperIcon name="Users" size={24} className="text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 text-sm font-medium">Today's Attendance</p>
              <p className="text-3xl font-bold text-success">96%</p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg">
              <ApperIcon name="Calendar" size={24} className="text-success" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 text-sm font-medium">Class Average</p>
              <p className="text-3xl font-bold text-info">87%</p>
            </div>
            <div className="bg-info/10 p-3 rounded-lg">
              <ApperIcon name="BookOpen" size={24} className="text-info" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
      >
        <h2 className="text-xl font-heading font-semibold text-surface-900 mb-6">
          Recent Activities
        </h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-surface-50 transition-colors">
              <div className="bg-surface-100 p-2 rounded-lg">
                <ApperIcon name={activity.icon} size={16} className="text-surface-600" />
              </div>
              <div className="flex-1">
                <p className="text-surface-900 font-medium">{activity.message}</p>
                <p className="text-surface-500 text-sm">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;