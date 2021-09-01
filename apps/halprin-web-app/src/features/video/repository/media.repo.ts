import { Credit, Media, MediaCategorySlug } from '@/data/data.types';
import { mediaData } from '@/data/media.data';
import { creditsData } from '@/data/credits.data';

type Props = {
  mediaData?: Media[];
  creditsData?: Credit[];
};

type SearchParams = {
  tagSlugs?: string[] | string;
  categories?: MediaCategorySlug[] | MediaCategorySlug;
};

type MediaWithCredits = Media & {
  credits: Credit[];
};

export class MediaRepo {
  private media: Media[];
  private credits: Credit[];
  constructor(props?: Props) {
    this.media = props?.mediaData ?? mediaData;
    this.credits = props?.creditsData ?? creditsData;
  }
  findByCategory = (category: MediaCategorySlug): Media[] => {
    return this.media.filter((media) => media.category === category);
  };
  findBySlug = (slug: string): Media | null => {
    return this.media.filter((media) => media.media_slug === slug)?.[0] ?? null;
  };
  search = (
    params: SearchParams,
    sortByRelevance = true
  ): MediaWithCredits[] => {
    const { tagSlugs, categories: searchCategs } = params;
    const slugs = typeof tagSlugs === 'string' ? [tagSlugs] : tagSlugs;
    const categories =
      typeof searchCategs === 'string' ? [searchCategs] : searchCategs;

    const data: Media[] =
      categories !== undefined
        ? this.media.filter((media) => categories.includes(media.category))
        : this.media;

    let filtered: Media[] = [];

    if (slugs === undefined) {
      filtered = data;
    } else {
      const relevanceMap = new Map<string, number>();
      filtered = data.filter((media) => {
        const count = media.tags.length;
        let i = 0;
        let found = false;
        while (i < count && !found) {
          const tag = media.tags[i];
          for (let k = 0; k < slugs.length; k++) {
            if (tag.tag_slug === slugs[k]) {
              found = true;
              relevanceMap.set(
                media.media_slug,
                tag.relevance + (relevanceMap.get(media.media_slug) ?? 0)
              );
            }
          }
          i++;
        }
        return found;
      });
      if (sortByRelevance) {
        filtered = filtered.sort((a, b) => {
          const relevanceA = relevanceMap.get(a.media_slug) ?? 0;
          const relevanceB = relevanceMap.get(b.media_slug) ?? 0;
          return relevanceB - relevanceA;
        });
      }
    }
    const result = filtered.map((media) => {
      const credits: Credit[] = [];
      (media.creditsIds ?? []).forEach((creditId) => {
        const credit = this.credits.filter((cred) => cred.id === creditId)?.[0];
        if (credit) {
          credits.push(credit);
        }
      });
      return {
        ...media,
        credits: credits,
      };
    });
    return result;
  };
}
