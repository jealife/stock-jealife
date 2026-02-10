import { notFound } from 'next/navigation'
import { MapPin, Calendar, Camera, UserPlus } from 'lucide-react'
import MasonryGrid from '@/components/photo/MasonryGrid'
import { getUserProfile } from '@/lib/data'

export async function generateMetadata({ params }) {
    const { username } = await params
    const profile = await getUserProfile(username)
    if (!profile) return { title: 'Utilisateur non trouvé' }

    return {
        title: `${profile.name} (@${profile.username}) | JEaLiFe Pictures`,
        description: profile.bio || `Découvrez les photos de ${profile.name} sur JEaLiFe Pictures.`,
        openGraph: {
            images: [profile.avatar],
        },
    }
}

export default async function UserProfilePage({ params }) {
    const { username } = await params
    const profile = await getUserProfile(username)

    if (!profile) {
        notFound()
        return null // Should not reach here
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-slate-100 md:h-40 md:w-40 bg-slate-100">
                            {profile.avatar ? (
                                <img
                                    src={profile.avatar}
                                    alt={profile.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-slate-200 text-slate-400 font-bold text-4xl">
                                    {profile.name?.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 md:text-4xl">{profile.name}</h1>
                                <p className="mt-2 max-w-xl text-base text-slate-500">{profile.bio || "Aucune biographie pour le moment."}</p>
                            </div>

                            <div className="flex gap-3 mt-4 md:mt-0">
                                <button className="flex items-center gap-2 rounded-md border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-500 transition-colors hover:border-slate-900 hover:text-slate-900">
                                    <UserPlus className="h-4 w-4" />
                                    Suivre
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-500">
                            {profile.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {profile.location}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Membre depuis {new Date(profile.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                            </div>
                            {profile.available_for_hire && (
                                <div className="flex items-center gap-2 text-green-600 font-bold">
                                    <Camera className="h-4 w-4" />
                                    Disponible pour embauche
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs / Stats */}
                <div className="mb-8 border-b border-slate-100">
                    <div className="flex gap-8">
                        <button className="border-b-2 border-slate-900 pb-4 text-sm font-black text-slate-900">
                            Photos <span className="ml-1 text-slate-400 font-medium">{profile.stats.photos}</span>
                        </button>
                        <button className="pb-4 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                            J'aime <span className="ml-1 text-slate-400 font-medium">{profile.stats.likes}</span>
                        </button>
                        <button className="pb-4 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                            Collections <span className="ml-1 text-slate-400 font-medium">{profile.stats.collections}</span>
                        </button>
                    </div>
                </div>

                {/* Gallery */}
                <div>
                    {profile.photos.length > 0 ? (
                        <MasonryGrid photos={profile.photos} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <Camera className="h-10 w-10 text-slate-300 mb-4" />
                            <p className="text-slate-400 font-bold mb-2">Aucune photo publiée.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
