
export type LayerOption = { id: string; label: string };

export type MapLabels = {
  layerLabel: string;
  dateLabel: string;
  load: string;
  mapPlaceholder: string;
  videoResultAllLayers: string;
  videoResultSideBySide: string;
};

export type MapProps = {
  labels: MapLabels;
  /** Optional initial values */
  initialLayerId?: string;
  initialDate?: string; // YYYY-MM-DD
  /** Called when the user clicks Load */
  onLoad?: (params: { layerId: string; date: string }) => void;
};