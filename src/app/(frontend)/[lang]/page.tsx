import type { Metadata } from 'next/types'
import { Media } from '@/components/Media'
import DateComponent from '@/components/Date'
import Avatar from '@/components/Avatar'
import MoreStories from '@/components/MoreStories'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import Link from "next/link";
import { Post, Author, Config, Pageglobal } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'

export const dynamic = 'force-static'
export const revalidate = 600

function Intro(props: { title: string | null | undefined; description?: string | null | undefined }) {
  return (
    <section className="mt-16 mb-16 flex flex-col items-center lg:mb-12 lg:flex-row lg:justify-between">
      <h1 className="text-balance text-6xl font-bold leading-tight tracking-tighter lg:pr-8 lg:text-8xl">
        {props.title}
      </h1>
      <h2 className="text-pretty mt-5 text-center text-lg lg:pl-8 lg:text-left">
        <p className="prose-lg">
          {props.description}
        </p>
      </h2>
    </section>
  );
}

function HeroPost(params: Pick<
Exclude<Post, null>,
"title" | "slug" | "summary"  | "heroImage" | "heroImage" | "publishedAt" | "authors"
> & {lang: string}) {
  const hasAuthors = params.authors && params.authors.length > 0;
  const typedAuthors = params.authors as Author[];

  return (
    <article>
      <Link className="group mb-8 block md:mb-16" href={`${params.lang}/posts/${params.slug}`}>
        {params.heroImage &&
          <Media resource={params.heroImage} priority />
        }
      </Link>
      <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
        <div>
          <h3 className="text-pretty mb-4 text-4xl leading-tight lg:text-6xl">
            <Link href={`${params.lang}/posts/${params.slug}`} className="hover:underline">
              {params.title}
            </Link>
          </h3>
          <div className="mb-4 text-lg md:mb-0">
            <DateComponent dateString={params.publishedAt || ''} locale={params.lang} />
          </div>
        </div>
        <div>
          {params.summary && (
            <p className="text-pretty mb-4 text-lg leading-relaxed">
              {params.summary}
            </p>
          )}

          {hasAuthors && typedAuthors.map((author, index) => (
            <div key={index}>
              {author.image && typeof author.image !== 'string' && (
                <Avatar name={author.name} picture={author.image} />
              )}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default async function Page({ params }: {
  params: Promise<{ lang: string }>
}) {
  const payload = await getPayload({ config: configPromise })
  const lang = (await params).lang as Config['locale'];

  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 12,
    overrideAccess: false,
    locale: lang,
  })

  const globalsData: Pageglobal = await getCachedGlobal('pageglobal', 1, lang)()

  const heroPost = posts.docs[0];

  return (
    <div className="container mx-auto px-5">
      <PageClient />
      <Intro title={globalsData.postsTitle} description={globalsData.postsSubtitle} />
      <HeroPost
        title={heroPost?.title || ''}
        slug={heroPost?.slug}
        heroImage={heroPost?.heroImage}
        summary={heroPost?.summary || ''}
        publishedAt={heroPost?.publishedAt}
        authors={heroPost?.authors}
        lang={lang}
      />

      <aside>
        <h2 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
          {globalsData.moreStoriesTitle}
        </h2>
        <MoreStories skip={heroPost?.id || ''} limit={100} lang={lang} />
      </aside>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `SAGW - News`,
  }
}
