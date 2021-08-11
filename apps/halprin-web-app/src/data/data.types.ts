export type Tag = {
  id: number;
  tag_slug: string;
  label: { fr: string; en: string };
};

export type LocalizedMediaUrl = {
  fr: string;
  en: string;
};

export type MediaUrl = string | LocalizedMediaUrl;

export type Media = {
  media_slug: string;
  media_type: 'audio' | 'video';
  media_url: MediaUrl;
  thumb: string;
  type: string;
  moment?: string;
  tags: { tag_slug: string; relevance: number }[];
  title: {
    fr: string;
    en: string;
  };
};
