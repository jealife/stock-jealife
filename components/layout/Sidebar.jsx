'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home, Search, PlusSquare, Heart,
    User, Settings, LogOut, Menu,
    ImageIcon, PieChart, Users, Building,
    Layers, Twitter, Instagram, Facebook
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

export default function Sidebar() {
    const pathname = usePathname()
    const { user, signOut } = useAuth()
    const [showExtraMenu, setShowExtraMenu] = useState(false)

    const mainLinks = [
        { href: '/', icon: Home, label: 'Accueil' },
        { href: '/search', icon: Search, label: 'Explorer' },
        { href: '/upload', icon: PlusSquare, label: 'Publier' },
        ...(user ? [
            { href: '/favorites', icon: Heart, label: 'Favoris' },
        ] : [])
    ]

    return (
        <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[60px] flex-col border-r border-slate-100 bg-white md:flex">
            {/* Brand Logo (Unsplash Logo style is square) */}
            <div className="flex h-[60px] items-center justify-center border-b border-slate-50">
                <Link href="/" className="flex h-full w-full items-center justify-center p-2">
                    <img src="/JEaLiFe-Pictures-logo-black.png" alt="JEaLiFe" className="h-auto w-full max-h-8 object-contain" />
                </Link>
            </div>

            {/* Navigation Icons */}
            <nav className="flex flex-1 flex-col items-center gap-2 py-6">
                {mainLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                                isActive
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <link.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />

                            {/* Tooltip */}
                            <div className="absolute left-full ml-4 hidden rounded bg-slate-900 px-2 py-1 text-[10px] font-bold text-white group-hover:block z-50 whitespace-nowrap shadow-xl">
                                {link.label}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="flex flex-col items-center gap-4 border-t border-slate-50 py-6">
                {/* User Profile / Login */}
                <Link
                    href={user ? "/profile" : "/login"}
                    className="group relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden"
                >
                    {user ? (
                        <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-200 p-0.5">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user.email}&background=random`}
                                className="h-full w-full rounded-full object-cover"
                                alt="Profile"
                            />
                        </div>
                    ) : (
                        <User className="h-5 w-5 text-slate-400 group-hover:text-slate-900" />
                    )}
                    <div className="absolute left-full ml-4 hidden rounded bg-slate-900 px-2 py-1 text-[10px] font-bold text-white group-hover:block z-50 whitespace-nowrap shadow-xl">
                        {user ? "Compte" : "Connexion"}
                    </div>
                </Link>

                {/* Hamburger Menu (Institutional links) */}
                <div className="relative">
                    <button
                        onClick={() => setShowExtraMenu(!showExtraMenu)}
                        className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg transition-all",
                            showExtraMenu ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-900"
                        )}
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <AnimatePresence>
                        {showExtraMenu && (
                            <>
                                <div className="fixed inset-0 z-40 bg-black/5" onClick={() => setShowExtraMenu(false)} />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, x: -10 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, x: -10 }}
                                    className="absolute bottom-0 left-14 z-50 w-[700px] overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-100"
                                >
                                    <div className="flex p-8 pb-12">
                                        {/* Column 1: Société */}
                                        <div className="flex-1 space-y-6">
                                            <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                                                <Building className="h-4 w-4" />
                                                <h3>Société</h3>
                                            </div>
                                            <ul className="space-y-3 text-sm font-medium text-slate-500">
                                                <li><Link href="/about" className="hover:text-slate-900 transition-colors">Qui sommes-nous ?</Link></li>
                                                <li><Link href="/advertise" className="hover:text-slate-900 transition-colors">Faire de la pub</Link></li>
                                                <li><Link href="/history" className="hover:text-slate-900 transition-colors">Histoire</Link></li>
                                                <li><Link href="/careers" className="hover:text-slate-900 transition-colors">Rejoindre l'équipe</Link></li>
                                                <li><Link href="/blog" className="hover:text-slate-900 transition-colors">Blog</Link></li>
                                                <li><Link href="/press" className="hover:text-slate-900 transition-colors">Newsroom</Link></li>
                                                <li><Link href="/contact" className="hover:text-slate-900 transition-colors">Contactez-nous</Link></li>
                                                <li><Link href="/help" className="hover:text-slate-900 transition-colors">Centre d'assistance</Link></li>
                                            </ul>
                                            <div className="flex gap-4 text-slate-400 pt-2">
                                                <Twitter className="h-4 w-4 hover:text-slate-900 cursor-pointer transition-colors" />
                                                <Facebook className="h-4 w-4 hover:text-slate-900 cursor-pointer transition-colors" />
                                                <Instagram className="h-4 w-4 hover:text-slate-900 cursor-pointer transition-colors" />
                                            </div>
                                        </div>

                                        {/* Column 2: Produit */}
                                        <div className="flex-1 space-y-6">
                                            <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                                                <Layers className="h-4 w-4" />
                                                <h3>Produit</h3>
                                            </div>
                                            <ul className="space-y-3 text-sm font-medium text-slate-500">
                                                <li><Link href="/developers" className="hover:text-slate-900 transition-colors">Développeurs / API</Link></li>
                                                <li><Link href="/dataset" className="hover:text-slate-900 transition-colors">JEaLiFe Dataset</Link></li>
                                                <li><Link href="/ios" className="hover:text-slate-900 transition-colors">JEaLiFe pour iOS</Link></li>
                                                <li><Link href="/apps" className="hover:text-slate-900 transition-colors">Applis & plug-ins</Link></li>
                                                <li><Link href="/studio" className="hover:text-slate-900 transition-colors">JEaLiFe Studio</Link></li>
                                            </ul>
                                        </div>

                                        {/* Column 3: Communauté */}
                                        <div className="flex-1 space-y-6">
                                            <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                                                <Users className="h-4 w-4" />
                                                <h3>Communauté</h3>
                                            </div>
                                            <ul className="space-y-3 text-sm font-medium text-slate-500">
                                                <li><Link href="/register" className="hover:text-slate-900 transition-colors">Devenir contributeur</Link></li>
                                                <li><Link href="/collections" className="hover:text-slate-900 transition-colors">Collections</Link></li>
                                                <li><Link href="/trends" className="hover:text-slate-900 transition-colors">Tendances</Link></li>
                                                <li><Link href="/awards" className="hover:text-slate-900 transition-colors">JEaLiFe Awards</Link></li>
                                                <li><Link href="/stats" className="hover:text-slate-900 transition-colors">Statistiques</Link></li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center gap-6 border-t border-slate-100 bg-slate-50/50 px-8 py-4 text-xs font-bold text-slate-500">
                                        <Link href="/license" className="hover:text-slate-900 transition-colors">Licence</Link>
                                        <Link href="/privacy" className="hover:text-slate-900 transition-colors">Charte de protection des données</Link>
                                        <Link href="/terms" className="hover:text-slate-900 transition-colors">Conditions générales</Link>
                                        <Link href="/security" className="hover:text-slate-900 transition-colors">Sécurité</Link>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </aside>
    )
}
