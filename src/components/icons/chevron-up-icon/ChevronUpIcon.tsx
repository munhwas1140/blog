import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export default function ChevronUpIcon({
  className = '',
  size = 24,
  strokeWidth = 2,
  color = 'currentColor',
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke={color}
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M5 15l7-7 7 7"
      />
    </svg>
  );
}
