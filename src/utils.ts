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
    terra: {
      heading: "Meet Terra: NASA’s flagship Earth-observing satellite",
      body1:
        "Launched in 1999, Terra is part of NASA’s Earth Observing System. For more than twenty-five years it has provided global, consistent observations that help scientists understand clouds, aerosols, land change, sea ice, fires, and energy balance.",
      body2:
        "Terra flies in a near-polar, sun-synchronous orbit and carries a suite of complementary instruments that observe the Earth system in tandem, enabling long-term climate data records and daily monitoring.",
      instrumentsTitle: "Onboard instruments",
      instruments: [
        "MODIS — Moderate Resolution Imaging Spectroradiometer",
        "CERES — Clouds & the Earth’s Radiant Energy System",
        "MISR — Multi-angle Imaging SpectroRadiometer",
        "ASTER — Advanced Spaceborne Thermal Emission & Reflection Radiometer",
        "MOPITT — Measurements of Pollution in the Troposphere",
      ],
    },
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
    terra: {
      heading: "Conoce a Terra: el satélite insignia de observación de la Tierra",
      body1:
        "Lanzado en 1999, Terra hace parte del Earth Observing System de la NASA. Durante más de veinticinco años ha entregado observaciones globales y consistentes que ayudan a entender nubes, aerosoles, cambios en tierra, hielo marino, incendios y el balance de energía.",
      body2:
        "Terra vuela en una órbita casi polar y sincrónica con el Sol, y transporta un conjunto de instrumentos complementarios que observan el sistema terrestre en conjunto, permitiendo series climáticas de largo plazo y monitoreo diario.",
      instrumentsTitle: "Instrumentos a bordo",
      instruments: [
        "MODIS — Espectrorradiómetro de Imágenes de Resolución Moderada",
        "CERES — Nubes y Sistema de Energía Radiante de la Tierra",
        "MISR — Espectrorradiómetro de Imágenes Multiángulo",
        "ASTER — Radiómetro Avanzado de Emisión Térmica y Reflexión",
        "MOPITT — Mediciones de Contaminación en la Tropósfera",
      ],
    },
  },
}
