import type { MapLabels } from './components/NasaMap/types'

export const TEXT = {
  en: {
    brand: 'A.D.A (Astronomical Data Animator)',
    title:
      'Create Vegetation coverage, CO level and Snow coverage map animations in minutes',
    desc: 'Leverage some of the NASA Terra Satellite instruments data (ASTER, MODIS, MOPITT) to create animations of Vegetation coverage (NDVI), CO (carbon monoxide) level and Snow coverage. Define a date range and a point of interest in the map to start generating your animation.',
    navFeatures: 'Features',
    featuresTitle: 'Use Cases',
    featuresSubtitle:
      'Examples of A.D.A use cases to explore NASA TERRA layers.',
    features: [
      {
        title: 'Patagonia',
        body: 'Visualize changes in snow and vegetation coverage in Patagonia.',
        youtubeId: 'AHKI1pDvdHs',
      },
      {
        title: 'Africa',
        body: 'Check Carbon Monoxide levels time variations.',
        youtubeId: 'z00u-xKR3XI',
      },
      {
        title: 'Simple UI',
        body: 'Clean light theme without complexity.',
        youtubeId: 'AHKI1pDvdHs',
      },
    ],
    mapLabels: {
      layerLabel: 'Layer',
      dateLabel: 'Date Range (Years)',
      load: 'Create Animation',
      mapPlaceholder: 'NASA GIBS map preview here',
      videoResultAllLayers: 'Video result with all layers (CO, NDVI, Snow)',
      videoResultSideBySide: 'Snow vs NDVI (split view)',
      videoDownloadLink: 'Download Video (MP4)',
    } satisfies MapLabels,
    terra: {
      heading: 'Meet Terra: NASA’s flagship Earth-observing satellite',
      body1:
        'Launched in 1999, Terra is part of NASA’s Earth Observing System. For more than twenty-five years it has provided global, consistent observations that help scientists understand clouds, aerosols, land change, sea ice, fires, and energy balance.',
      body2:
        'Terra flies in a near-polar, sun-synchronous orbit and carries a suite of complementary instruments that observe the Earth system in tandem, enabling long-term climate data records and daily monitoring.',
      instrumentsTitle: 'Onboard instruments',
      instruments: [
        'MODIS — Moderate Resolution Imaging Spectroradiometer',
        'CERES — Clouds & the Earth’s Radiant Energy System',
        'MISR — Multi-angle Imaging SpectroRadiometer',
        'ASTER — Advanced Spaceborne Thermal Emission & Reflection Radiometer',
        'MOPITT — Measurements of Pollution in the Troposphere',
      ],
    },
  },
  es: {
    brand: 'A.D.A (Animador de Datos Astronómicos)',
    title:
      'Crea animaciones de cobertura vegetal, Niveles de CO y cobertura de nieve en minutos',
    desc: 'Utiliza los datos de algunos instrumentos del satélite Terra de la NASA (ASTER, MODIS, MOPITT) para crear animaciones de la cobertura vegetal (NDVI), el nivel de CO (monóxido de carbono) y la cobertura de nieve. Define un rango de fechas y un punto de interés en el mapa para empezar a generar su animación.',
    navFeatures: 'Características',
    featuresTitle: 'Casos de Uso',
    featuresSubtitle:
      'Ejemplos de casos de uso de A.D.A para explorar capas de NASA TERRA.',
    features: [
      {
        title: 'Patagonia',
        body: 'Visualización de cambios en la cobertura de nieve y de vegetación en la Patagonia.',
        youtubeId: 'AHKI1pDvdHs',
      },
      { title: 'Africa', body: 'Cambia fechas para ver variaciones.', youtubeId: 'z00u-xKR3XI' },
      { title: 'UI simple', body: 'Tema claro sin complejidad extra.', youtubeId: 'AHKI1pDvdHs' },
    ],
    mapLabels: {
      layerLabel: 'Capa',
      dateLabel: 'Fecha (Rango de años)',
      load: 'Crear animación',
      mapPlaceholder: 'Vista previa del mapa GIBS aquí',
      videoResultAllLayers: 'Video con todas las capas (CO, NDVI, Nieve)',
      videoResultSideBySide: 'Nieve vs NDVI (vista dividida)',
      videoDownloadLink: 'Descargar Video (MP4)',
    } satisfies MapLabels,
    terra: {
      heading:
        'Conoce a Terra: el satélite insignia de observación de la Tierra',
      body1:
        'Lanzado en 1999, Terra hace parte del Earth Observing System de la NASA. Durante más de veinticinco años ha entregado observaciones globales y consistentes que ayudan a entender nubes, aerosoles, cambios en tierra, hielo marino, incendios y el balance de energía.',
      body2:
        'Terra vuela en una órbita casi polar y sincrónica con el Sol, y transporta un conjunto de instrumentos complementarios que observan el sistema terrestre en conjunto, permitiendo series climáticas de largo plazo y monitoreo diario.',
      instrumentsTitle: 'Instrumentos a bordo',
      instruments: [
        'MODIS — Espectrorradiómetro de Imágenes de Resolución Moderada',
        'CERES — Nubes y Sistema de Energía Radiante de la Tierra',
        'MISR — Espectrorradiómetro de Imágenes Multiángulo',
        'ASTER — Radiómetro Avanzado de Emisión Térmica y Reflexión',
        'MOPITT — Mediciones de Contaminación en la Tropósfera',
      ],
    },
  },
}

export const LAYERS_DATES = [
  [2001, 2003],
  [2004, 2006],
  [2007, 2009],
  [2010, 2012],
  [2013, 2015],
  [2016, 2018],
  [2019, 2021],
  [2022, 2024]
]

export const BASE_LAYERS = [
  {
    id: 'ASTER_GDEM_Greyscale_Shaded_Relief',
    label: 'ASTER GDEM Greyscale Shaded Relief',
  },
  {
    id: 'Coastlines_15m',
    label: 'Coastlines (15m)',
  },
]

export const INDIVIDUAL_LAYERS = [
  {
    id: 'MOPITT_CO_Monthly_Surface_Mixing_Ratio_Day',
    label: 'CO Levels (MOPITT)',
  },
  {
    id: 'MODIS_Terra_L3_NDVI_Monthly',
    label: 'Vegetation Coverage (MODIS)',
  },
  {
    id: 'MODIS_Terra_NDSI_Snow_Cover',
    label: 'Snow Coverage (MODIS)',
  },
]
