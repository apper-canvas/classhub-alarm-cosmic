import React from 'react';
import Input from '@/components/atoms/Input';
import FormField from '@/components/molecules/FormField';

const AttendanceTable = ({ attendance, filterDate, setFilterDate, loading, error }) => {
  const filteredAttendance = attendance.filter(record => {
    if (!filterDate) return true;
    return record.date === filterDate;
  });

  if (loading) {
    return <div className="text-center p-4">Loading attendance records...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  return (
    <>
      <FormField
        id="filterDate"
        label="Filter by Date:"
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="mb-4"
      />

      {filteredAttendance.length === 0 ? (
        <p className="text-surface-600">No attendance records found {filterDate ? `for ${filterDate}` : ''}.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-surface-200 bg-surface-100 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-5 py-3 border-b-2 border-surface-200 bg-surface-100 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-5 py-3 border-b-2 border-surface-200 bg-surface-100 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((record) => (
                <tr key={`${record.studentId}-${record.date}`}>
                  <td className="px-5 py-5 border-b border-surface-200 bg-white text-sm">
                    <p className="text-surface-900 whitespace-no-wrap">{record.studentId}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-surface-200 bg-white text-sm">
                    <p className="text-surface-900 whitespace-no-wrap">{record.date}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-surface-200 bg-white text-sm">
                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${record.status === 'Present' ? 'text-green-900' : 'text-red-900'}`}>
                      <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${record.status === 'Present' ? 'bg-green-200' : 'bg-red-200'}`}></span>
                      <span className="relative">{record.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AttendanceTable;