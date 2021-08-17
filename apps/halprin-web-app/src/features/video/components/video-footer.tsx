import * as S from './video-footer.style';
import { VideoCarrousel } from './video-carrousel';
import { Media } from '@/data/data.types';
import { SupportedLang } from '@/features/video/types';

type Props = {
  media: Media[];
  lang: SupportedLang;
  videosIndex: number;
};

export const VideoFooter: React.FC<Props> = (props) => {
  const { media, lang, videosIndex } = props;

  return (
    <S.Ctn>
      <div className="topBar">
        <div className="left">LISTNAME: {media[0].category}</div>
        <div className="center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-chevrons-left center-icon"
            width="27"
            height="27"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <polyline points="11 7 6 12 11 17"></polyline>
            <polyline points="17 7 12 12 17 17"></polyline>
          </svg>
          1 / {media.length}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-chevrons-right center-icon"
            width="27"
            height="27"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <polyline points="7 7 12 12 7 17"></polyline>
            <polyline points="13 7 18 12 13 17"></polyline>
          </svg>
        </div>
        <div className="right">
          <button className="listBtn">ALL</button>
          <button className="listBtn">LIST</button>
          <button className="listBtn">HISTORY</button>
          <button className="listBtn">UNSEEN</button>
        </div>
      </div>
      <VideoCarrousel lang={lang} media={media} />
    </S.Ctn>
  );
};
