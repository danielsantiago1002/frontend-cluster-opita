export type HeroProps = {
  badge: string;
  title: string;
  desc: string;
  primary: string;
  secondary: string;
  onLoad: (params: { layerId: string; date: string }) => void;
};