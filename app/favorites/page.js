'use client'

import { useState } from 'react'
import { Heart, Search, ChevronLeft } from 'lucide-react'
import MasonryGrid from '@/components/photo/MasonryGrid'
import Link from 'next/link'

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]) // Typically fetched from Supabase

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
                <header className="mb-12">
                    <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
                        <ChevronLeft className="h-4 w-4" />
                        Retour
                    </Link>
                    <h1 className="text-4xl font-bold text-slate-900">Mes Favoris</h1>
                    <p className="mt-2 text-slate-500">Retrouvez les photos que vous avez aimées au Gabon.</p>
                </header>

                {favorites.length > 0 ? (
                    <MasonryGrid photos={favorites} />
                ) : (
                    <div className="py-24 text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-pink-50 text-pink-500">
                            <Heart className="h-10 w-10 fill-current" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Pas encore de favoris ?</h2>
                        <p className="mt-2 text-slate-500 max-w-sm mx-auto">
                            Parcourez la galerie et cliquez sur le cœur pour enregistrer vos photos préférées ici.
                        </p>
                        <Link
                            href="/"
                            className="mt-8 inline-block rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white transition-all hover:bg-slate-800 active:scale-95"
                        >
                            Découvrir des photos
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
