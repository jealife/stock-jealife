'use client'

import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl px-6 py-20">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                    <div>
                        <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-6">Contactez-nous</h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">
                            Besoin d'aide pour vos licences photos ou pour rejoindre notre communauté au Gabon ?
                            Notre équipe est à votre écoute.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Email</h3>
                                    <p className="text-slate-500 font-medium">contact@jealife-pictures.ga</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg">
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">WhatsApp Support</h3>
                                    <p className="text-slate-500 font-medium">+241 74 00 00 00</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Bureau</h3>
                                    <p className="text-slate-500 font-medium">Libreville, Gabon</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[3rem] bg-slate-50 p-10 border border-slate-100 shadow-sm">
                        {submitted ? (
                            <div className="flex h-full flex-col items-center justify-center text-center">
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white">
                                    <Send className="h-10 w-10" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Message envoyé !</h2>
                                <p className="mt-2 text-slate-500 font-medium">Nous vous répondrons sous 24h.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-8 font-bold text-slate-900 underline"
                                >
                                    Envoyer un autre message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Nom complet</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Jean-Louis Bongho"
                                        className="h-14 w-full rounded-2xl bg-white px-6 font-medium text-slate-900 outline-none border border-transparent focus:border-slate-900 transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="nom@exemple.ga"
                                        className="h-14 w-full rounded-2xl bg-white px-6 font-medium text-slate-900 outline-none border border-transparent focus:border-slate-900 transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Votre message</label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="Comment pouvons-nous vous aider ?"
                                        className="w-full rounded-2xl bg-white p-6 font-medium text-slate-900 outline-none border border-transparent focus:border-slate-900 transition-all shadow-sm resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 font-bold text-white transition-all hover:bg-slate-800 active:scale-95 shadow-xl shadow-slate-200"
                                >
                                    Envoyer le message
                                    <Send className="h-5 w-5" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
