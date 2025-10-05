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
    brand: 'A.D.A (Astronomical Data Animator)',
    title: 'Create Vegetal Cover, CO level and Snow cover map animations in minutes',
    desc: 'Leverage some of the NASA Terra Satellite instruments data (ASTER, MODIS, MOPITT) to create animations of Vegetal Cover, CO level and Snow cover. Define a date range and a point of interest in the world to start generating your animation.',
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
    brand: 'A.D.A (Animador de Datos Astronómicos)',
    title: 'Crea animaciones de cobertura vegetal, Niveles de CO y cobertura de nieve en minutos',
    desc: 'Utiliza los datos de algunos instrumentos del satélite Terra de la NASA (ASTER, MODIS, MOPITT) para crear animaciones de la cobertura vegetal, el nivel de CO y la cobertura de nieve. Defina un rango de fechas y un punto de interés en el mundo para empezar a generar su animación.',
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
