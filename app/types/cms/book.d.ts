import type { SanityDocument } from '@sanity/client'
import type { SanityImageSource } from '@sanity/image-url'

export type SanityBook = SanityDocument & {
  title: string;
  slug: { current: string };
  publishedAt: string;
  author: SanityAuthor;
  cover: SanityImageSource;
  categories: SanityCategory[];
}

type SanityCategory = SanityDocument & {
  label: string;
  slug: string;
}
