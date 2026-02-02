import React from 'react';

export const PageContainer = ({ children, className = '', isCover = false }) => {
  return (
    <section 
      className={`w-full relative flex flex-col shrink-0 text-gray-900 ${
        isCover ? 'h-auto py-0' : 'h-auto py-3'
      } ${className}`}
    >
      <div className="w-full max-w-md mx-auto px-5 flex flex-col relative z-10">
        {children}
      </div>
    </section>
  );
};
