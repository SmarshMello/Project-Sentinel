import React from 'react';

const icons = {
  shield: <><path d="M12 2.7 19 5.5v5.8c0 4.5-2.9 8.6-7 10-4.1-1.4-7-5.5-7-10V5.5L12 2.7Z"/><path d="m8.8 12 2 2 4.5-4.7"/></>,
  book: <><path d="M4 4.5h5.2A2.8 2.8 0 0 1 12 7.3V21a3.5 3.5 0 0 0-3.5-3.5H4Z"/><path d="M20 4.5h-5.2A2.8 2.8 0 0 0 12 7.3V21a3.5 3.5 0 0 1 3.5-3.5H20Z"/></>,
  wrench: <><path d="M14.7 6.3a5 5 0 0 0-6.5 6.5L3 18l3 3 5.2-5.2a5 5 0 0 0 6.5-6.5l-3.2 3.2-3-3Z"/></>,
  gauge: <><path d="M4.2 18a8.5 8.5 0 1 1 15.6 0"/><path d="m12 14 4-4"/><path d="M7 18h10"/></>,
  flask: <><path d="M9 3h6"/><path d="M10 3v6l-5 8.3A2.4 2.4 0 0 0 7 21h10a2.4 2.4 0 0 0 2-3.7L14 9V3"/><path d="M7.5 16h9"/></>,
  package: <><path d="m12 2.8 8 4.4v9.6l-8 4.4-8-4.4V7.2Z"/><path d="m4.4 7.4 7.6 4.2 7.6-4.2M12 11.6v9.2"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  filter: <><path d="M4 6h16M7 12h10M10 18h4"/></>,
  cube: <><path d="m12 2.8 8 4.4v9.6l-8 4.4-8-4.4V7.2Z"/><path d="m4.4 7.4 7.6 4.2 7.6-4.2M12 11.6v9.2"/></>,
  external: <><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></>,
  pulse: <path d="M3 12h4l2-6 4 12 2-6h6"/>,
};

export default function SentinelIcon({name, className, size = 24, strokeWidth = 1.8}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round">
      {icons[name] ?? icons.shield}
    </svg>
  );
}
