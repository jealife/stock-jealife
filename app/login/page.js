'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const { signIn } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signIn(email, password)
            router.push('/')
        } catch (err) {
            setError(err.message || 'Identifiants incorrects')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-svh w-full overflow-x-hidden">
            {/* Left Side - Image Background */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop")'
                    }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative z-10 flex flex-col justify-between p-12 text-white">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/JEaLiFe-Pictures-logo-white.png" alt="JEaLiFe" className="h-8 w-auto" />
                    </Link>

                    <div className="max-w-md">
                        <h2 className="text-4xl font-black mb-4">La création commence ici</h2>
                        <p className="text-lg font-bold text-white/80 leading-relaxed">
                            Accédez à 5 825 610 photos haute résolution gratuites que vous ne trouverez nulle part ailleurs.
                        </p>
                        <p className="mt-6 text-sm font-bold text-white/60">
                            Mis en ligne le 20 février 2025 par Roman Melnychuk
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex w-full lg:w-1/2 items-center justify-center bg-white p-6 sm:p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <Link href="/" className="flex lg:hidden items-center gap-3 mb-8">
                        <img src="/JEaLiFe-Pictures-logo-black.png" alt="JEaLiFe" className="h-8 w-auto" />
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Connexion</h1>
                        <p className="text-sm font-bold text-slate-500">
                            Bienvenue ! Connectez-vous pour continuer.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-lg bg-red-50 border border-red-100 p-4 text-sm font-bold text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-xs font-black text-slate-900 mb-2">
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-900 outline-none focus:border-slate-900 transition-colors"
                                placeholder="nom@exemple.ga"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-xs font-black text-slate-900">
                                    Mot de passe
                                </label>
                                <Link href="/reset-password" className="text-xs font-bold text-slate-500 hover:text-slate-900">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-11 px-3 pr-10 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-900 outline-none focus:border-slate-900 transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                                    tabIndex="-1"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 rounded-md bg-slate-900 text-sm font-black text-white transition-colors hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm font-bold text-slate-500">
                            Vous n'avez pas de compte ?{' '}
                            <Link href="/register" className="text-slate-900 hover:underline">
                                Inscrivez-vous gratuitement
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs font-bold text-slate-400">
                            Protégé par Cloudflare • <Link href="/privacy" className="hover:text-slate-900">Confidentialité</Link> • <Link href="/terms" className="hover:text-slate-900">Conditions</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
