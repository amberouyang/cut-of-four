/** Hand-drawn SVG doodles (stroke = ink). Drawn in code to match the moodboard — no emoji, no icon font. */
const S = ({ children, size = 36, className = '' }: { children: React.ReactNode; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="#232323" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>{children}</svg>
)

export const Bow = ({ size, className }: { size?: number; className?: string }) => (
  <S size={size} className={className}>
    <path d="M24 20c-6-8-16-9-17-2-.9 6 7 9 17 2zm0 0c6-8 16-9 17-2 .9 6-7 9-17 2z" fill="#ffd6e7" />
    <circle cx="24" cy="20" r="3.4" fill="#f9a8c9" />
    <path d="M22 23c-1 5-4 8-7 10M26 23c1 5 4 8 7 10" />
  </S>
)
export const HeartDoodle = ({ size, className, fill = '#f9a8c9' }: { size?: number; className?: string; fill?: string }) => (
  <S size={size} className={className}>
    <path d="M24 40S7 29 7 17.5C7 11 12 7.5 17.5 7.5c3 0 5.4 1.7 6.5 4 1.1-2.3 3.5-4 6.5-4C36 7.5 41 11 41 17.5 41 29 24 40 24 40z" fill={fill} />
  </S>
)
export const Sparkle = ({ size, className, fill = '#fff' }: { size?: number; className?: string; fill?: string }) => (
  <S size={size} className={className}>
    <path d="M24 5c1.8 9 3.4 15 17 19-13.6 4-15.2 10-17 19C22.2 34 20.6 28 7 24 20.6 20 22.2 14 24 5z" fill={fill} />
    <circle cx="24" cy="24" r="2" fill="#f9a8c9" stroke="none" />
  </S>
)
export const StarDoodle = ({ size, className }: { size?: number; className?: string }) => (
  <S size={size} className={className}>
    <path d="M24 6l4.5 12 12.5.5-9.8 7.8 3.3 12.2L24 31l-10.5 7.5 3.3-12.2L7 18.5 19.5 18z" fill="#fff" />
  </S>
)
export const Squiggle = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 220 24" className={className} fill="none" stroke="#232323" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
    <path d="M4 14c18-10 26 6 44-2s26 6 44-2 26 6 44-2 26 6 44-2 20 4 32 0" />
  </svg>
)
