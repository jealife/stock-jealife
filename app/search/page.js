import MasonryGrid from '@/components/photo/MasonryGrid'
import { searchPhotos } from '@/lib/data'
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react'

export async function generateMetadata(props) {
    const searchParams = await props.searchParams;
    const q = searchParams?.q || '';
    return {
        title: q ? `${q} | Recherche` : 'Recherche | JEaLiFe Pictures',
        description: q ? `Découvrez des photos de ${q} sur JEaLiFe Pictures.` : 'Recherchez parmi des milliers de photos du Gabon.'
    }
}

export default async function SearchPage(props) {
    const searchParams = await props.searchParams;
    const query = searchParams?.q || ''
    const results = await searchPhotos(query)

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Search Stats & Filter Bar */}
            <div className="border-b border-slate-100 bg-white">
                <div className="w-full max-w-[1600px] mx-auto px-4 py-6 md:px-6 md:py-8">
                    <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 sm:text-3xl md:text-4xl capitalize">
                                {query ? query : "Toutes les photos"}
                            </h1>
                            <p className="mt-1.5 text-sm font-bold text-slate-400 sm:mt-2">
                                {results.length} photo{results.length > 1 ? 's' : ''} trouvée{results.length > 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <button className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-500 transition-colors hover:border-slate-900 hover:text-slate-900 sm:px-4 sm:text-sm">
                                <SlidersHorizontal className="h-4 w-4" />
                                <span className="hidden sm:inline">Filtres</span>
                            </button>
                            <button className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-500 transition-colors hover:border-slate-900 hover:text-slate-900 sm:px-4 sm:text-sm">
                                <span className="hidden sm:inline">Trier par:</span> Récent
                                <ChevronDown className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Results */}
            <div className="w-full max-w-[1600px] mx-auto px-4 py-8 md:px-6 md:py-12">
                {results.length > 0 ? (
                    <>
                        <MasonryGrid photos={results} />
                        <div className="flex justify-center pt-12 sm:pt-16">
                            <button className="rounded-md border border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-500 transition-colors hover:border-slate-900 hover:text-slate-900">
                                Charger plus de photos
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex h-80 flex-col items-center justify-center text-center">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 sm:h-20 sm:w-20">
                            <Search className="h-8 w-8 text-slate-300 sm:h-10 sm:w-10" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Aucun résultat trouvé</h2>
                        <p className="mt-2 text-sm font-bold text-slate-500 sm:text-base">Essayez avec d'autres mots-clés comme "Libreville", "Culture" ou "Nature".</p>
                    </div>
                )}
            </div>
        </div>
    )
}
