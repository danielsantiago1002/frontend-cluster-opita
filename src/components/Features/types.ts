type FeatureItem = {
  youtubeId: string; title: string; body: string 
};

export type FeaturesProps = {
  title: string;
  subtitle?: string;
  items: FeatureItem[];
};
