/**
 * Hand-drawn photobooth storefront (from the moodboard sketch).
 * Static illustration for now — the curtain door becomes clickable in the next step.
 * Ink strokes + pastel fills only; mini "featured strips" live in the left window.
 */
const INK = '#232323'
const txt = (size: number, weight = 700) => ({
  fontFamily: "'Gaegu', cursive", fontSize: size, fontWeight: weight, fill: INK,
} as const)

export default function BoothCover() {
  return (
    <svg viewBox="0 0 640 570" className="w-full max-w-[560px]" role="img" aria-label="Hand-drawn photobooth">
      {/* sign */}
      <rect x="238" y="34" width="10" height="26" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <rect x="392" y="34" width="10" height="26" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <rect x="130" y="6" width="380" height="52" fill="#fff" stroke={INK} strokeWidth="3" />
      <text x="320" y="44" textAnchor="middle" style={txt(34)}>P H O T O B O O T H</text>

      {/* roof + body */}
      <rect x="58" y="86" width="524" height="30" fill="#ffd6e7" stroke={INK} strokeWidth="3" />
      <rect x="70" y="116" width="500" height="410" fill="#fff" stroke={INK} strokeWidth="3" />
      <line x1="70" y1="150" x2="570" y2="150" stroke={INK} strokeWidth="2.5" />

      {/* featured strips window */}
      <rect x="98" y="176" width="212" height="150" fill="#ffeef5" stroke={INK} strokeWidth="2.5" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${116 + i * 48}, 188)`}>
          <rect width="38" height="126" fill="#fff" stroke={INK} strokeWidth="1.8" />
          {[0, 1, 2, 3].map((j) => (
            <rect key={j} x="5" y={6 + j * 30} width="28" height="24"
              fill={['#f9a8c9', '#d9d9d9', '#232323', '#ffd6e7'][(i + j) % 4]} opacity={j === 2 ? 0.75 : 0.85} />
          ))}
        </g>
      ))}
      <text x="150" y="356" style={txt(19)}>featured strips</text>
      <path d="M238 344c14-2 22-10 24-22" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d="M256 326l7-6-1 9" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />

      {/* coin slot */}
      <rect x="112" y="392" width="52" height="76" fill="#fff" stroke={INK} strokeWidth="2.2" />
      <circle cx="126" cy="408" r="4" fill="none" stroke={INK} strokeWidth="1.8" />
      <circle cx="144" cy="408" r="4" fill="none" stroke={INK} strokeWidth="1.8" />
      <rect x="124" y="428" width="28" height="9" fill={INK} />
      <rect x="131" y="444" width="14" height="16" fill="none" stroke={INK} strokeWidth="1.8" />

      {/* curtain door */}
      <rect x="348" y="176" width="140" height="350" fill="#ffeef5" stroke={INK} strokeWidth="2.5" />
      {[366, 388, 410, 432, 454, 474].map((x, i) => (
        <path key={x} d={`M${x} 178c${i % 2 ? 7 : -7} 60 ${i % 2 ? -7 : 7} 120 0 174c${i % 2 ? 7 : -7} 60 ${i % 2 ? -7 : 7} 118 0 172`}
          fill="none" stroke="#f9a8c9" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      ))}
      {/* stool */}
      <ellipse cx="418" cy="448" rx="34" ry="10" fill="#fff" stroke={INK} strokeWidth="2.4" />
      <path d="M410 456h16l4 42h-24z" fill="#fff" stroke={INK} strokeWidth="2.2" />
      <ellipse cx="418" cy="502" rx="26" ry="6" fill="none" stroke={INK} strokeWidth="2.2" />
      {/* enter sign (clickable next step) */}
      <g>
        <rect x="356" y="318" width="124" height="46" fill="#fff" stroke={INK} strokeWidth="2.6" />
        <text x="418" y="349" textAnchor="middle" style={txt(24)}>enter →</text>
      </g>

      {/* little mirror window */}
      <rect x="506" y="196" width="44" height="130" fill="#fff" stroke={INK} strokeWidth="2.2" />
      <path d="M514 286l26-34M514 306l18-22" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />

      {/* ground */}
      <path d="M38 528c120-6 240 4 360-2 70-3 140 2 204-2" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <text x="320" y="556" textAnchor="middle" style={{ ...txt(18), fill: '#c2437f' }}>♡ click the curtain to go in — coming next step ♡</text>
    </svg>
  )
}
