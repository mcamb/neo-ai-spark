
import React from 'react';

export const LogoIcon = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <rect width="40" height="40" rx="8" fill="#EA384C" />
      <circle cx="14" cy="15" r="3" fill="white" />
      <circle cx="26" cy="15" r="3" fill="white" />
      <path d="M12 25C16 30 24 30 28 25" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M8 9L11 12M32 9L29 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export default LogoIcon;
