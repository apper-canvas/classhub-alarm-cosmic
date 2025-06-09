import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import attendanceService from '@/services/api/attendanceService';
import AttendanceTable from '@/components/organisms/AttendanceTable';

function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState('');

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceService.getAttendance();
      setAttendance(data);
    } catch (err) {
      setError('Failed to fetch attendance data.');
      toast.error('Failed to load attendance.');
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary-600">Attendance Records</h1>
      <AttendanceTable
        attendance={attendance}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default AttendancePage;