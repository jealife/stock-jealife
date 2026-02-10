'use client'

import { useState, useCallback, useEffect } from 'react'
import { Upload, X, Shield, Info, Tag, Camera, MapPin, Sparkles, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

const SUGGESTED_TAGS = ['Libreville', 'Pointe-Denis', 'Port-Gentil', 'Culture Gabon', 'Nature', 'Faune', 'Okoumé', 'Équateur', 'Plage', 'Tradition']

export default function UploadPage() {
    const { user } = useAuth()
    const router = useRouter()
    const supabase = createClient()
    const [files, setFiles] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [isUploaded, setIsUploaded] = useState(false)
    const [error, setError] = useState(null)

    // Redirect if not logged in
    useEffect(() => {
        if (!user && !isUploaded) {
            router.push('/login?next=/upload')
        }
    }, [user, router, isUploaded])

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files)
        addFiles(selectedFiles)
    }

    const addFiles = (selectedFiles) => {
        const newFiles = selectedFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: URL.createObjectURL(file),
            title: '',
            tags: [],
            location: 'Gabon',
            isPremium: true
        }))
        setFiles(prev => [...prev, ...newFiles])
    }

    const removeFile = (id) => {
        setFiles(prev => {
            const filtered = prev.filter(f => f.id !== id)
            // Cleanup blob URLs
            const removed = prev.find(f => f.id === id)
            if (removed) URL.revokeObjectURL(removed.preview)
            return filtered
        })
    }

    const updateFile = (id, updates) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
    }

    const toggleTag = (id, tag) => {
        setFiles(prev => prev.map(f => {
            if (f.id === id) {
                const tags = f.tags.includes(tag)
                    ? f.tags.filter(t => t !== tag)
                    : [...f.tags, tag]
                return { ...f, tags }
            }
            return f
        }))
    }

    const handleUpload = async () => {
        if (!user || files.length === 0) {
            console.log('Upload aborted: No user or no files')
            return
        }

        setIsUploading(true)
        setError(null)
        console.log('Starting upload for', files.length, 'files')

        try {
            for (const fileObj of files) {
                const fileExt = fileObj.file.name.split('.').pop()
                const fileName = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`

                console.log('Uploading file to storage:', fileName)
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('photos')
                    .upload(fileName, fileObj.file)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('photos')
                    .getPublicUrl(fileName)

                console.log('File uploaded. Public URL:', publicUrl)

                console.log('Inserting metadata to database...')
                const { error: dbError } = await supabase
                    .from('photos')
                    .insert({
                        title: fileObj.title || 'Sans titre',
                        url_thumbnail: publicUrl,
                        url_full: publicUrl,
                        photographer_id: user.id,
                        tags: fileObj.tags,
                        location: fileObj.location,
                        is_premium: fileObj.isPremium
                    })

                if (dbError) throw dbError
                console.log('Database insertion successful')
            }

            console.log('All uploads complete')
            setIsUploaded(true)

            // Cleanup previews
            files.forEach(f => URL.revokeObjectURL(f.preview))
            setFiles([])

            // Short delay for the user to see success state before redirecting
            setTimeout(() => {
                router.push('/')
                router.refresh()
            }, 2500)
        } catch (err) {
            console.error('Upload error details:', err)
            setError(err.message || "Une erreur est survenue lors de l'envoi.")
        } finally {
            setIsUploading(false)
        }
    }

    if (!user && !isUploaded) return null

    if (isUploaded) {
        return (
            <div className="flex min-h-svh flex-col items-center justify-center bg-white p-4 text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl shadow-green-100"
                >
                    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </motion.div>
                <h2 className="mt-8 text-3xl font-black text-slate-900">Photos publiées !</h2>
                <p className="mt-2 text-slate-500 font-bold">Vos créations sont maintenant visibles par toute la communauté.</p>
                <p className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Redirection vers l'accueil...</p>
            </div>
        )
    }

    return (
        <div className="min-h-svh bg-white p-4 md:p-8">
            <div className="mx-auto max-w-4xl pb-12">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-black text-slate-900">Publier vos photos</h1>
                    <p className="mt-2 text-slate-500 font-bold">Partagez la beauté du Gabon avec le monde entier.</p>
                </header>

                {error && (
                    <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600 border border-red-100 italic">
                        {error}
                    </div>
                )}

                {files.length === 0 ? (
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(Array.from(e.dataTransfer.files)) }}
                        className={`flex h-96 flex-col items-center justify-center rounded-[2.5rem] border-4 border-dashed transition-all ${isDragging ? 'border-yellow-400 bg-yellow-50/50 scale-[0.98]' : 'border-slate-100'}`}
                    >
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-200">
                            <Upload className="h-10 w-10" />
                        </div>
                        <p className="mt-6 text-xl font-black">Glissez-déposez vos photos</p>
                        <p className="mt-2 text-slate-400 font-bold">ou cliquez pour parcourir vos fichiers</p>
                        <label className="mt-8 cursor-pointer rounded-2xl bg-slate-100 px-8 py-3 font-black text-slate-900 transition-colors hover:bg-slate-200">
                            Choisir des fichiers
                            <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <AnimatePresence>
                            {files.map((fileObj) => (
                                <motion.div
                                    key={fileObj.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        <div className="relative h-64 w-full md:w-80 md:h-initial overflow-hidden bg-slate-100 shrink-0">
                                            <img src={fileObj.preview} className="h-full w-full object-cover" alt="Preview" />
                                            <button
                                                onClick={() => removeFile(fileObj.id)}
                                                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="flex-1 p-6 space-y-6">
                                            <div className="space-y-1">
                                                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Titre de la photo</label>
                                                <input
                                                    type="text"
                                                    value={fileObj.title}
                                                    onChange={(e) => updateFile(fileObj.id, { title: e.target.value })}
                                                    placeholder="Ex: Marché de Libreville au petit matin"
                                                    className="w-full rounded-2xl bg-slate-50 p-4 font-bold text-slate-900 outline-none border border-transparent focus:border-slate-200 transition-all placeholder:font-medium"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Mots-clés suggérés</label>
                                                    <div className="flex items-center gap-1 text-[10px] font-black text-yellow-600 uppercase">
                                                        <Sparkles className="h-3 w-3" />
                                                        IA Gabon
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {SUGGESTED_TAGS.map(tag => (
                                                        <button
                                                            key={tag}
                                                            onClick={() => toggleTag(fileObj.id, tag)}
                                                            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${fileObj.tags.includes(tag) ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                                        >
                                                            {tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Localisation</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={fileObj.location}
                                                            onChange={(e) => updateFile(fileObj.id, { location: e.target.value })}
                                                            className="w-full rounded-2xl bg-slate-50 p-4 font-bold text-slate-900 outline-none border border-transparent focus:border-slate-200 transition-all pl-10"
                                                        />
                                                        <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Qualité HD</label>
                                                    <div className="flex h-[58px] items-center justify-between rounded-2xl bg-yellow-50/50 px-4 border border-yellow-100/50">
                                                        <span className="text-sm font-black text-slate-700">Vente Premium</span>
                                                        <input
                                                            type="checkbox"
                                                            checked={fileObj.isPremium}
                                                            onChange={(e) => updateFile(fileObj.id, { isPremium: e.target.checked })}
                                                            className="h-5 w-5 rounded-lg accent-yellow-500 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pt-2">
                                                <button className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-slate-900 transition-colors">
                                                    <Camera className="h-4 w-4" />
                                                    Récupérer données EXIF
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <div className="sticky bottom-4 flex items-center justify-between rounded-4xl bg-slate-900 p-3 shadow-2xl md:p-4 z-50">
                            <div className="px-4 hidden sm:block">
                                <p className="text-sm font-black text-white">{files.length} photo(s)</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Prêt pour transfert</p>
                            </div>
                            <div className="flex flex-1 items-center justify-end gap-3">
                                <button
                                    onClick={() => document.querySelector('input[type="file"]').click()}
                                    disabled={isUploading}
                                    className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-white/10 disabled:opacity-50"
                                >
                                    Ajouter
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="flex items-center gap-2 rounded-2xl bg-yellow-400 px-8 py-3 text-sm font-black text-slate-900 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Envoi...
                                        </>
                                    ) : (
                                        'Publier sur JEaLiFe'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
