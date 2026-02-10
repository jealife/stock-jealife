'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Download, Heart, Plus } from 'lucide-react'
import { useState } from 'react'

export default function PhotoCard({ photo }) {
    const { id, title, creator, thumbnail, isPremium } = photo
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="masonry-item group relative overflow-hidden bg-slate-100 rounded-sm"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/photo/${id}`}>
                <div className="relative w-full">
                    <Image
                        src={thumbnail}
                        alt={title}
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover transition-opacity duration-300 group-hover:opacity-90"
                        priority={id === '1' || id === '2'}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                </div>
            </Link>

            {/* Overlay gradient - visible on hover */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Top Actions Bar */}
            <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-3 sm:p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex items-center gap-2">
                    {isPremium && (
                        <span className="rounded bg-yellow-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                            Plus
                        </span>
                    )}
                </div>
                <div className="flex gap-1.5 sm:gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        className="pointer-events-auto flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded bg-white text-slate-400 shadow-sm transition-colors hover:text-slate-900"
                    >
                        <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        className="pointer-events-auto flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded bg-white text-slate-400 shadow-sm transition-colors hover:text-slate-900"
                    >
                        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                </div>
            </div>

            {/* Bottom Creator Bar */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3 sm:p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex items-center gap-2 pointer-events-auto flex-1 min-w-0">
                    <Link
                        href={`/users/${creator.name.replace(/\s+/g, '-').toLowerCase()}`}
                        className="flex items-center gap-2 min-w-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full border border-white/50 bg-slate-100 shrink-0">
                            <img
                                src={creator.avatar || `https://ui-avatars.com/api/?name=${creator.name}&background=random`}
                                alt={creator.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <span className="text-xs font-bold text-white hover:text-white/80 transition-colors truncate">
                            {creator.name}
                        </span>
                    </Link>
                </div>

                <button
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    className="pointer-events-auto flex h-7 sm:h-8 items-center gap-1.5 sm:gap-2 rounded bg-white px-2 sm:px-3 text-xs font-bold text-slate-500 shadow-sm transition-colors hover:text-slate-900 shrink-0"
                >
                    <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Télécharger</span>
                </button>
            </div>
        </div>
    )
}
