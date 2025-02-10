import type { GlobalConfig } from 'payload'

export const PageGlobal: GlobalConfig = {
  slug: 'pageglobal',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'postsTitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'postsSubtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'moreStoriesTitle',
      type: 'text',
      localized: true,
    },
  ]
}
