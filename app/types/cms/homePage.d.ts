import type { SanityDocument } from '@sanity/client'
import type { SanityImageSource } from '@sanity/image-url'

export type SanityHomePage = SanityDocument & {
  title: string;
  subtitle?: string;
  seoTitle: string;
  description: string;
  heroBanner?: SanityImageSource;
}
