import { MediaRepo } from '@/features/video/repository/media.repo';
import { Credit, Media } from '@/data/data.types';

describe('VideoRepo tests', () => {
  describe('search', () => {
    const testData: Partial<Media>[] = [
      {
        media_slug: 'video-1',
        title: {
          fr: 'Vidéo 1',
          en: 'Video 1',
        },
        tags: [
          { tag_slug: 'one', relevance: 20 },
          { tag_slug: 'two', relevance: 10 },
        ],
        creditsIds: [1],
      },
      {
        media_slug: 'video-2',
        title: {
          fr: 'Vidéo 2',
          en: 'Video 2',
        },
        tags: [
          { tag_slug: 'three', relevance: 5 },
          { tag_slug: 'two', relevance: 40 },
        ],
      },
    ];
    const creditExample: Credit = {
      id: 1,
      index: true,
      year: 1979,
      htmlLabel: {
        fr: 'cool',
        en: 'cool',
      },
    };
    const repo = new MediaRepo({
      mediaData: testData as Media[],
      creditsData: [creditExample],
    });
    describe('when tags correspond to one video only', () => {
      it('should return only one video', () => {
        const result = repo.search({ tagSlugs: ['one', 'four'] }, false);
        expect(result.length).toStrictEqual(1);
        expect(result?.[0].media_slug).toStrictEqual('video-1');
      });
      it('should denormalize credits', () => {
        const result = repo.search({ tagSlugs: ['one'] }, false);
        expect(result.length).toStrictEqual(1);
        expect(result?.[0].media_slug).toStrictEqual('video-1');
        expect(result?.[0].credits?.[0]).toStrictEqual(creditExample);
      });
    });
    describe('when tags correspond to multiple videos and sortByRelevance = true', () => {
      it('should return all matching videos sorted', () => {
        const result = repo.search({ tagSlugs: ['one', 'two'] }, true);
        expect(result.length).toStrictEqual(2);
        expect(result?.[0].media_slug).toStrictEqual('video-2');
        expect(result?.[1].media_slug).toStrictEqual('video-1');
      });
    });

    describe('when tags correspond to multiple videos and sortByRelevance = false', () => {
      it('should return all matching videos sorted', () => {
        const result = repo.search({ tagSlugs: ['one', 'two'] }, false);
        expect(result.length).toStrictEqual(2);
        expect(result?.[0].media_slug).toStrictEqual('video-1');
        expect(result?.[1].media_slug).toStrictEqual('video-2');
      });
    });

    describe('when tag is given as string', () => {
      it('should return same matching as if it was an array', () => {
        expect(repo.search({ tagSlugs: 'one' }, false)).toStrictEqual(
          repo.search({ tagSlugs: ['one'] }, false)
        );
      });
    });
  });
});
