import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BadRequest } from '@tsed/exceptions';
import { videoConfig } from '@/features/video/video.config';
import { SupportedLang } from '@/features/video/types';
import { SiteConfigUtils } from '@/core/config/site- config.utils';
import { Asserts } from '@contredanse/common';

type Props = {
  tagSlugs: string[];
  lang: SupportedLang;
};

export default function VideoTagsRoute(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { lang, tagSlugs } = props;
  return (
    <>
      <h1>Hello here's the tag slugs I received</h1>
      <pre>{JSON.stringify(tagSlugs)}</pre>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { locale } = context;
  if (locale === undefined || !SiteConfigUtils.isSupportedLocale(locale)) {
    throw new BadRequest('locale is missing or not supported');
  }
  const { tags } = context.params ?? {};

  Asserts.nonEmptyString(tags, () => {
    throw new BadRequest('tags must be a non empty string');
  });

  const tagSlugs = tags.split(':').filter((tag) => tag.trim() !== '');

  const { i18nNamespaces } = videoConfig;
  return {
    props: {
      tagSlugs: tagSlugs,
      lang: locale,
      // @see https:/github.com/i18next/react-i18next/pull/1340#issuecomment-874728587
      ...(await serverSideTranslations(locale, i18nNamespaces.slice())),
    },
  };
};
