import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import "./ImageZoomInOut.css";

interface ImageProps {
  imageUrl: string;
  className?: string; // Optional class name
  onClick?: () => void; // Optional click handler function
  alt?: string; // Optional alt text
}

function ImageZoomInOut({ imageUrl, className, onClick, alt}: ImageProps) {
  
  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (
      <>
        <button onClick={() => zoomIn()}>Zoom In</button>
        <button onClick={() => zoomOut()}>Zoom Out</button>
        <button onClick={() => resetTransform()}>Reset</button>
      </>
    );
  };

  return (
    <div onClick={onClick}>
      <TransformWrapper pinch={{ step: 1000 }}>
        <TransformComponent>
          <img src={imageUrl} alt="No Picture" className={className} />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

export default ImageZoomInOut;
