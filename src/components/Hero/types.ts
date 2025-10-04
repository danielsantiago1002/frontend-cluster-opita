import type { LayerOption, MapLabels } from "../NasaMap/types";

export type HeroProps = {
  badge: string;
  title: string;
  desc: string;
  primary: string;
  secondary: string;
  mapLabels: MapLabels;
  layers: LayerOption[];
  onLoad: (params: { layerId: string; date: string }) => void;
};