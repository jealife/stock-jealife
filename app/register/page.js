'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [acceptTerms, setAcceptTerms] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const { signUp } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signUp(email, password, { firstName, lastName, username })
            router.push('/')
        } catch (err) {
            setError(err.message || 'Une erreur est survenue')
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
                        backgroundImage: 'url("https://images.unsplash.com/photo-1518173946687-a4c8a9ba332f?q=80&w=2000&auto=format&fit=crop")'
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

            {/* Right Side - Registration Form */}
            <div className="flex w-full lg:w-1/2 items-center justify-center bg-white p-6 sm:p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <Link href="/" className="flex lg:hidden items-center gap-3 mb-8">
                        <img src="/JEaLiFe-Pictures-logo-black.png" alt="JEaLiFe" className="h-8 w-auto" />
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-slate-900 mb-2">S'inscrire à JEaLiFe</h1>
                        <p className="text-sm font-bold text-slate-500">
                            Vous avez déjà un compte ? <Link href="/login" className="text-slate-900 hover:underline">Connexion</Link>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-lg bg-red-50 border border-red-100 p-4 text-sm font-bold text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="firstName" className="block text-xs font-black text-slate-900 mb-2">
                                    Prénom
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-900 outline-none focus:border-slate-900 transition-colors"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-xs font-black text-slate-900 mb-2">
                                    Nom
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-900 outline-none focus:border-slate-900 transition-colors"
                                />
                            </div>
                        </div>

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
                            />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-xs font-black text-slate-900 mb-2">
                                Nom d'utilisateur <span className="text-slate-400 font-normal text-[10px]">(n'utilisez que des lettres, des chiffres ou des tirets)</span>
                            </label>
                            <input
                                id="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-900 outline-none focus:border-slate-900 transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-black text-slate-900 mb-2">
                                Mot de passe <span className="text-slate-400 font-normal text-[10px]">(8 car. minimum)</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-11 px-3 pr-10 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-900 outline-none focus:border-slate-900 transition-colors"
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

                        <div className="flex items-center gap-2 py-2">
                            <div className="relative flex items-center">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    required
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="h-5 w-5 rounded border-2 border-slate-300 text-slate-900 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                />
                                {acceptTerms && (
                                    <svg className="absolute left-0.5 top-0.5 h-4 w-4 text-white pointer-events-none" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
                                    </svg>
                                )}
                            </div>
                            <label htmlFor="terms" className="text-xs font-bold text-slate-500 leading-tight cursor-pointer">
                                En vous inscrivant, vous acceptez les <Link href="/terms" className="text-slate-900 hover:underline">Conditions</Link> et la <Link href="/privacy" className="text-slate-900 hover:underline">Charte de protection des données</Link>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !acceptTerms}
                            className="w-full h-11 rounded-md bg-slate-900 text-sm font-black text-white transition-colors hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? 'Inscription...' : "S'inscrire"}
                        </button>
                    </form>

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
