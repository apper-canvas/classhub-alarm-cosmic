import React from 'react';

const Button = ({ children, className, ...props }) => {
  return (
    <button className={`bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;