import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import studentService from '@/services/api/studentService';
import assignmentService from '@/services/api/assignmentService';
import gradeService from '@/services/api/gradeService';
import DashboardStats from '@/components/organisms/DashboardStats';

function DashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssignments: 0,
    averageGrade: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const students = await studentService.getStudents();
      const assignments = await assignmentService.getAssignments();
      const grades = await gradeService.getGrades();

      const totalStudents = students.length;
      const totalAssignments = assignments.length;
      const totalGrades = grades.length;
      const sumGrades = grades.reduce((sum, grade) => sum + grade.score, 0);
      const averageGrade = totalGrades > 0 ? (sumGrades / totalGrades).toFixed(2) : 0;

      setStats({
        totalStudents,
        totalAssignments,
        averageGrade,
      });
    } catch (err) {
      setError('Failed to fetch dashboard data.');
      toast.error('Failed to load dashboard data.');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary-600">Dashboard Overview</h1>
      <DashboardStats stats={stats} loading={loading} error={error} />

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary-500">Quick Insights</h2>
        <p className="text-lg text-surface-700">
          Monitor key metrics at a glance to ensure smooth operations.
        </p>
      </section>
    </div>
  );
}

export default DashboardPage;