import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from "next/link";

import Avatar from "../Avatar";
import { Media } from '@/components/Media'
import DateComponent from "../Date";
import type { Author } from '@/payload-types'

export default async function MoreStories(params: {
  skip: string;
  limit: number;
}) {

  const payload = await getPayload({ config: configPromise })
  
  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 12,
    locale: 'en',
    overrideAccess: false,
    // select: {
    //   title: true,
    //   slug: true,
    //   categories: true,
    //   meta: true,
    // },
  })

  return (
    <>
      <div className="mb-32 grid grid-cols-1 gap-y-20 md:grid-cols-2 md:gap-x-16 md:gap-y-32 lg:gap-x-32">
        {posts?.docs.map((post) => {
          const { id, publishedAt, title, slug, heroImage, summary, authors } = post;

          const hasAuthors = authors && authors.length > 0;
          const typedAuthors = authors as Author[];

          return (
            <article key={id}>
              <Link href={`/posts/${slug}`} className="group mb-5 block">
                {heroImage &&
                  <Media resource={heroImage} priority={false} />
                }
              </Link>
              <h3 className="text-balance mb-3 text-3xl leading-snug">
                <Link href={`/posts/${slug}`} className="hover:underline">
                  {title}
                </Link>
              </h3>
              <div className="mb-4 text-lg">
                {publishedAt &&
                  <DateComponent dateString={publishedAt} />
                }
              </div>
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
            </article>
          );
        })}
      </div>
    </>
  );
}
