
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
      {/* Robot face */}
      <rect x="10" y="10" width="20" height="16" rx="4" fill="white" />
      {/* Eyes */}
      <circle cx="16" cy="16" r="3" fill="#EA384C" />
      <circle cx="24" cy="16" r="3" fill="#EA384C" />
      {/* Smile */}
      <path d="M14 22C18 26 22 26 26 22" stroke="#EA384C" strokeWidth="2" strokeLinecap="round" />
      {/* Antennas */}
      <line x1="16" y1="10" x2="16" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="10" x2="24" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
      {/* Body */}
      <rect x="14" y="26" width="12" height="8" rx="2" fill="white" />
      {/* Buttons */}
      <circle cx="17" cy="30" r="1" fill="#EA384C" />
      <circle cx="20" cy="30" r="1" fill="#EA384C" />
      <circle cx="23" cy="30" r="1" fill="#EA384C" />
    </svg>
  );
};

export default LogoIcon;
