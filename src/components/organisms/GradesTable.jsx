import React from 'react';
import Input from '@/components/atoms/Input';

const GradesTable = ({ grades, students, getStudentName, searchQuery, setSearchQuery, loading, error }) => {
  const filteredGrades = grades.filter(grade => {
    const studentName = getStudentName(grade.student_id || grade.studentId).toLowerCase();
    const assignmentName = (grade.assignment || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    return studentName.includes(query) || assignmentName.includes(query);
  });

  if (loading) {
    return <div className="text-center p-4">Loading grades...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  return (
    <>
      <Input
        type="text"
        placeholder="Search by student or assignment..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />

      {filteredGrades.length === 0 ? (
        <p className="text-surface-600">No grades found matching your search.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-surface-200 bg-surface-100 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-5 py-3 border-b-2 border-surface-200 bg-surface-100 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-5 py-3 border-b-2 border-surface-200 bg-surface-100 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-5 py-3 border-b-2 border-surface-200 bg-surface-100 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                  Date Graded
                </th>
              </tr>
            </thead>
            <tbody>
{filteredGrades.map((grade) => (
                <tr key={grade.Id || grade.id}>
                  <td className="px-5 py-5 border-b border-surface-200 bg-white text-sm">
                    <p className="text-surface-900 whitespace-no-wrap">{getStudentName(grade.student_id || grade.studentId)}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-surface-200 bg-white text-sm">
                    <p className="text-surface-900 whitespace-no-wrap">{grade.assignment || 'N/A'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-surface-200 bg-white text-sm">
                    <p className="text-surface-900 whitespace-no-wrap">{grade.score || 'N/A'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-surface-200 bg-white text-sm">
                    <p className="text-surface-900 whitespace-no-wrap">{grade.date || 'N/A'}</p>
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

export default GradesTable;