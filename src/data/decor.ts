import { STICKERS } from './stickers'

/**
 * Scrapbook page decorations — scrapbook-y extras (tape, bandages, bubbles)
 * plus every booth sticker, all placeable on book pages.
 */
export type DecorDef = {
  id: string
  label: string
  kind: 'tape' | 'bandaid' | 'bubble' | 'bow' | 'sticker'
  variant?: string
  stickerId?: string
}

export const DECOR: DecorDef[] = [
  { id: 'tape-pink', label: 'pink tape', kind: 'tape', variant: 'pink' },
  { id: 'tape-dot', label: 'dot tape', kind: 'tape', variant: 'dot' },
  { id: 'tape-picnic', label: 'picnic tape', kind: 'tape', variant: 'picnic' },
  { id: 'bandaid-star', label: 'star bandage', kind: 'bandaid', variant: 'star' },
  { id: 'bandaid-dot', label: 'dot bandage', kind: 'bandaid', variant: 'dot' },
  { id: 'bubble', label: 'speech bubble', kind: 'bubble' },
  { id: 'big-bow', label: 'big bow', kind: 'bow' },
  ...STICKERS.map((s) => ({
    id: `sticker-${s.id}`, label: s.label, kind: 'sticker' as const, stickerId: s.id,
  })),
]

export const decorById = (id: string): DecorDef => DECOR.find((d) => d.id === id) ?? DECOR[0]
