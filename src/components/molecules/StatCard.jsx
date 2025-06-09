import React from 'react';

const StatCard = ({ title, value, className }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <h2 className="text-xl font-semibold text-primary-500 mb-2">{title}</h2>
      <p className="text-4xl font-bold text-surface-900">{value}</p>
    </div>
  );
};

export default StatCard;