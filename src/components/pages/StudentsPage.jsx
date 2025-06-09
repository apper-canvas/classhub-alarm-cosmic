import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import studentService from '@/services/api/studentService';
import StudentTable from '@/components/organisms/StudentTable';

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError('Failed to fetch student data.');
      toast.error('Failed to load students.');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary-600">Student List</h1>
      <StudentTable
        students={students}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default StudentsPage;