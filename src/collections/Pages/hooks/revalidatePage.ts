import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req,
}) => {

  if (!req.context.disableRevalidate) {
    const url = new URLSearchParams(req.url);
    const lang = url.get('locale') || 'de';

    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? `/${lang}` : `/${lang}/${doc.slug}`

      req.payload.logger.info(`Revalidating page at path: ${path}`)

      revalidatePath(path)
      revalidateTag('pages-sitemap')
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? `/${lang}` : `/${lang}/${previousDoc.slug}`

      req.payload.logger.info(`Revalidating old page at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('pages-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req }) => {
  if (!req.context.disableRevalidate) {
    const url = new URLSearchParams(req.url);
    const lang = url.get('locale') || 'de';

    const path = doc?.slug === 'home' ? `/${lang}` : `/${lang}/${doc?.slug}`
    revalidatePath(path)
    revalidateTag('pages-sitemap')
  }

  return doc
}
