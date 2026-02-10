import Link from 'next/link'
import { Camera, Instagram, Twitter, Facebook, Mail } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const links = {
        plateforme: [
            { label: 'À propos', href: '/about' },
            { label: 'Devenir Contributeur', href: '/register' },
            { label: 'Photos Premium', href: '/' },
            { label: 'Blog Culturel', href: '#' },
        ],
        communaute: [
            { label: 'FAQ', href: '#' },
            { label: 'Support WhatsApp', href: '/contact' },
            { label: 'Partenariats', href: '#' },
        ],
        legal: [
            { label: 'Conditions', href: '/terms' },
            { label: 'Confidentialité', href: '/privacy' },
            { label: 'Droits d\'auteur', href: '#' },
        ]
    }

    return (
        <footer className="border-t border-slate-50 bg-white py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-6 md:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xl">
                                J
                            </div>
                            <span className="text-2xl font-black tracking-tight text-slate-900">JEaLiFe</span>
                        </Link>
                        <p className="mt-6 max-w-sm text-lg font-medium text-slate-500 leading-relaxed">
                            La plus grande banque d'images premium dédiée au Gabon. Célébrons ensemble notre patrimoine visuel.
                        </p>
                        <div className="mt-8 flex gap-4">
                            {[Instagram, Twitter, Facebook, Mail].map((Icon, i) => (
                                <button key={i} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all hover:bg-slate-900 hover:text-white">
                                    <Icon className="h-5 w-5" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">Plateforme</h4>
                            <ul className="space-y-4">
                                {links.plateforme.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">Communauté</h4>
                            <ul className="space-y-4">
                                {links.communaute.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">Légal</h4>
                            <ul className="space-y-4">
                                {links.legal.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-slate-50 pt-8 flex flex-col items-center justify-between gap-6 md:flex-row">
                    <p className="text-sm font-bold text-slate-400">
                        © {currentYear} JEaLiFe Pictures. Fait avec passion à Libreville 🇬🇦
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Services Opérationnels</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
