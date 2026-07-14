// Brand mark: a jagged "noise" line resolving into a clean signal wave.
// Keep in sync with app/icon.svg (the favicon uses the same geometry).

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="sn-bg" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill="url(#sn-bg)" />
      <path
        d="M3.5 16 L5 12 L6.5 20 L8 9.5 L9.5 22 L11 12.5 L12.5 18 L14 15.2 L14.8 16"
        stroke="#c7d2fe"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      />
      <path
        d="M14.8 16 Q17.5 7.5 20.5 16 T26.5 16 L28.5 16"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="text-lg font-bold tracking-tight">
        Signal{" "}
        <span className="font-medium text-zinc-400 dark:text-zinc-500">
          &amp; Noise
        </span>
      </span>
    </span>
  );
}
