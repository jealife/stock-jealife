'use client'

import PhotoCard from './PhotoCard'

export default function MasonryGrid({ photos }) {
    if (!photos || photos.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center text-slate-400">
                <p>Aucune photo trouvée.</p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
            <div className="masonry-grid">
                {photos.map((photo) => (
                    <PhotoCard key={photo.id} photo={photo} />
                ))}
            </div>
        </div>
    )
}
