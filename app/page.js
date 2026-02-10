import Hero from "@/components/home/Hero"
import MasonryGrid from "@/components/photo/MasonryGrid"
import { getPhotos } from "@/lib/data"
import Link from 'next/link'

export default async function Home() {
    const photos = await getPhotos()

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <Hero />

            <div className="w-full max-w-[1600px] px-4 py-8 md:px-6 md:py-12">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-black text-slate-900 md:text-2xl">Actualités Gabonaises</h2>
                        <p className="text-sm font-medium text-slate-500">Les dernières photos ajoutées par la communauté.</p>
                    </div>

                    <div className="hidden sm:flex gap-4 text-sm font-bold text-slate-500">
                        <Link href="/" className="cursor-pointer border-b-2 border-slate-900 pb-1 text-slate-900">Tout</Link>
                        <Link href="/search?q=Paysages" className="cursor-pointer hover:text-slate-900 transition-colors">Paysages</Link>
                        <Link href="/search?q=Animaux" className="cursor-pointer hover:text-slate-900 transition-colors">Animaux</Link>
                        <Link href="/search?q=Culture" className="cursor-pointer hover:text-slate-900 transition-colors">Culture</Link>
                    </div>
                </div>

                {photos && photos.length > 0 ? (
                    <MasonryGrid photos={photos} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold mb-2">Aucune photo pour le moment.</p>
                        <p className="text-slate-400 text-sm">Soyez le premier à publier !</p>
                    </div>
                )}
            </div>
        </main>
    )
}
