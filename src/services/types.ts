export interface ApiResponse {
  images: string[];
}

export interface VideoCreatorProps {
  images: string[];
}

export interface ImageListFetcherProps {
  onImagesLoaded: (images: string[]) => void;
}