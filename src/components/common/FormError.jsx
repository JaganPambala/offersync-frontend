import React from 'react';
import { AlertCircle } from 'lucide-react';

const FormError = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`text-sm text-red-600 mt-1 flex items-center ${className}`}>
      <AlertCircle className="h-4 w-4 mr-1" />
      <span>{error}</span>
    </div>
  );
};

export default FormError; 