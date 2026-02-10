'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, PlusCircle, User, Grid, LogOut, Heart } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useAuth } from '@/contexts/AuthContext'

function cn(...inputs) {
    return twMerge(clsx(inputs))
}

const navItems = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/search', label: 'Rechercher', icon: Search },
    { href: '/favorites', label: 'Favoris', icon: Heart },
    { href: '/upload', label: 'Publier', icon: PlusCircle },
]

export default function Navbar() {
    const pathname = usePathname()
    const { user, signOut } = useAuth()

    return (
        <>
            {/* Desktop Rail Navigation */}
            <nav className="fixed left-0 top-0 hidden h-screen w-20 flex-col items-center border-r border-slate-100 bg-white py-8 md:flex lg:w-64 lg:items-start lg:px-6">
                <Link href="/" className="mb-12 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xl">
                        J
                    </div>
                    <span className="hidden text-xl font-bold tracking-tight lg:block">JEaLiFe</span>
                </Link>

                <div className="flex w-full flex-1 flex-col gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 rounded-xl p-3 transition-colors",
                                    isActive
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <Icon className="h-6 w-6" />
                                <span className="hidden font-medium lg:block">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>

                <div className="mt-auto w-full flex flex-col gap-2">
                    {user ? (
                        <>
                            <Link
                                href="/profile"
                                className={cn(
                                    "flex items-center gap-4 rounded-xl p-3 transition-colors",
                                    pathname === '/profile' ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <User className="h-6 w-6" />
                                <span className="hidden font-medium lg:block">Mon Profil</span>
                            </Link>
                            <button
                                onClick={signOut}
                                className="flex items-center gap-4 rounded-xl p-3 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                                <LogOut className="h-6 w-6" />
                                <span className="hidden font-medium lg:block">Déconnexion</span>
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-4 rounded-xl bg-slate-100 p-3 text-slate-900 hover:bg-slate-200 transition-colors"
                        >
                            <User className="h-6 w-6" />
                            <span className="hidden font-medium lg:block">Connexion</span>
                        </Link>
                    )}
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-slate-100 bg-white/80 px-4 pb-safe backdrop-blur-lg md:hidden">
                {navItems.slice(0, 3).map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1",
                                isActive ? "text-slate-900" : "text-slate-400"
                            )}
                        >
                            <Icon className="h-6 w-6" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
                <Link
                    href={user ? "/upload" : "/login"}
                    className="flex -translate-y-4 flex-col items-center justify-center gap-1"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 shadow-lg shadow-slate-200">
                        <PlusCircle className="h-6 w-6 text-white" />
                    </div>
                </Link>
                <Link
                    href={user ? "/profile" : "/login"}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1",
                        pathname === '/profile' ? "text-slate-900" : "text-slate-400"
                    )}
                >
                    <User className="h-6 w-6" />
                    <span className="text-[10px] font-medium">Compte</span>
                </Link>
            </nav>
        </>
    )
}
