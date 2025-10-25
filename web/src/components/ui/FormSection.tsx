import React, { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-[#3A5A3A] rounded-lg p-4 sm:p-6 border border-[#6B8A6B] ${className}`}>
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default FormSection;
