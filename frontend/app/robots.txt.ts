import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Use environment variable if available, otherwise fallback
  const baseUrl = process.env.NEXTAUTH_URL || 'https://momentumscienceacademy.com'

  return {
    rules: [
      {
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
          '/admin',    // Removed trailing slashes for broader protection
          '/student',
          '/teacher',
          '/api',
          '/_next',
        ],
      },
    ],
    sitemap: `${baseUrl.replace(/\/$/, '')}/sitemap.xml`, // Ensures no double slashes
  }
}