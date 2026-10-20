export type FrameId = 'strip' | 'student-id' | 'music' | 'instagram'

export interface FrameTemplate {
  id: FrameId
  name: string
  note: string
  photoCount: number
}

export const FRAMES: FrameTemplate[] = [
  { id: 'strip', name: 'classic 4-strip', note: '4 photos', photoCount: 4 },
  { id: 'student-id', name: 'student ID', note: '1 photo', photoCount: 1 },
  { id: 'music', name: 'music player', note: '1 photo', photoCount: 1 },
  { id: 'instagram', name: 'instagram post', note: '1 photo', photoCount: 1 },
]
