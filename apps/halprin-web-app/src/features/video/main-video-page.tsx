import { MainLayout } from '@/components/layout/main-layout';
import { useTranslation } from 'next-i18next';
import { videoConfig } from './video.config';
import * as S from './main-video-page.style';
import { VideoPlayer } from '@/features/video/components/video-player';
import { pageData } from '../../data/page.data';
import React from 'react';
import { VideoNavbar } from './components/video-navbar';
import { VideoFooter } from './components/video-footer';

type Props = {
  children?: never;
  pageId?: string;
};

const getVideoUrlFromPageId = (pageId: string): string => {
  const currPage =
    pageData.filter((page) => page.page_id === pageId)?.[0] ?? null;
  if (currPage === null) {
    throw new Error('Page does not exists');
  }
  return currPage.content.video.url;
};

export const MainVideoPage: React.FC<Props> = (props) => {
  const { pageId = 'test' } = props;
  const { t } = useTranslation(videoConfig.i18nNamespaces);

  return (
    <>
      <MainLayout>
        <S.Ctn>
          <VideoNavbar categories={['corps', 'esprit', 'mouvement']} />
          <VideoPlayer url={getVideoUrlFromPageId(pageId)} />
          <VideoFooter />
        </S.Ctn>
      </MainLayout>
    </>
  );
};
