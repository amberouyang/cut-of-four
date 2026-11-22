export interface FilterPreset {
  id: string
  name: string
  note: string
  css: string
}

export const FILTERS: FilterPreset[] = [
  {
    id: 'douyin', name: 'peachy glow', note: 'soft pink',
    css: 'brightness(1.12) contrast(0.95) saturate(1.1) drop-shadow(0 0 8px rgba(255,192,203,0.3))',
  },
  {
    id: 'bw', name: 'old film', note: 'black and white',
    css: 'grayscale(1) contrast(1.25) brightness(0.95)',
  },
  {
    id: 'disposable', name: 'sunny film', note: 'warm disposable',
    css: 'sepia(0.25) saturate(1.2) contrast(1.08) brightness(1.05)',
  },
  {
    id: 'cyber', name: 'night flash', note: 'cool glow',
    css: 'contrast(1.2) brightness(1.1) hue-rotate(190deg) saturate(0.9)',
  },
  {
    id: 'matte', name: 'soft matte', note: 'muted tones',
    css: 'contrast(1.05) saturate(0.85) brightness(1.02)',
  },
  {
    id: 'none', name: 'no filter', note: 'as you are',
    css: 'none',
  },
]
