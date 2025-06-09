import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import Attendance from '../pages/Attendance';
import Grades from '../pages/Grades';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  students: {
    id: 'students',
    label: 'Students',
    path: '/students',
    icon: 'Users',
    component: Students
  },
  attendance: {
    id: 'attendance',
    label: 'Attendance',
    path: '/attendance',
    icon: 'Calendar',
    component: Attendance
  },
  grades: {
    id: 'grades',
    label: 'Grades',
    path: '/grades',
    icon: 'BookOpen',
    component: Grades
  }
};

export const routeArray = Object.values(routes);