import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import StudentsPage from '@/components/pages/StudentsPage';
import AttendancePage from '@/components/pages/AttendancePage';
import GradesPage from '@/components/pages/GradesPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    component: DashboardPage,
    icon: 'LayoutDashboard'
  },
  students: {
    id: 'students',
    label: 'Students',
    path: '/students',
    component: StudentsPage,
    icon: 'Users'
  },
  attendance: {
    id: 'attendance',
    label: 'Attendance',
    path: '/attendance',
    component: AttendancePage,
    icon: 'Calendar'
  },
  grades: {
    id: 'grades',
    label: 'Grades',
    path: '/grades',
    component: GradesPage,
    icon: 'BookOpen'
  }
};

export const routeArray = Object.values(routes);