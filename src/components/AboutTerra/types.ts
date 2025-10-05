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
  /** Path/URL to .glb (recommended) */
  src?: string;
  /** CSS height (e.g. 460 or "480px") */
  height?: number | string;
  /** Background CSS color or "transparent" */
  background?: string;
  /** Enable wheel/pinch zoom */
  allowZoom?: boolean;
  /** Start with autorotation on */
  autoRotate?: boolean;
};

