export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/settings/', '/profile/'],
        },
        sitemap: 'https://stock-jealife.vercel.app/sitemap.xml',
    }
}
