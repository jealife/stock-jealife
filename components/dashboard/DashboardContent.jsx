'use client'

import React from 'react'
import {
    BarChart3,
    Image as ImageIcon,
    Download,
    Eye,
    TrendingUp,
    DollarSign,
    Clock,
    ChevronRight,
    Plus,
    Settings,
    ShieldCheck,
    CreditCard
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function DashboardContent({ user, stats, recentSales }) {

    const statsConfig = [
        { label: 'Revenus totaux', value: `${stats.revenue?.toLocaleString()} FCFA`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Téléchargements', value: stats.downloads?.toString(), icon: Download, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Vues totales', value: stats.views?.toLocaleString(), icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Photos publiées', value: stats.photosCount?.toString(), icon: ImageIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
    ]

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-10">
            <div className="mx-auto max-w-7xl">
                <header className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">
                            <ShieldCheck className="h-4 w-4" />
                            Espace Contributeur
                        </div>
                        <h1 className="text-4xl font-black text-slate-900">Dashboard</h1>
                        <p className="mt-2 font-medium text-slate-500">Gérez vos créations et suivez vos revenus au Gabon.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/upload"
                            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 font-bold text-white shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 active:scale-95"
                        >
                            <Plus className="h-5 w-5" />
                            Nouvelle Photo
                        </Link>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {statsConfig.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-[2.5rem] bg-white p-6 shadow-sm border border-slate-100"
                        >
                            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="mt-1 text-2xl font-black text-slate-900">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-100">
                            <div className="mb-8 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900">Ventes Récentes</h2>
                                <button className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Tout voir</button>
                            </div>
                            <div className="space-y-4">
                                {recentSales.length > 0 ? (
                                    recentSales.map((sale) => (
                                        <div key={sale.id} className="flex items-center justify-between rounded-3xl bg-slate-50/50 p-4 transition-colors hover:bg-slate-50 border border-transparent hover:border-slate-100">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-slate-200 flex items-center justify-center">
                                                    <ImageIcon className="h-6 w-6 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{sale.photo}</p>
                                                    <p className="text-xs text-slate-500">{sale.buyer} • {sale.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-slate-900">{sale.amount}</p>
                                                <p className={`text-[10px] font-bold uppercase tracking-widest ${sale.status === 'Payé' ? 'text-emerald-500' : 'text-blue-500'}`}>
                                                    {sale.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-400 font-bold">Aucune vente pour le moment.</div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <Link href="/settings" className="group rounded-[2.5rem] bg-indigo-600 p-8 text-white shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700">
                                <CreditCard className="mb-4 h-8 w-8" />
                                <h3 className="text-xl font-black">Mode de Paiement</h3>
                                <p className="mt-2 text-indigo-100 font-medium">Configurez votre compte Airtel Money ou Moov Money pour recevoir vos gains.</p>
                                <ChevronRight className="mt-6 h-6 w-6 transition-transform group-hover:translate-x-2" />
                            </Link>
                            <div className="rounded-[2.5rem] bg-white p-8 border border-slate-100">
                                <TrendingUp className="mb-4 h-8 w-8 text-slate-900" />
                                <h3 className="text-xl font-black">Conseils IA</h3>
                                <p className="mt-2 text-slate-500 font-medium">Les photos de nature au Gabon sont très demandées en ce moment. Pensez à l'Okoumé !</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-200">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                                <BarChart3 className="h-8 w-8 text-yellow-400" />
                            </div>
                            <h3 className="text-2xl font-black">Progression</h3>
                            <p className="mt-2 text-slate-400 font-medium">Vous êtes à 80% de votre objectif mensuel.</p>
                            <div className="mt-8 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                                <div className="h-full w-[80%] bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
                            </div>
                            <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">80 / 100 Ventes</p>
                        </div>

                        <div className="rounded-[2.5rem] bg-white p-8 border border-slate-100">
                            <h3 className="text-lg font-bold mb-4">Besoin d'aide ?</h3>
                            <p className="text-slate-500 text-sm mb-6">Notre équipe support est disponible pour vous accompagner dans vos ventes.</p>
                            <button className="w-full rounded-2xl bg-slate-50 py-4 text-sm font-bold text-slate-900 transition-all hover:bg-slate-100">
                                Contacter le support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
