// app/composables/useSanityImageUrl.ts
import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityDocument } from '@sanity/client'

export const useSanityImageUrl = () => {
  const sanity = useSanity()
  const { projectId, dataset } = sanity.client.config()

  /**
   * Génère une URL pour une image Sanity avec les transformations optionnelles
   * @param source - La source de l'image Sanity
   * @param options - Options de transformation (width, height, format, etc.)
   * @returns L'URL de l'image ou null si les configurations manquent
   */
  const urlFor = (
    source: SanityDocument | null | undefined,
    options?: {
      width?: number;
      height?: number;
      format?: 'jpg' | 'png' | 'webp';
      quality?: number;
    }
  ) => {
    if (!projectId || !dataset || !source) {
      return null
    }

    let builder = createImageUrlBuilder({ projectId, dataset }).image(source)

    if (options?.width) builder = builder.width(options.width)
    if (options?.height) builder = builder.height(options.height)
    if (options?.format) builder = builder.format(options.format)
    if (options?.quality) builder = builder.quality(options.quality)

    return builder.url()
  }

  return {
    urlFor,
    projectId,
    dataset
  }
}
