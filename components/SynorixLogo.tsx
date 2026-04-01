export function SynorixLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="snrx-ring" x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="#00f0ff" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" stroke="url(#snrx-ring)" strokeWidth="2.5" />
      <path
        d="M12 20h16M20 12v16"
        stroke="#00f0ff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="20" r="4" fill="#00f0ff" fillOpacity="0.9" />
    </svg>
  );
}
