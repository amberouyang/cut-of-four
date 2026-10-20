export type StickerKind = 'doodle' | 'emoji' | 'badge' | 'date'

export interface StickerDef {
  id: string
  label: string
  kind: StickerKind
  /** doodle component name, emoji, or badge/date text */
  content: string
}

export interface StickerInstance {
  instanceId: string
  stickerId: string
  x: number // % across the whole frame (0-100)
  y: number // % down the whole frame (0-100)
  scale: number
  rotation: number
}

export const STICKERS: StickerDef[] = [
  // hand-drawn doodles (from our doodles.tsx)
  { id: 'd-bow', label: 'bow', kind: 'doodle', content: 'bow' },
  { id: 'd-heart', label: 'heart', kind: 'doodle', content: 'heart' },
  { id: 'd-sparkle', label: 'sparkle', kind: 'doodle', content: 'sparkle' },
  { id: 'd-star', label: 'star', kind: 'doodle', content: 'star' },
  // cute emojis
  { id: 'e-cat', label: 'cat', kind: 'emoji', content: '🐱' },
  { id: 'e-bunny', label: 'bunny', kind: 'emoji', content: '🐰' },
  { id: 'e-blush', label: 'blush', kind: 'emoji', content: '🌸' },
  { id: 'e-sparkles', label: 'sparkles', kind: 'emoji', content: '✨' },
  { id: 'e-bow', label: 'ribbon', kind: 'emoji', content: '🎀' },
  { id: 'e-heart', label: 'heart', kind: 'emoji', content: '💖' },
  { id: 'e-bear', label: 'bear', kind: 'emoji', content: '🧸' },
  { id: 'e-berry', label: 'strawberry', kind: 'emoji', content: '🍓' },
  // text-y bits
  { id: 't-cute', label: 'so cute', kind: 'badge', content: 'SO CUTE ♡' },
  { id: 't-date', label: "date '26", kind: 'date', content: "'26 10 19" },
  { id: 't-film', label: 'on film', kind: 'badge', content: 'on film • 35mm' },
  { id: 't-love', label: 'love', kind: 'badge', content: 'Love is Blooming' },
]

export const stickerById = (id: string) => STICKERS.find((s) => s.id === id) ?? STICKERS[0]
