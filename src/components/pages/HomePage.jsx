import React, { useRef } from 'react';
import ContactForm from '@/components/organisms/ContactForm';

function HomePage() {
  const featureRef = useRef(null);

  // The onSubmit logic and navigation are now encapsulated within ContactForm.
  // This page simply renders the organism and provides overall structure.

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary-600">Welcome to Our School Management System!</h1>
      <p className="mb-8 text-lg text-surface-700">
        This system helps you manage students, attendance, grades, and assignments efficiently.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary-500">Quick Actions</h2>
        <div className="bg-surface-100 p-6 rounded-lg shadow-md">
          <ContactForm ref={featureRef} />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary-500">Key Features</h2>
        <ul className="list-disc list-inside text-lg text-surface-700">
          <li className="mb-2">Student Management: Add, view, and update student profiles.</li>
          <li className="mb-2">Attendance Tracking: Record and monitor student attendance.</li>
          <li className="mb-2">Grade Management: Input and retrieve student grades for various subjects.</li>
          <li className="mb-2">Assignment Tracking: Keep track of assignments and their statuses.</li>
          <li className="mb-2">Dashboard Overview: Get a quick summary of key metrics.</li>
        </ul>
      </section>
    </div>
  );
}

export default HomePage;