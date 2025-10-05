import React, { useState, useEffect } from 'react';

const ImageListFetcher: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        'https://terra-cluster-opita-api.onrender.com/api/gibs/projections?LAYERS=CERES_Terra_Surface_UV_Index_All_Sky_Monthly,MODIS_Terra_NDSI_Snow_Cover,Reference_Features_15m,Coastlines_15m&FORMAT=image/png&START_DATE=2000-07-12&END_DATE=2001-01-30&BBOX=-20037508.34,-20037508.34,20037508.34,20037508.34&WIDTH=2560&HEIGHT=1440'
      );
      
      if (!response.ok) {
        throw new Error(`Error al obtener las imágenes: ${response.status}`);
      }
      
      const base64Images: string[] = await response.json();
      setImages(base64Images);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) return <div>Cargando imágenes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
      {images.map((frame, index) => (
        <img
          key={index}
          src={`data:image/png;base64,${frame}`}
          alt={`frame-${index}`}
          style={{ width: "80%", borderRadius: "10px", boxShadow: "0 0 10px #0003" }}
        />
      ))}
    </div>
  );
};

export default ImageListFetcher;