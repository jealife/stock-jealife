'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Download,
    Heart,
    Share2,
    Info,
    MapPin,
    Calendar,
    ShieldCheck,
    Camera,
    Plus,
    ArrowLeft,
    X,
    CheckCircle2,
    ArrowRight,
    Lock,
    Sparkles
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { incrementViews, incrementDownloads, toggleLike, checkIfLiked } from '@/lib/actions'

export default function PhotoDetail({ photo }) {
    const router = useRouter()
    const { user } = useAuth()
    const [isFavorited, setIsFavorited] = useState(false)
    const [downloadSuccess, setDownloadSuccess] = useState(false)
    const [showPremiumModal, setShowPremiumModal] = useState(false)
    const [stats, setStats] = useState({
        views: parseInt(photo.stats?.views?.replace(/,/g, '') || 0),
        downloads: parseInt(photo.stats?.downloads?.replace(/,/g, '') || 0),
        likes: photo.likes_count || 0
    })

    // Track views
    useEffect(() => {
        if (photo.id) {
            incrementViews(photo.id)
            setStats(prev => ({ ...prev, views: prev.views + 1 }))
        }
    }, [photo.id])

    // Check if liked
    useEffect(() => {
        if (photo.id && user) {
            checkIfLiked(photo.id, user.id).then(setIsFavorited)
        }
    }, [photo.id, user])

    const handleLike = async () => {
        if (!user) {
            router.push('/login')
            return
        }

        const liked = await toggleLike(photo.id, user.id)
        setIsFavorited(liked)
        setStats(prev => ({
            ...prev,
            likes: liked ? prev.likes + 1 : prev.likes - 1
        }))
    }

    const handleDownload = async () => {
        if (photo.is_premium) {
            setShowPremiumModal(true)
            return
        }

        // Free download logic
        try {
            setDownloadSuccess(true)
            await incrementDownloads(photo.id)
            setStats(prev => ({ ...prev, downloads: prev.downloads + 1 }))

            // Real browser download
            const response = await fetch(photo.url_full || photo.thumbnail)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `jealife-${photo.id}.jpg`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            setTimeout(() => setDownloadSuccess(false), 3000)
        } catch (err) {
            console.error("Download failed:", err)
        }
    }

    if (!photo) return null

    return (
        <div className="min-h-screen bg-white">
            {/* Detail Navbar */}
            <div className="sticky top-0 z-40 flex h-14 items-center justify-between bg-white/95 px-3 backdrop-blur-md border-b border-slate-100 sm:h-16 sm:px-4 md:px-6">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <button
                        onClick={() => router.back()}
                        className="flex-shrink-0 p-1.5 hover:bg-slate-50 rounded-lg transition-colors md:hidden"
                    >
                        <ArrowLeft className="h-5 w-5 text-slate-900" />
                    </button>

                    <Link href={`/users/${photo.creator.username || photo.creator.name.replace(/\s+/g, '-').toLowerCase()}`} className="flex items-center gap-2 sm:gap-3 group">
                        <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-100 bg-slate-50 flex-shrink-0 sm:h-9 sm:w-9 transition-transform group-hover:scale-105">
                            <img src={photo.creator.avatar || `https://ui-avatars.com/api/?name=${photo.creator.name}`} className="h-full w-full object-cover" alt={photo.creator.name} />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs font-black text-slate-900 leading-tight truncate sm:text-sm group-hover:underline decoration-slate-900 underline-offset-2">{photo.creator.name}</span>
                            {photo.creator.available && (
                                <span className="hidden sm:block text-[10px] font-bold text-slate-500 hover:text-slate-900 cursor-pointer transition-colors truncate">
                                    Disponible pour embauche 🟢
                                </span>
                            )}
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <button
                        onClick={handleLike}
                        className={cn(
                            "flex h-8 w-8 sm:w-auto items-center justify-center sm:gap-2 rounded border border-slate-200 sm:px-3 text-xs font-bold transition-colors hover:border-slate-900",
                            isFavorited ? 'bg-red-50 text-red-500 border-red-100' : 'text-slate-500'
                        )}
                    >
                        <Heart className={cn("h-4 w-4", isFavorited && "fill-current text-red-500")} />
                        <span className="hidden sm:inline">{isFavorited ? 'Aimé' : 'Liker'}</span>
                    </button>
                    <button className="hidden sm:flex h-8 items-center gap-2 rounded border border-slate-200 px-3 text-xs font-bold text-slate-500 transition-colors hover:border-slate-900">
                        <Plus className="h-4 w-4" />
                        <span className="hidden md:inline">Collectionner</span>
                    </button>

                    <div className="relative">
                        <button
                            onClick={handleDownload}
                            className={cn(
                                "flex h-8 items-center gap-1.5 rounded px-2.5 text-[10px] font-black text-white transition-colors sm:gap-2 sm:px-4 sm:text-xs",
                                photo.is_premium ? "bg-yellow-500 hover:bg-yellow-600" : "bg-[#3cb46e] hover:bg-[#37a665]"
                            )}
                        >
                            {photo.is_premium ? <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                            <span className="hidden xs:inline">{photo.is_premium ? 'Débloquer HD' : 'Télécharger'}</span>
                        </button>
                        <AnimatePresence>
                            {downloadSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute right-0 top-full mt-2 w-max rounded-lg bg-slate-950 px-3 py-2 text-[10px] font-bold text-white shadow-2xl z-50 flex items-center gap-2"
                                >
                                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                    Téléchargement en cours...
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[1600px] mx-auto px-4 py-8 md:px-6 md:py-12">
                {/* Main Photo Display */}
                <div className="flex justify-center mb-6 sm:mb-8">
                    <div className="relative group w-full max-w-5xl overflow-hidden rounded-lg sm:rounded-xl shadow-2xl">
                        <img
                            src={photo.thumbnail}
                            alt={photo.title || "Photo JEaLiFe"}
                            className="w-full h-auto object-contain"
                        />
                        {photo.is_premium && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                                <div className="flex flex-col items-center gap-4 bg-white/90 p-6 rounded-2xl shadow-2xl border border-white">
                                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                        <Sparkles className="h-6 w-6" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-black text-slate-900">Version Premium</h3>
                                        <p className="text-xs font-bold text-slate-500 mt-1">Soutenez le photographe</p>
                                    </div>
                                    <button
                                        onClick={() => setShowPremiumModal(true)}
                                        className="rounded-full bg-slate-900 px-6 py-2 text-xs font-black text-white hover:bg-slate-800 transition-all"
                                    >
                                        Obtenir l'original HD
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info & Metadata */}
                <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:gap-20 max-w-6xl mx-auto">
                    <div className="flex-1 space-y-6 sm:space-y-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap gap-6 sm:gap-8">
                                <div>
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Vues</span>
                                    <div className="mt-1 text-base font-black text-slate-900 sm:text-lg">{stats.views.toLocaleString()}</div>
                                </div>
                                <div>
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Téléchargements</span>
                                    <div className="mt-1 text-base font-black text-slate-900 sm:text-lg">{stats.downloads.toLocaleString()}</div>
                                </div>
                                <div>
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Mention J'aime</span>
                                    <div className="mt-1 text-base font-black text-slate-900 sm:text-lg">{stats.likes.toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 text-xs font-bold text-slate-500">
                                {photo.location && (
                                    <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 flex-shrink-0" /> {photo.location}</div>
                                )}
                                <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 flex-shrink-0" /> {photo.creator?.specs?.published || 'Récemment'}</div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
                                    {photo.is_premium ? 'Licence Commerciale' : 'Licence JEaLiFe (Gratuit)'}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-black text-slate-900 mb-2 sm:text-xl sm:mb-3">{photo.title}</h2>
                            <p className="text-sm font-bold text-slate-500 leading-relaxed sm:text-base">
                                {photo.description}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2 sm:pt-4">
                            {photo.tags && photo.tags.map(tag => (
                                <Link
                                    key={tag}
                                    href={`/search?q=${tag}`}
                                    className="rounded bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="w-full lg:w-72 space-y-4 sm:space-y-6">
                        <div className="rounded-xl border border-slate-100 p-4 sm:p-6 bg-slate-50/50">
                            <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3 sm:mb-4">
                                <Camera className="h-4 w-4" /> Détails techniques
                            </h4>
                            <div className="text-sm font-black text-slate-900">{photo.camera_model || 'Non spécifié'}</div>
                            <div className="mt-2 text-[10px] font-bold text-slate-400">Dimension : {photo.width} x {photo.height} px</div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex h-10 w-10 items-center justify-center rounded border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-colors bg-white">
                                <Share2 className="h-5 w-5" />
                            </button>
                            <button className="flex h-10 w-10 items-center justify-center rounded border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-colors bg-white">
                                <Info className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Modal */}
            <AnimatePresence>
                {showPremiumModal && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPremiumModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
                        >
                            <button
                                onClick={() => setShowPremiumModal(false)}
                                className="absolute right-6 top-6 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="p-8 sm:p-10">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600">
                                    <Sparkles className="h-8 w-8" />
                                </div>

                                <h2 className="text-3xl font-black text-slate-900 leading-tight">
                                    Obtenez l'image originale en HD
                                </h2>
                                <p className="mt-4 text-sm font-bold text-slate-500 leading-relaxed">
                                    Cette photo est classée comme <span className="text-slate-900">Premium</span>. En l'achetant, vous obtenez l'image originale sans compression et soutenez directement le créateur gabonais.
                                </p>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center justify-between rounded-2xl border-2 border-slate-900 p-5">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prix Unique</span>
                                            <span className="text-2xl font-black text-slate-900">500 FCFA</span>
                                        </div>
                                        <button className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-black text-white hover:bg-slate-800 transition-all flex items-center gap-2">
                                            Acheter <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="flex flex-col items-center gap-3 py-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Paiements acceptés au Gabon</span>
                                        <img src="/images/payments.png" alt="Airtel Money, Moov Money, Visa" className="h-8 object-contain" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
