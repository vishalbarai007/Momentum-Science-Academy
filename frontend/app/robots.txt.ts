import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://momentumscienceacademy.com'

  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/about',
        '/programs',
        '/faculty',
        '/gallery',
        '/rankers',
        '/blog',
        '/contact',
      ],
      disallow: [
        '/admin/',    // Protects your Admin dashboard from search results
        '/student/',  // Protects private student portals
        '/teacher/',  // Protects teacher dashboards
        '/api/',      // Prevents crawlers from hitting your API endpoints
        '/_next/',    // Ignores Next.js internal build files
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}