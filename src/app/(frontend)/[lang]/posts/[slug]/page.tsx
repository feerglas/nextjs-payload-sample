import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post, Config, Pageglobal } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Link } from 'next-view-transitions'
import { getCachedGlobal } from '@/utilities/getGlobals'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const locales = [
    'de',
    'en',
    'fr',
    'it',
  ];

  const params: any = [];

  posts.docs.forEach(({ slug }) => {
    locales.forEach((lang) => {
      params.push({
        slug,
        lang,
      })
    })
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
    lang: Config['locale']
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '', lang } = await paramsPromise
  const url = '/posts/' + slug
  const post = await queryPostBySlug({ slug, lang })
  const globalsData: Pageglobal = await getCachedGlobal('pageglobal', 1, lang)()

  if (!post) return <PayloadRedirects url={url} />

  return (
    <div>
      <div className="container mx-auto px-5 mb-20">
        <PageClient />

        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound url={url} />

        {draft && <LivePreviewListener />}

        <h2 className="mb-16 mt-10 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
          <Link href={`/${lang}`} className="hover:underline flex items-center">

            <svg className='h-full mr-4' width="32px" height="32px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"/><path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"/></svg>


            {globalsData.postsTitle}
          </Link>
        </h2>

        <PostHero post={post} lang={lang} />

        <div className="container mx-auto px-5">
        <RichText className="mx-auto max-w-2xl" data={post.content} enableGutter={false} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '', lang } = await paramsPromise
  const post = await queryPostBySlug({ slug, lang })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug, lang }: { slug: string, lang: Config['locale'] }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    locale: lang,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
