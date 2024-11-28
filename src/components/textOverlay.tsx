import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import json from '@/app/TestImagePage/test.json';
import { set } from 'react-hook-form';

interface TextData {
  content: string;
  polygon: number[];
  spans: { offset: number; length: number }[];
}

interface MyZoomPanComponentProps {
  imageUrl: string;
  textData: TextData[] | null;
  scaleX: number;
  scaleY: number;
  offsetX: number;
  offsetY: number;
}

const MyZoomPanComponent: React.FC<MyZoomPanComponentProps> = ({ imageUrl, textData, scaleX, scaleY, offsetX, offsetY }) => {
  const [hoveredParagraphIndex, setHoveredParagraphIndex] = useState<number | null>(null);

  if (!imageUrl) {
    return <div>Error: imageUrl is not provided or is invalid.</div>;
  }

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
                      border: '2px solid red',
                      left: minX,
                      top: minY,
                      width: width,
                      height: height,
                      opacity: 0.6,
                      display: 'block'
                    }}
                    onMouseEnter={() => setHoveredParagraphIndex(index)}
                    onMouseLeave={() => setHoveredParagraphIndex(null)}
                  />
                  {hoveredParagraphIndex === index && (
                    <div
                      style={{
                        position: 'absolute',
                        left: minX,
                        top: maxY + 5, // Position it just below the bounding rectangle
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
