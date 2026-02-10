'use client'

import { Settings, Shield, Bell, CreditCard, User, LogOut } from 'lucide-react'

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="mx-auto max-w-3xl">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
                    <p className="text-slate-500">Gérez vos préférences et la sécurité de votre compte.</p>
                </header>

                <div className="space-y-6">
                    <Section
                        title="Profil"
                        icon={User}
                        items={[
                            { label: 'Informations personnelles', desc: 'Nom, bio, et localisation' },
                            { label: 'Avatar', desc: 'Changer votre photo de profil' }
                        ]}
                    />

                    <Section
                        title="Paiements"
                        icon={CreditCard}
                        items={[
                            { label: 'Airtel Money', desc: '074 XXX XXX - Compte relié' },
                            { label: 'Moov Money', desc: '066 XXX XXX - Compte relié' },
                            { label: 'Historique des retraits', desc: 'Consulter vos gains' }
                        ]}
                    />

                    <Section
                        title="Sécurité"
                        icon={Shield}
                        items={[
                            { label: 'Mot de passe', desc: 'Dernière modification il y a 3 mois' },
                            { label: 'Double authentification', desc: 'Non activée' }
                        ]}
                    />

                    <Section
                        title="Notifications"
                        icon={Bell}
                        items={[
                            { label: 'Emails', desc: 'Ventes, alertes de connexion' },
                            { label: 'Push Mobile', desc: 'Nouveaux favoris, messages' }
                        ]}
                    />
                </div>

                <div className="mt-12 rounded-3xl bg-red-50 p-6 border border-red-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-red-600">Zone de danger</p>
                            <p className="text-xs text-red-500">Supprimer définitivement votre compte et vos photos.</p>
                        </div>
                        <button className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors">
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Section({ title, icon: Icon, items }) {
    return (
        <div className="rounded-[2.5rem] bg-white p-6 shadow-sm border border-slate-100">
            <div className="mb-6 flex items-center gap-3 px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
                    <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold">{title}</h2>
            </div>
            <div className="space-y-2">
                {items.map((item, i) => (
                    <button
                        key={i}
                        className="flex w-full items-center justify-between rounded-2xl p-4 text-left hover:bg-slate-50 transition-all group"
                    >
                        <div>
                            <p className="font-bold text-slate-900">{item.label}</p>
                            <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                        <div className="h-8 w-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="h-4 w-4 text-slate-400" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

function ArrowRight(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}
