/**
 * The photo shelf: every photo taken in the booth is kept here.
 * Saved in IndexedDB, so photos live in this browser on this device only —
 * nothing is uploaded anywhere, and they survive closing the tab.
 */
export type AlbumPhoto = { id: number; dataUrl: string; createdAt: number }

const DB_NAME = 'cut-of-four'
const STORE = 'album-photos'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const request = action(db.transaction(STORE, mode).objectStore(STORE))
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      }),
  )
}

/** All shelf photos, newest first. */
export async function loadAlbum(): Promise<AlbumPhoto[]> {
  const all = await run<AlbumPhoto[]>('readonly', (s) => s.getAll() as IDBRequest<AlbumPhoto[]>)
  return all.sort((a, b) => b.createdAt - a.createdAt)
}

export async function saveToAlbum(dataUrl: string): Promise<AlbumPhoto> {
  const photo = { dataUrl, createdAt: Date.now() } as AlbumPhoto
  const id = await run<IDBValidKey>('readwrite', (s) => s.add(photo))
  return { ...photo, id: id as number }
}

export async function removeFromAlbum(id: number): Promise<void> {
  await run('readwrite', (s) => s.delete(id))
}
