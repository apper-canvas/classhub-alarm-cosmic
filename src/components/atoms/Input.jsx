import React from 'react';

const Input = ({ className, ...props }) => {
  return (
    <input
      className={`shadow appearance-none border rounded w-full py-2 px-3 text-surface-700 leading-tight focus:outline-none focus:shadow-outline ${className}`}
      {...props}
    />
  );
};

export default Input;