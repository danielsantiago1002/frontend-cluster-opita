// Shared types for Terra components

export type TerraCopy = {
  heading: string;
  body1: string;
  body2: string;
  instrumentsTitle: string;
  instruments: string[]; // 5 items expected
};

export type TerraSectionProps = {
  copy: TerraCopy;
};

export type TerraModelViewerProps = {
  src?: string;
  height?: number | string;
  background?: string;
  allowZoom?: boolean;
  autoRotate?: boolean;
};


