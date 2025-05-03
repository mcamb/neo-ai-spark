
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
      {/* Main background */}
      <rect width="40" height="40" rx="8" fill="#EA384C" />
      
      {/* Robot head */}
      <rect x="8" y="8" width="24" height="20" rx="8" fill="white" />
      
      {/* Eyes */}
      <circle cx="15" cy="17" r="3" fill="#EA384C" />
      <circle cx="25" cy="17" r="3" fill="#EA384C" />
      
      {/* Happy mouth */}
      <path d="M15 23C17 26 23 26 25 23" stroke="#EA384C" strokeWidth="2" strokeLinecap="round" />
      
      {/* Body */}
      <rect x="12" y="28" width="16" height="8" rx="4" fill="white" />
      
      {/* Connector between head and body */}
      <rect x="18" y="26" width="4" height="4" fill="white" />
      
      {/* Body details */}
      <circle cx="16" cy="32" r="1.5" fill="#EA384C" />
      <circle cx="20" cy="32" r="1.5" fill="#EA384C" />
      <circle cx="24" cy="32" r="1.5" fill="#EA384C" />
    </svg>
  );
};

export default LogoIcon;
