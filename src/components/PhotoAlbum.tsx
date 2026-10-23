import type { AlbumPhoto } from '../utils/album'
import { Bow, HeartDoodle } from './doodles'

function downloadPhoto(photo: AlbumPhoto) {
  const a = document.createElement('a')
  a.download = `cut-of-four-photo-${photo.id}.jpg`
  a.href = photo.dataUrl
  a.click()
}

/**
 * The photo shelf — every photo taken in the booth, all in one place.
 * Step 1 of the scrapbook: collect first, decorate into book pages later.
 */
export default function PhotoAlbum({ photos, onBack, onDelete, onOpenBook, onToggleFeatured }: {
  photos: AlbumPhoto[]
  onBack: () => void
  onDelete: (id: number) => void
  onOpenBook: () => void
  onToggleFeatured: (photo: AlbumPhoto) => void
}) {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex items-center gap-2">
        <Bow size={30} className="-rotate-12" />
        <h2 className="font-hand text-4xl font-bold">your photo shelf</h2>
        <HeartDoodle size={24} />
      </div>
      <p className="mt-1 max-w-md text-center text-sm opacity-60">
        every photo you take lands here, saved in your browser on this device only ♡
        <br />tap ☆ on a photo to show it in the cover's featured strips
      </p>
      <button onClick={onOpenBook}
        className="ink-sm mt-4 bg-pink-mid px-5 py-2 font-bold transition hover:-rotate-1">
        open your scrapbook ♡
      </button>

      {photos.length === 0 ? (
        <div className="ink ink-shadow mt-8 max-w-sm bg-white p-6 text-center">
          <p className="font-hand text-3xl font-bold">no photos yet!</p>
          <p className="mt-1 text-sm opacity-60">step into the booth and take your first ones</p>
          <button onClick={onBack}
            className="ink-sm mt-4 bg-pink-mid px-5 py-2 font-bold transition hover:-rotate-1">
            go take photos →
          </button>
        </div>
      ) : (
        <div className="mt-7 grid w-full max-w-[900px] grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, i) => (
            <figure key={photo.id} className="ink ink-shadow-soft bg-white p-2 pb-3"
              style={{ transform: `rotate(${[-2, 1.5, -1, 2][i % 4]}deg)` }}>
              <img src={photo.dataUrl} alt="A photobooth photo"
                className="ink-sm aspect-[4/3] w-full object-cover" />
              <figcaption className="mt-2 text-center text-xs font-bold opacity-60">
                {new Date(photo.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                {' · '}
                {new Date(photo.createdAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
              </figcaption>
              <div className="mt-1.5 flex flex-wrap justify-center gap-2">
                <button onClick={() => onToggleFeatured(photo)}
                  title={photo.featured ? 'Showing in the cover featured strips. tap to take it off' : 'Show this photo in the cover featured strips'}
                  className={`ink-sm px-3 py-1 text-xs font-bold transition hover:-rotate-1 ${photo.featured ? 'bg-pink-mid' : 'bg-white'}`}>
                  {photo.featured ? '★ featured' : '☆ feature'}
                </button>
                <button onClick={() => downloadPhoto(photo)}
                  className="ink-sm bg-blush px-3 py-1 text-xs font-bold transition hover:-rotate-1">
                  save ↓
                </button>
                <button onClick={() => onDelete(photo.id)}
                  className="ink-sm bg-[#ffd9d9] px-3 py-1 text-xs font-bold transition hover:rotate-1">
                  delete ×
                </button>
              </div>
            </figure>
          ))}
        </div>
      )}

      <button onClick={onBack}
        className="ink-sm mt-8 bg-white px-5 py-2 font-bold transition hover:rotate-1">
        ← back to the booth
      </button>
    </div>
  )
}
