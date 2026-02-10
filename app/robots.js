export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/settings/', '/profile/'],
        },
        sitemap: 'https://pictures.jealife.ga/sitemap.xml',
    }
}
