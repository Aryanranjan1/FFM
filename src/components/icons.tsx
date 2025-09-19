import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="80"
      height="20"
      aria-label="FFM Logo"
      {...props}
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Belleza, sans-serif"
        fontSize="50"
        fill="currentColor"
        letterSpacing="0.1em"
      >
        FFM
      </text>
    </svg>
  );
}
