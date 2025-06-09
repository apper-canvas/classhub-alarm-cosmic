import React, { useState, forwardRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import studentService from '@/services/api/studentService';
import attendanceService from '@/services/api/attendanceService';

const ContactForm = forwardRef((props, ref) => {
  const [type, setType] = useState('student');
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (value.trim()) {
      if (type === 'student') {
        try {
          await studentService.addStudent(value);
          toast.success(`Student ${value} added successfully!`);
          navigate('/students');
        } catch (error) {
          toast.error('Failed to add student.');
          console.error('Error adding student:', error);
        }
      } else if (type === 'attendance') {
        try {
          await attendanceService.recordAttendance(value);
          toast.success(`Attendance recorded for student ID ${value}!`);
          navigate('/attendance');
        } catch (error) {
          toast.error('Failed to record attendance.');
          console.error('Error recording attendance:', error);
        }
      }
      setValue(''); // Clear input after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" ref={ref} {...props}>
      <div>
        <label htmlFor="feature-type" className="block text-surface-700 text-sm font-bold mb-2">
          Choose Feature:
        </label>
        <select
          id="feature-type"
          className="shadow border rounded w-full py-2 px-3 text-surface-700 leading-tight focus:outline-none focus:shadow-outline"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="student">Add New Student</option>
          <option value="attendance">Record Student Attendance (by ID)</option>
        </select>
      </div>

      <FormField
        id="feature-value"
        label={type === 'student' ? 'Student Name:' : 'Student ID:'}
        type={type === 'student' ? 'text' : 'number'}
        placeholder={type === 'student' ? 'e.g., Alice Smith' : 'e.g., 101'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />

      <Button type="submit">
        {type === 'student' ? 'Add Student' : 'Record Attendance'}
      </Button>
    </form>
  );
});

export default ContactForm;