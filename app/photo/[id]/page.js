import { notFound } from 'next/navigation'
import { getPhoto } from '@/lib/data'
import PhotoDetail from '@/components/photo/PhotoDetail'
import MasonryGrid from '@/components/photo/MasonryGrid'

export async function generateMetadata({ params }) {
    const { id } = await params
    const photo = await getPhoto(id)
    if (!photo) return { title: 'Photo non trouvée' }

    return {
        title: `${photo.title || 'Photo'} par ${photo.creator.name} | JEaLiFe Pictures`,
        description: photo.description || `Télécharger cette photo de ${photo.creator.name} sur JEaLiFe Pictures.`,
        openGraph: {
            images: [photo.thumbnail],
        },
    }
}

export default async function PhotoPage({ params }) {
    const { id } = await params
    const photo = await getPhoto(id)

    if (!photo) {
        // Optionnel : afficher une page custom ou redirect
        return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Photo non trouvée</div>
    }

    return (
        <main>
            <PhotoDetail photo={photo} />

            {/* Related Photos Section (Placeholder for now, could be fetched via tags) */}
            <div className="bg-white border-t border-slate-100 py-12 md:py-16">
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6">
                    <h3 className="text-xl font-black text-slate-900 mb-8">Photos similaires</h3>
                    {/* Temporarily empty or fetch related */}
                    <p className="text-sm font-bold text-slate-400">Plus de photos bientôt disponibles.</p>
                </div>
            </div>
        </main>
    )
}
