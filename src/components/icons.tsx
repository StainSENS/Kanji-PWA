export function GearIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M19.4 15a7.9 7.9 0 0 0 .1-1 7.9 7.9 0 0 0-.1-1l2-1.6-1.9-3.2-2.4 1a7.6 7.6 0 0 0-1.7-1l-.4-2.6H10l-.4 2.6a7.6 7.6 0 0 0-1.7 1l-2.4-1-1.9 3.2L5.6 13a7.9 7.9 0 0 0-.1 1c0 .3 0 .7.1 1l-2 1.6 1.9 3.2 2.4-1c.5.4 1.1.7 1.7 1l.4 2.6h4.8l.4-2.6c.6-.3 1.2-.6 1.7-1l2.4 1 1.9-3.2-2-1.6Z" />
    </svg>
  );
}

