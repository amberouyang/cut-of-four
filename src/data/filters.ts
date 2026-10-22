export interface FilterPreset {
  id: string
  name: string
  css: string
  swatch: string
}

export const FILTERS: FilterPreset[] = [
  {
    id: 'douyin', name: 'peachy glow',
    css: 'brightness(1.12) contrast(0.95) saturate(1.1) drop-shadow(0 0 8px rgba(255,192,203,0.3))',
    swatch: 'linear-gradient(135deg,#ffe3ee,#ffb6d1 45%,#fff3c7)',
  },
  {
    id: 'bw', name: 'old film',
    css: 'grayscale(1) contrast(1.25) brightness(0.95)',
    swatch: 'linear-gradient(135deg,#f4f4f4,#8a8a8a 55%,#111)',
  },
  {
    id: 'disposable', name: 'sunny film',
    css: 'sepia(0.25) saturate(1.2) contrast(1.08) brightness(1.05)',
    swatch: 'linear-gradient(135deg,#ffe9b8,#f2a65a 55%,#8a4b2a)',
  },
  {
    id: 'cyber', name: 'night flash',
    css: 'contrast(1.2) brightness(1.1) hue-rotate(190deg) saturate(0.9)',
    swatch: 'linear-gradient(135deg,#a5f3ff,#3b82f6 50%,#111827)',
  },
  {
    id: 'matte', name: 'soft matte',
    css: 'contrast(1.05) saturate(0.85) brightness(1.02)',
    swatch: 'linear-gradient(135deg,#ffffff,#d6d3cd 55%,#9a958c)',
  },
  {
    id: 'none', name: 'no filter',
    css: 'none',
    swatch: 'linear-gradient(135deg,#a7f3d0,#60a5fa)',
  },
]
