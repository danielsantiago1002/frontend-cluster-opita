export type FooterProps = {
  brand: string;
  year?: number;
  lang: "en" | "es";
  onToggleLang: () => void;
};
