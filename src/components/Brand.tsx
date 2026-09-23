export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1100 215" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
      <path d="M0 211 79 4h58l78 207h-57L108 68 55 211H0ZM212 4h201v50h-73v157h-55V54h-73V4ZM433 211V4h57l58 131L607 4h59v207h-52V88l-46 107h-41L482 87v124h-49Z" />
      <path fillRule="evenodd" d="M792 0c68 0 111 44 111 108 0 63-43 107-111 107S681 171 681 108C681 44 724 0 792 0Zm0 50c-35 0-56 22-56 58s21 58 56 58 57-22 57-58-22-58-57-58Z" />
      <path d="m1098 21-22 44c-22-12-43-18-61-18-19 0-30 7-30 18 0 11 11 16 35 22l23 6c40 10 57 29 57 59 0 41-32 63-84 63-36 0-70-10-94-26l24-43c22 15 49 23 70 23s32-6 32-16c0-11-11-16-35-22l-23-6c-39-10-58-29-58-59 0-42 34-66 84-66 32 0 61 8 82 21Z" />
    </svg>
  );
}

export function AtmosGlobe({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden="true">
      <g transform="rotate(-24 200 200)">
        <circle cx="200" cy="200" r="161" />
        <ellipse cx="200" cy="200" rx="108" ry="161" />
        <ellipse cx="200" cy="200" rx="44" ry="161" />
        <ellipse cx="200" cy="200" rx="161" ry="108" />
        <ellipse cx="200" cy="200" rx="161" ry="44" />
        <path d="M39 200h322M200 39v322" />
      </g>
      <circle cx="324" cy="97" r="7" fill="currentColor" stroke="none" />
      <circle cx="82" cy="304" r="5" fill="currentColor" stroke="none" />
      <path d="M11 200h19m340 0h19M200 11v19m0 340v19" />
    </svg>
  );
}
