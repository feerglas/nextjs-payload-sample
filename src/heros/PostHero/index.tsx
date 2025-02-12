import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post, Author } from '@/payload-types'

import { Media } from '@/components/Media'
import Avatar from '@/components/Avatar'
import DateComponent from '@/components/Date'

export const PostHero: React.FC<{
  post: Post,
  lang: string
}> = ({ post, lang }) => {
  const { categories, heroImage, authors, publishedAt, title } = post
  const hasAuthors = authors && authors.length > 0;
  const typedAuthors = authors as Author[];

  return (
    <div className="">
      <h1 className="text-balance mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl">
        {title}
      </h1>


      {hasAuthors && typedAuthors.map((author, index) => (
        <div className="hidden md:mb-12 md:block" key={index}>
          {author.image && typeof author.image !== 'string' && (
            <Avatar name={author.name} picture={author.image || null} />
          )}
        </div>
      ))}


     

      <div className="mb-8 sm:mx-0 md:mb-16">
        {heroImage && typeof heroImage !== 'string' && (
          <Media priority imgClassName="h-auto w-full" resource={heroImage} />
        )}
      </div>

      <div className="mx-auto max-w-2xl">
          <div className="mb-6 block md:hidden">
            {hasAuthors && typedAuthors.map((author, index) => {
              if (author.image && typeof author.image !== 'string') {
                return (
                  <Avatar key={index} name={author.name} picture={author.image || null} />
                )
              }
            })}
          </div>
          <div className="mb-6 text-lg">
            <div className="mb-4 text-lg">
              {publishedAt &&
                <DateComponent dateString={publishedAt?.toString()} locale={lang} />
              }
            </div>
          </div>
        </div>

       {/* <div className="uppercase text-sm mb-6">
        {categories?.map((category, index) => {
          if (typeof category === 'object' && category !== null) {
            const { title: categoryTitle } = category

            const titleToUse = categoryTitle || 'Untitled category'

            const isLast = index === categories.length - 1

            return (
              <React.Fragment key={index}>
                {titleToUse}
                {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
              </React.Fragment>
            )
          }
          return null
        })}
      </div> */}

    </div>
  )
}
