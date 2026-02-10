'use client'

import { Search, Camera, User, Bell, X, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { motion, AnimatePresence } from 'framer-motion'

function cn(...inputs) {
    return twMerge(clsx(inputs))
}

const CATEGORIES = [
    'À la Une', 'Wallpapers', 'Nature', 'Architecture', 'Voyage', 'Culture', 'Portrait', 'Textures', 'Événements', 'Sport', 'Technologie'
]

export default function Header() {
    const { user, signOut } = useAuth()
    const [searchFocused, setSearchFocused] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const scrollContainerRef = useRef(null)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Fermer le menu mobile lors du changement de route
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [pathname])

    const handleSearch = (e) => {
        if (e) e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    return (
        <header className="fixed top-0 right-0 z-50 flex w-full flex-col bg-white border-b border-slate-100 transition-all duration-300 md:w-[calc(100%-60px)]">
            {/* Row 1: Branding & Actions */}
            <div className="flex h-14 w-full items-center justify-between px-4 md:h-16 md:px-5">
                {/* Left: Logo & Context Selector */}
                <div className="flex items-center gap-3 md:gap-4">
                    <Link href="/" className="shrink-0 md:hidden">
                        <img src="/JEaLiFe-Pictures-logo-black.png" alt="JEaLiFe" className="h-8 w-auto" />
                    </Link>


                    {/* Mobile dropdown placeholder */}
                    <button className="flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-slate-100 md:hidden">
                        Photos <ChevronDown className="h-3 w-3" />
                    </button>

                </div>

                {/* Desktop Search Bar - Centered */}
                <div className="hidden md:flex flex-1 items-center pr-8">
                    <form
                        onSubmit={handleSearch}
                        className={cn(
                            "group relative flex h-10 w-full items-center rounded-full bg-slate-100 transition-all focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-200",
                            searchFocused ? "shadow-sm" : ""
                        )}
                    >
                        <button type="submit" className="flex h-full items-center px-4 text-slate-400 group-focus-within:text-slate-900">
                            <Search className="h-4 w-4 stroke-[3px]" />
                        </button>
                        <input
                            type="text"
                            placeholder="Rechercher des photos et illustrations"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className="h-full w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-500"
                        />
                    </form>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 md:gap-4 text-sm font-bold text-slate-500">
                  

                    {!user ? (
                        <>
                            <Link href="/login" className="hidden sm:block hover:text-slate-900 transition-colors">S'identifier</Link>
                            <Link
                                href="/register"
                                className="hidden sm:flex h-8 items-center rounded border border-slate-300 px-3 text-xs font-bold hover:border-slate-900 hover:text-slate-900 transition-colors"
                            >
                                Soumettre
                            </Link>
                        </>
                    ) : (
                        <div className="hidden md:flex items-center gap-4">
                            <button className="text-slate-400 hover:text-slate-900 transition-colors">
                                <Bell className="h-5 w-5" />
                            </button>
                            <Link href="/profile">
                                <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-100 bg-slate-50">
                                    <img src={`https://ui-avatars.com/api/?name=${user.email}`} className="h-full w-full object-cover" alt="Profile" />
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Profile/Login Icon - Visible on mobile only */}
                    <Link
                        href={user ? "/profile" : "/login"}
                        className="md:hidden p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        {user ? (
                            <div className="h-7 w-7 overflow-hidden rounded-full border border-slate-100 bg-slate-50">
                                <img src={`https://ui-avatars.com/api/?name=${user.email}`} className="h-full w-full object-cover" alt="Profile" />
                            </div>
                        ) : (
                            <User className="h-6 w-6 text-slate-900" />
                        )}
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
                        aria-label="Menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6 text-slate-900" />
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-900">
                                <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round" />
                                <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" strokeLinecap="round" />
                                <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Row 2: Mobile Search Bar */}
            <div className="px-4 pb-3 md:hidden">
                <form
                    onSubmit={handleSearch}
                    className="flex h-11 w-full items-center rounded-full bg-slate-100 px-4 focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-200 transition-all"
                >
                    <Search className="h-4.5 w-4.5 text-slate-400 stroke-[3px] shrink-0" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-full w-full bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-slate-500"
                    />
                </form>
            </div>

            {/* Row 3: Category Rail - Hidden on auth pages */}
            {!pathname.startsWith('/login') && !pathname.startsWith('/register') && !pathname.startsWith('/reset-password') && (
                <div className="relative flex w-full items-center border-b border-slate-100">
                    <div
                        ref={scrollContainerRef}
                        className="scrollbar-hide flex w-full items-center gap-4 md:gap-5 overflow-x-auto px-4 py-2.5 text-xs font-bold text-slate-400 md:px-5"
                    >
                        <Link href="/" className={cn(
                            "whitespace-nowrap pb-1.5 transition-colors",
                            pathname === '/' ? "border-b-2 border-slate-900 text-slate-900" : "hover:text-slate-900"
                        )}>
                            À la une
                        </Link>
                        {CATEGORIES.slice(1).map((cat) => (
                            <Link
                                key={cat}
                                href={`/search?q=${cat}`}
                                className="whitespace-nowrap pb-1.5 hover:text-slate-900 transition-colors"
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                    <div className="pointer-events-none absolute right-0 h-full w-12 bg-linear-to-l from-white to-transparent" />
                </div>
            )}

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 z-40 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-full left-0 right-0 bg-white shadow-2xl z-50 md:hidden border-t border-slate-100"
                        >
                            <div className="p-4 space-y-1">
                                {user ? (
                                    <>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-100 bg-slate-50">
                                                <img src={`https://ui-avatars.com/api/?name=${user.email}`} className="h-full w-full object-cover" alt="Profile" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900">Mon Profil</span>
                                                <span className="text-xs font-bold text-slate-400">{user.email}</span>
                                            </div>
                                        </Link>
                                        <Link href="/upload" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors text-sm font-bold text-slate-900">
                                            <Camera className="h-5 w-5" />
                                            Soumettre une photo
                                        </Link>
                                        <Link href="/favorites" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors text-sm font-bold text-slate-900">
                                            Mes favoris
                                        </Link>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-sm font-bold text-red-600"
                                        >
                                            Déconnexion
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="block px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors text-sm font-bold text-slate-900">
                                            S'identifier
                                        </Link>
                                        <Link href="/register" className="block px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors text-sm font-bold text-slate-900">
                                            Créer un compte
                                        </Link>
                                    </>
                                )}
                                <div className="border-t border-slate-100 my-2"></div>
                               
                                <Link href="/about" className="block px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors text-sm font-bold text-slate-500">
                                    À propos
                                </Link>
                                <Link href="/contact" className="block px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors text-sm font-bold text-slate-500">
                                    Contact
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    )
}
