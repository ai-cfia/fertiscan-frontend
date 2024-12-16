import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'; // Importation des composants pour le zoom et le panoramique
import json from '@/app/TestImagePage/test.json'; // Importation d'un fichier JSON (simule le comportement si textData est vide)
import { set } from 'react-hook-form';

// Définition de l'interface TextData pour le typage TypeScript
interface TextData {
  content: string;
  polygon: number[];
  spans: { offset: number; length: number }[];
}

// Définition de l'interface pour les props de MyZoomPanComponent
interface MyZoomPanComponentProps {
  imageUrl: string;
  textData: TextData[] | null;
  scaleX: number;
  scaleY: number;
  offsetX: number;
  offsetY: number;
}

// Définition du composant fonctionnel principal
const MyZoomPanComponent: React.FC<MyZoomPanComponentProps> = ({ imageUrl, textData, scaleX, scaleY, offsetX, offsetY }) => {
  const [hoveredParagraphIndex, setHoveredParagraphIndex] = useState<number | null>(null); // État pour suivre l'index du paragraphe survolé

  // Affiche un message d'erreur si imageUrl n'est pas fourni
  if (!imageUrl) {
    return <div>Error: imageUrl is not provided or is invalid.</div>;
  }

  // Si textData n'est pas fourni ou est vide, utilise les données de test.json
  if (!textData || textData.length === 0) {
    textData = json.analyzeResult.paragraphs.map((paragraph) => ({
      content: paragraph.content,
      polygon: paragraph.boundingRegions[0].polygon,
      spans: paragraph.spans,
    }));
  }

  return (
    <TransformWrapper>
      {({ resetTransform }) => (
        <TransformComponent>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              id="uploaded-image"
              src={imageUrl}
              alt="Overlay"
              onError={() => alert('Failed to load image')}
              style={{ width: '100%', height: 'auto' }}
            />
            {textData.map((paragraph, index) => {
              // Convertit les coordonnées du polygon en points adaptés au redimensionnement et à l'échelle
              const points = paragraph.polygon.map((coord, idx) =>
                idx % 2 === 0
                  ? { x: coord * scaleX + offsetX, y: paragraph.polygon[idx + 1] * scaleY + offsetY }
                  : null
              ).filter(point => point !== null) as { x: number, y: number }[];

              const minX = Math.min(...points.map(point => point.x));
              const minY = Math.min(...points.map(point => point.y));
              const maxX = Math.max(...points.map(point => point.x));
              const maxY = Math.max(...points.map(point => point.y));
              const width = maxX - minX;
              const height = maxY - minY;

              return (
                <div key={index}>
                  <div
                    style={{
                      position: 'absolute',
                      border: '2px solid black', // Bordure rouge pour le rectangle d'encadrement
                      left: minX,
                      top: minY,
                      width: width,
                      height: height,
                      opacity: 0.6,
                      display: 'block'
                    }}
                    onMouseEnter={() => setHoveredParagraphIndex(index)} // Montre le contenu au survol
                    onMouseLeave={() => setHoveredParagraphIndex(null)} // Cache le contenu au départ du survol
                  />
                  {hoveredParagraphIndex === index && (
                    <div
                      style={{
                        position: 'absolute',
                        left: minX,
                        top: maxY + 5,
                        backgroundColor: 'white',
                        border: '1px solid grey',
                        padding: '4px 8px',
                        zIndex: 1,
                        whiteSpace: 'pre-wrap',
                        maxWidth: '300px',

                      }}
                    >
                      {paragraph.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TransformComponent>
      )}
    </TransformWrapper>
  );
};

export default MyZoomPanComponent;
