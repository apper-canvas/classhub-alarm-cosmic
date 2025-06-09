import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const DashboardStats = ({ stats, loading, error }) => {
  if (loading) {
    return <div className="text-center p-4">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Total Students" value={stats.totalStudents} />
      <StatCard title="Total Assignments" value={stats.totalAssignments} />
      <StatCard title="Average Grade" value={stats.averageGrade} />
    </div>
  );
};

export default DashboardStats;