
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
      
      {/* Robot head - rounded and cute */}
      <rect x="8" y="8" width="24" height="20" rx="10" fill="white" />
      
      {/* Eyes - simple and expressive */}
      <circle cx="15" cy="17" r="3" fill="#EA384C" />
      <circle cx="25" cy="17" r="3" fill="#EA384C" />
      
      {/* Cute smile */}
      <path d="M15 23C17 26 23 26 25 23" stroke="#EA384C" strokeWidth="2" strokeLinecap="round" />
      
      {/* Simple body */}
      <rect x="14" y="28" width="12" height="8" rx="6" fill="white" />
      
      {/* Neck connector */}
      <rect x="18" y="26" width="4" height="3" fill="white" />
    </svg>
  );
};

export default LogoIcon;
