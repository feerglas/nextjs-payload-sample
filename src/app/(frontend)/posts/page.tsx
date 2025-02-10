import type { Metadata } from 'next/types'
import { Media } from '@/components/Media'
import DateComponent from '@/components/Date'
import Avatar from '@/components/Avatar'
import MoreStories from '@/components/MoreStories'

// import { CollectionArchive } from '@/components/CollectionArchive'
// import { PageRange } from '@/components/PageRange'
// import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import Link from "next/link";
import { Post, Author } from '@/payload-types'

// export const dynamic = 'force-static'
// export const revalidate = 600






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

function HeroPost({
  title,
  slug,
  summary,
  heroImage,
  publishedAt,
  authors,
}: Pick<
Exclude<Post, null>,
"title" | "slug" | "summary"  | "heroImage" | "heroImage" | "publishedAt" | "authors"
>) {
  const hasAuthors = authors && authors.length > 0;
  const typedAuthors = authors as Author[];

  
  

  return (
    <article>
      <Link className="group mb-8 block md:mb-16" href={`/posts/${slug}`}>
        {heroImage &&
          <Media resource={heroImage} priority />
        }
      </Link>
      <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
        <div>
          <h3 className="text-pretty mb-4 text-4xl leading-tight lg:text-6xl">
            <Link href={`/posts/${slug}`} className="hover:underline">
              {title}
            </Link>
          </h3>
          <div className="mb-4 text-lg md:mb-0">
            <DateComponent dateString={publishedAt || ''} />
          </div>
        </div>
        <div>
          {summary && (
            <p className="text-pretty mb-4 text-lg leading-relaxed">
              {summary}
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








export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 12,
    overrideAccess: false,
    locale: 'en',
    // select: {
    //   title: true,
    //   slug: true,
    //   categories: true,
    //   meta: true,
    // },
  })

  const heroPost = posts.docs[0];
  

  return (

    <div className="container mx-auto px-5">
      <PageClient />
      <Intro title='SAGW News' description='Alle News der SAGW' />
      <HeroPost
        title={heroPost?.title || ''}
        slug={heroPost?.slug}
        heroImage={heroPost?.heroImage}
        summary={heroPost?.summary || ''}
        publishedAt={heroPost?.publishedAt}
        authors={heroPost?.authors}
      />


      <aside>
        <h2 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
          More Stories
        </h2>
        <MoreStories skip={heroPost?.id || ''} limit={100} />

      </aside>
    </div>
    
    // <div className="pt-24 pb-24">
    //   <PageClient />
    //   <div className="container mb-16">
    //     <div className="prose dark:prose-invert max-w-none">
    //       <h1>SAGW News</h1>
    //     </div>
    //   </div>

    //   <div className="container mb-8">
    //     <PageRange
    //       collection="posts"
    //       currentPage={posts.page}
    //       limit={12}
    //       totalDocs={posts.totalDocs}
    //     />
    //   </div>

    //   {/* <CollectionArchive posts={posts.docs} /> */}


    //   <div className="container">
    //     {posts.totalPages > 1 && posts.page && (
    //       <Pagination page={posts.page} totalPages={posts.totalPages} />
    //     )}
    //   </div>
    // </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Posts`,
  }
}
