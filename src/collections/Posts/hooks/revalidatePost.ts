import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req,
}) => {
  if (!req.context.disableRevalidate) {
    const url = new URLSearchParams(req.url);
    const lang = url.get('locale') || 'de';

    if (doc._status === 'published') {
      const path = `/${lang}/posts/${doc.slug}`

      req.payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidateTag('posts-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `${lang}/posts/${previousDoc.slug}`

      req.payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('posts-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req }) => {
  if (!req.context.disableRevalidate) {
    const url = new URLSearchParams(req.url);
    const lang = url.get('locale') || 'de';

    const path = `${lang}/posts/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('posts-sitemap')
  }

  return doc
}
