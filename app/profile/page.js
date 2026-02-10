'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { User, MapPin, Camera, Calendar, Award, Upload, Check, X, Loader2, Globe, Instagram, Twitter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import MasonryGrid from '@/components/photo/MasonryGrid'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
    const { user } = useAuth()
    const router = useRouter()
    const supabase = createClient()

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState(null)

    // Form state
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        bio: '',
        location: '',
        website: '',
        twitter_handle: '',
        instagram_handle: '',
        available_for_hire: false
    })

    const [newAvatar, setNewAvatar] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const fileInputRef = useRef(null)

    useEffect(() => {
        if (user) {
            fetchProfile()
        } else if (!loading) {
            router.push('/login')
        }
    }, [user])

    const fetchProfile = async () => {
        try {
            setLoading(true)

            // Fetch profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profileError) throw profileError

            // Fetch photos
            const { data: photosData, error: photosError } = await supabase
                .from('photos')
                .select(`
                    *,
                    creator:profiles!photographer_id (
                        id,
                        username,
                        full_name,
                        avatar_url,
                        available_for_hire
                    )
                `)
                .eq('photographer_id', user.id)
                .order('created_at', { ascending: false })

            if (photosError) throw photosError

            if (profileData) {
                const transformedData = {
                    ...profileData,
                    name: profileData.full_name,
                    photos: photosData?.map(photo => ({
                        ...photo,
                        creator: {
                            ...photo.creator,
                            name: photo.creator?.full_name || 'Unknown',
                            avatar: photo.creator?.avatar_url || null
                        },
                        thumbnail: photo.url_thumbnail
                    })) || []
                }

                setProfile(transformedData)
                setFormData({
                    first_name: transformedData.first_name || '',
                    last_name: transformedData.last_name || '',
                    username: transformedData.username || '',
                    bio: transformedData.bio || '',
                    location: transformedData.location || '',
                    website: transformedData.website || '',
                    twitter_handle: transformedData.twitter_handle || '',
                    instagram_handle: transformedData.instagram_handle || '',
                    available_for_hire: transformedData.available_for_hire || false
                })
            }
        } catch (err) {
            console.error('Error fetching profile:', err)
            setError("Impossible de charger le profil.")
        } finally {
            setLoading(false)
        }
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setNewAvatar(file)
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    const handleSave = async () => {
        if (!user) return

        setIsSaving(true)
        setError(null)

        try {
            let avatarUrl = profile.avatar_url

            // 1. Handle Avatar Upload
            if (newAvatar) {
                const fileExt = newAvatar.name.split('.').pop()
                const fileName = `${user.id}/avatar-${Math.random().toString(36).substring(2)}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('photos') // Reusing photos bucket for now, ideally 'avatars'
                    .upload(fileName, newAvatar)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('photos')
                    .getPublicUrl(fileName)

                avatarUrl = publicUrl
            }

            // 2. Update Profile Table
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    username: formData.username,
                    bio: formData.bio,
                    location: formData.location,
                    website: formData.website,
                    twitter_handle: formData.twitter_handle,
                    instagram_handle: formData.instagram_handle,
                    available_for_hire: formData.available_for_hire,
                    avatar_url: avatarUrl,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)

            if (updateError) throw updateError

            // Refresh data
            await fetchProfile()
            setIsEditing(false)
            setNewAvatar(null)
            setAvatarPreview(null)
        } catch (err) {
            console.error('Error saving profile:', err)
            setError(err.message || "Erreur lors de l'enregistrement.")
        } finally {
            setIsSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-10">
            <div className="mx-auto max-w-5xl">
                {/* Header Card */}
                <div className="mb-10 flex flex-col overflow-hidden rounded-[3rem] bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="h-48 w-full bg-slate-900 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=2000&auto=format&fit=crop")' }}>
                        <div className="h-full w-full bg-black/40 backdrop-blur-[2px]" />
                    </div>

                    <div className="relative px-8 pb-10">
                        <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 relative z-10">
                            <div className="relative group">
                                <div className="h-40 w-40 overflow-hidden rounded-[2.5rem] border-8 border-white bg-slate-100 shadow-2xl relative">
                                    <img
                                        src={avatarPreview || profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.first_name || 'U'}&size=256&background=0f172a&color=fff`}
                                        alt="Avatar"
                                        className="h-full w-full object-cover"
                                    />
                                    <AnimatePresence>
                                        {isEditing && (
                                            <motion.button
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                onClick={triggerFileInput}
                                                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/50"
                                            >
                                                <Camera className="h-8 w-8" />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>
                                {!isEditing && profile?.available_for_hire && (
                                    <div className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-white shadow-lg ring-4 ring-white">
                                        <Check className="h-6 w-6" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                    <div>
                                        <h1 className="text-4xl font-black text-slate-900">
                                            {profile?.full_name || user?.email?.split('@')[0]}
                                        </h1>
                                        <p className="font-bold text-slate-400">@{profile?.username || 'utilisateur'}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(false)
                                                        setAvatarPreview(null)
                                                        setNewAvatar(null)
                                                    }}
                                                    disabled={isSaving}
                                                    className="flex items-center gap-2 rounded-2xl border-2 border-slate-100 px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-50"
                                                >
                                                    <X className="h-5 w-5" />
                                                    Annuler
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    disabled={isSaving}
                                                    className="flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-3 font-bold text-white shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 disabled:opacity-50"
                                                >
                                                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                                                    Enregistrer
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-3 font-bold text-white shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 active:scale-95"
                                            >
                                                Modifier Profil
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-6 border-t border-slate-50 pt-6">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                        <MapPin className="h-5 w-5 text-slate-300" />
                                        {profile?.location || 'Gabon'}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                        <Calendar className="h-5 w-5 text-slate-300" />
                                        S'est joint en {new Date(profile?.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    {/* Sidebar Editing or Info */}
                    <div className="lg:col-span-12">
                        {isEditing ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-[3rem] bg-white p-10 shadow-sm border border-slate-100 space-y-8"
                            >
                                <h2 className="text-2xl font-black text-slate-900">Détails personnels</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-4">Prénom</label>
                                        <input
                                            type="text"
                                            value={formData.first_name}
                                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                            className="w-full rounded-2xl bg-slate-50 p-4 font-bold outline-none border border-transparent focus:border-slate-200 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-4">Nom</label>
                                        <input
                                            type="text"
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                            className="w-full rounded-2xl bg-slate-50 p-4 font-bold outline-none border border-transparent focus:border-slate-200 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-4">Nom d'utilisateur</label>
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full rounded-2xl bg-slate-50 p-4 font-bold outline-none border border-transparent focus:border-slate-200 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-4">Localisation</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full rounded-2xl bg-slate-50 p-4 font-bold outline-none border border-transparent focus:border-slate-200 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-4">Biographie</label>
                                    <textarea
                                        rows={4}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full rounded-3xl bg-slate-50 p-6 font-bold outline-none border border-transparent focus:border-slate-200 transition-all resize-none"
                                        placeholder="Parlez-nous de votre passion pour la photographie..."
                                    />
                                </div>

                                <h2 className="text-2xl font-black text-slate-900 pt-4">Réseaux & Web</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2 relative">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-4">Site Web</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.website}
                                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                className="w-full rounded-2xl bg-slate-50 p-4 pl-12 font-bold outline-none border border-transparent focus:border-slate-200 transition-all"
                                            />
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 relative">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-4">Twitter</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.twitter_handle}
                                                onChange={(e) => setFormData({ ...formData, twitter_handle: e.target.value })}
                                                className="w-full rounded-2xl bg-slate-50 p-4 pl-12 font-bold outline-none border border-transparent focus:border-slate-200 transition-all"
                                                placeholder="@username"
                                            />
                                            <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 relative">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-4">Instagram</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.instagram_handle}
                                                onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
                                                className="w-full rounded-2xl bg-slate-50 p-4 pl-12 font-bold outline-none border border-transparent focus:border-slate-200 transition-all"
                                                placeholder="@username2"
                                            />
                                            <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 rounded-3xl bg-yellow-50 p-6 border border-yellow-100 italic">
                                    <input
                                        type="checkbox"
                                        id="hire"
                                        checked={formData.available_for_hire}
                                        onChange={(e) => setFormData({ ...formData, available_for_hire: e.target.checked })}
                                        className="h-6 w-6 rounded-lg accent-yellow-400"
                                    />
                                    <label htmlFor="hire" className="text-yellow-900 font-black cursor-pointer">Je suis disponible pour des missions de photographie (Freelance)</label>
                                </div>

                                {error && (
                                    <p className="text-red-500 font-bold px-4">{error}</p>
                                )}
                            </motion.div>
                        ) : (
                            <div className="rounded-[3rem] bg-white p-10 shadow-sm border border-slate-100">
                                <div className="mb-10 flex items-center justify-between">
                                    <h2 className="text-2xl font-black text-slate-900">Ma Galerie</h2>
                                    <div className="flex gap-4">
                                        <button className="text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-2">Publiées ({profile?.photos?.length || 0})</button>
                                        <button className="text-sm font-bold text-slate-300 hover:text-slate-900 transition-colors pb-2">Collections</button>
                                    </div>
                                </div>

                                {profile?.photos?.length > 0 ? (
                                    <MasonryGrid photos={profile.photos} />
                                ) : (
                                    <div className="flex h-80 flex-col items-center justify-center rounded-[2.5rem] border-4 border-dashed border-slate-50 text-slate-400">
                                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50">
                                            <Camera className="h-10 w-10 opacity-20" />
                                        </div>
                                        <p className="text-lg font-bold">Votre galerie est encore vide</p>
                                        <p className="mt-1 text-sm font-medium">Partagez vos plus belles photos du Gabon aujourd'hui.</p>
                                        <Link href="/upload" className="mt-8 flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white shadow-lg shadow-slate-200 transition-all hover:scale-105 active:scale-95">
                                            <Upload className="h-5 w-5" />
                                            Publier ma première photo
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
