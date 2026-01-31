import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://momentumscienceacademy.com'

  // Define your static routes based on your app structure
  const routes = [
    '',
    '/about',
    '/programs',
    '/faculty',
    '/contact',
    '/gallery',
    '/rankers',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Optional: In the future, you can fetch dynamic blog posts from your backend here
  // const posts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`).then(res => res.json())
  // const blogRoutes = posts.map(post => ({ url: `${baseUrl}/blog/${post.slug}`, ... }))

  return [...routes]
}