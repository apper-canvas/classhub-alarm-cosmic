import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import gradeService from '@/services/api/gradeService';
import studentService from '@/services/api/studentService';
import GradesTable from '@/components/organisms/GradesTable';

function GradesPage() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
const [gradesData, studentsData] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll(),
      ]);
      setGrades(gradesData);
      setStudents(studentsData);
    } catch (err) {
      setError('Failed to fetch grades or student data.');
      toast.error('Failed to load grades.');
      console.error('Error fetching data for grades:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId || s.student_id === studentId);
    return student ? (student.Name || `${student.first_name || ''} ${student.last_name || ''}`).trim() : 'Unknown Student';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary-600">Student Grades</h1>
      <GradesTable
        grades={grades}
        students={students}
        getStudentName={getStudentName}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default GradesPage;