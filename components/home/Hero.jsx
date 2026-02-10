'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const HERO_IMAGES = [
    {
        url: 'https://images.unsplash.com/photo-1770392170363-c6b57c9fa473?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        credit: 'Coucher de soleil sur Libreville',
        photographer: 'JEaLiFe Pictures'
    },
    {
        url: 'https://images.unsplash.com/photo-1770392171166-4fa80cc9d7fb?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        credit: 'Éléphant de forêt au Parc National de Loango',
        photographer: 'JEaLiFe Pictures'
    },
    {
        url: 'https://images.unsplash.com/photo-1714898579275-dcb4fbcbe142?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        credit: 'Marché coloré de Mont-Bouët',
        photographer: 'JEaLiFe Pictures'
    },
    {
        url: 'https://images.unsplash.com/photo-1708081744604-995bcb2edc76?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        credit: 'Forêt dense de la Lopé',
        photographer: 'JEaLiFe Pictures'
    },
    {
        url: 'https://images.unsplash.com/photo-1744413265148-0932ccf64384?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        credit: 'Forêt dense de la Lopé',
        photographer: 'JEaLiFe Pictures'
    }
]

export default function Hero() {
    const [searchQuery, setSearchQuery] = useState('')
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const router = useRouter()

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length)
        }, 6000) // Change every 6 seconds

        return () => clearInterval(timer)
    }, [])

    const handleSearch = (e) => {
        if (e) e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    const currentImage = HERO_IMAGES[currentImageIndex]

    return (
        <section className="relative flex min-h-[400px] w-full items-center bg-slate-900 px-4 py-12 sm:min-h-[500px] sm:px-6 md:px-10 lg:min-h-[550px] lg:py-16 overflow-hidden">
            {/* Background Slideshow */}
            <AnimatePresence>
                <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${currentImage.url}")` }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                </motion.div>
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="unsplash-container relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl text-left text-white"
                >
                    <h1 className="text-3xl font-black sm:text-4xl md:text-5xl lg:text-7xl">
                        JEaLiFe
                    </h1>
                    <p className="mt-3 text-base font-bold sm:mt-4 sm:pr-8 sm:text-lg md:text-xl md:leading-snug">
                        La source de visuels sur le Gabon.<br className="hidden sm:block" />
                        Alimentée par des créateurs et créatrices du monde entier.
                    </p>

                    <div className="mt-2 text-xs font-bold text-white/70">
                        Pris en charge par <span className="text-white hover:underline cursor-pointer">JEALIFE GABON</span>
                    </div>

                    {/* Prominent Search Bar */}
                    <div className="mt-6 sm:mt-8">
                        <form
                            onSubmit={handleSearch}
                            className="flex h-12 w-full items-center rounded-md bg-white px-2 shadow-2xl sm:h-14 md:h-16 transition-all focus-within:ring-4 focus-within:ring-white/20"
                        >
                            <Search className="mx-3 h-4 w-4 text-slate-400 flex-shrink-0 sm:mx-4 sm:h-5 sm:w-5" />
                            <input
                                type="text"
                                placeholder="Rechercher des photos et illustrations"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-full flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-500 sm:text-base"
                            />
                            {/* Desktop Search Button */}
                            <button
                                type="submit"
                                className="hidden h-9 items-center justify-center rounded bg-slate-100 px-4 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900 sm:flex sm:h-11 sm:px-6 sm:text-sm mr-1.5"
                            >
                                Rechercher
                            </button>
                        </form>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-white/80 sm:mt-4 sm:text-sm">
                        <span className="opacity-70">Tendances :</span>
                        {['Libreville', 'Culture', 'Portrait', 'Nature'].map(tag => (
                            <Link
                                key={tag}
                                href={`/search?q=${tag}`}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Photographer Label - Desktop only */}
                <div className="absolute bottom-[-100px] right-0 hidden lg:flex flex-col items-end text-white/70">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-1">
                        <MapPin className="h-3 w-3" />
                        <span>Photos du jour</span>
                    </div>
                    {/* <div className="text-xs font-bold text-white">
                        {currentImage.photographer} – {currentImage.credit}
                    </div> */}
                </div>
            </div>
        </section>
    )
}
