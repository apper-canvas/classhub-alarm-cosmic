import React from 'react';
import Input from '@/components/atoms/Input';

const FormField = ({ label, id, type = 'text', value, onChange, placeholder, required, className, ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-surface-700 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        {...props}
      />
    </div>
  );
};

export default FormField;