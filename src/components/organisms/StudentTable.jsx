import React from 'react';
import Input from '@/components/atoms/Input';

const StudentTable = ({ students, searchQuery, setSearchQuery, loading, error }) => {
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toString().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center p-4">Loading students...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  return (
    <>
      <Input
        type="text"
        placeholder="Search students by name or ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />

      {filteredStudents.length === 0 ? (
        <p className="text-surface-600">No students found matching your search.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-surface-200 bg-surface-100 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-5 py-3 border-b-2 border-surface-200 bg-surface-100 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-surface-200 bg-surface-100 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-5 py-3 border-b-2 border-surface-200 bg-surface-100 text-left text-xs font-semibold text-surface-600 uppercase tracking-wider">
                  Major
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-5 py-5 border-b border-surface-200 bg-white text-sm">
                    <p className="text-surface-900 whitespace-no-wrap">{student.id}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-surface-200 bg-white text-sm">
                    <p className="text-surface-900 whitespace-no-wrap">{student.name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-surface-200 bg-white text-sm">
                    <p className="text-surface-900 whitespace-no-wrap">{student.age}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-surface-200 bg-white text-sm">
                    <p className="text-surface-900 whitespace-no-wrap">{student.major}</p>
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

export default StudentTable;