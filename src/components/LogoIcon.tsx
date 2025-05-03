
import React from 'react';
import { MessageCircle } from 'lucide-react';

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
      {/* Background */}
      <rect width="40" height="40" rx="8" fill="#EA384C" />
      
      {/* Speech bubble */}
      <path 
        d="M32 16C32 9.373 26.627 4 20 4C13.373 4 8 9.373 8 16C8 19.98 10.158 23.445 13.5 25.377V30.623C13.5 31.1753 14.1247 31.4778 14.5556 31.1556L20 27.5H20C26.627 27.5 32 22.127 32 15.5V16Z" 
        fill="white" 
      />
      
      {/* Robot head */}
      <rect x="14" y="11" width="12" height="10" rx="5" fill="#EA384C" />
      
      {/* Robot antenna */}
      <circle cx="20" cy="8" r="1" fill="#EA384C" />
      <rect x="19.5" y="8" width="1" height="3" fill="#EA384C" />
      
      {/* Eyes */}
      <circle cx="16.5" cy="15" r="1" fill="white" />
      <circle cx="23.5" cy="15" r="1" fill="white" />
      
      {/* Smile */}
      <path d="M18 17.5H22C22 18.5 21.5 19 20 19C18.5 19 18 18.5 18 17.5Z" fill="white" />
      
      {/* Robot body */}
      <rect x="17" y="21" width="6" height="5" rx="1" fill="#EA384C" />
      
      {/* Robot neck */}
      <rect x="19" y="20" width="2" height="1" fill="#EA384C" />
      
      {/* Robot ears */}
      <rect x="12" y="14" width="2" height="4" rx="1" fill="#EA384C" />
      <rect x="26" y="14" width="2" height="4" rx="1" fill="#EA384C" />
    </svg>
  );
};

export default LogoIcon;
