import type { LayerOption, MapLabels } from './components/NasaMap/types'

export const LAYERS: LayerOption[] = [
  {
    id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    label: 'MODIS Terra TrueColor',
  },
  {
    id: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    label: 'VIIRS SNPP TrueColor',
  },
  { id: 'MODIS_Terra_Land_Surface_Temp_Day', label: 'MODIS Terra LST Day' },
]

export const TEXT = {
  en: {
    brand: 'Orbital Maps',
    badge: 'NASA • Simple starter',
    title: 'Analyze NASA maps in minutes',
    desc: 'Minimal React + Tailwind starter for exploring NASA Earth data (GIBS). Choose a layer, set a date, and preview tiles.',
    primary: 'Preview a layer',
    secondary: 'See features',
    navFeatures: 'Features',
    featuresTitle: 'Features',
    featuresSubtitle: 'Essentials for exploring NASA layers.',
    features: [
      {
        title: 'GIBS Layers',
        body: 'Load MODIS, VIIRS, Blue Marble, and more.',
      },
      {
        title: 'Time Controls',
        body: 'Switch dates to spot changes over time.',
      },
      { title: 'Simple UI', body: 'Clean light theme without complexity.' },
    ],
    mapLabels: {
      layerLabel: 'Layer',
      dateLabel: 'Date',
      load: 'Load',
      mapPlaceholder: 'NASA GIBS map preview here',
    } satisfies MapLabels,
  },
  es: {
    brand: 'Mapas Orbitales',
    badge: 'NASA • Starter simple',
    title: 'Analiza mapas de la NASA en minutos',
    desc: 'Starter mínimo con React + Tailwind para explorar datos de la Tierra (GIBS). Elige una capa, define fecha y previsualiza mosaicos.',
    primary: 'Previsualizar capa',
    secondary: 'Ver características',
    navFeatures: 'Características',
    featuresTitle: 'Características',
    featuresSubtitle: 'Esenciales para explorar capas de la NASA.',
    features: [
      { title: 'Capas GIBS', body: 'Carga MODIS, VIIRS, Blue Marble y más.' },
      { title: 'Tiempo', body: 'Cambia fechas para ver variaciones.' },
      { title: 'UI simple', body: 'Tema claro sin complejidad extra.' },
    ],
    mapLabels: {
      layerLabel: 'Capa',
      dateLabel: 'Fecha',
      load: 'Cargar',
      mapPlaceholder: 'Vista previa del mapa GIBS aquí',
    } satisfies MapLabels,
  },
}
