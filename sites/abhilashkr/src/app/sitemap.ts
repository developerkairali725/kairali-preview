import type { MetadataRoute } from 'next'

import { getAllEssays } from '@/lib/mdx'

import { SITE_URL } from '@/lib/config'
import { PAGE_KEYS, ROUTES, type PageKey } from '@/lib/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL
  const now = new Date().toISOString()

  const priorities: Record<PageKey, number> = {
    home: 1,
    about: 0.9,
    work: 0.8,
    investing: 0.7,
    writing: 0.8,
    media: 0.6,
    recognition: 0.7,
    speaking: 0.6,
    contact: 0.5,
    faq: 0.4,
    now: 0.5,
    privacy: 0.2,
  }

  const frequencies: Record<PageKey, 'weekly' | 'monthly' | 'yearly'> = {
    home: 'monthly',
    about: 'monthly',
    work: 'monthly',
    investing: 'monthly',
    writing: 'weekly',
    media: 'monthly',
    recognition: 'monthly',
    speaking: 'monthly',
    contact: 'yearly',
    faq: 'yearly',
    now: 'weekly',
    privacy: 'yearly',
  }

  const routes: MetadataRoute.Sitemap = PAGE_KEYS.flatMap((key) => {
    const alternates = {
      languages: {
        en: `${baseUrl}${ROUTES.en[key]}`,
        de: `${baseUrl}${ROUTES.de[key]}`,
        fr: `${baseUrl}${ROUTES.fr[key]}`,
        'x-default': `${baseUrl}${ROUTES.en[key]}`,
      },
    }

    return (['en', 'de', 'fr'] as const).map((locale) => ({
      url: `${baseUrl}${ROUTES[locale][key]}`,
      lastModified: now,
      changeFrequency: frequencies[key],
      priority: locale === 'en' ? priorities[key] : Math.max(priorities[key] - 0.1, 0.1),
      alternates,
    }))
  })

  const essays = getAllEssays()
  const essayRoutes = essays.map((essay) => ({
    url: `${baseUrl}/writing/${essay.slug}`,
    lastModified: essay.dateModified || essay.datePublished || now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...routes, ...essayRoutes]
}
