import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import "./ImageZoomInOut.css";
import { useEffect } from "react";

interface ControlsProps {
  url: string;
}
const TransformControls = ({ url }: ControlsProps) => {
  const { resetTransform } = useControls();
  useEffect(() => {
    resetTransform();
    // eslint-disable-next-line
  }, [url]);
  return <></>;
};

interface ImageProps {
  imageUrl: string;
  className?: string; // Optional class name
  onClick?: () => void; // Optional click handler function
  alt?: string; // Optional alt text
}

function ImageZoomInOut({ imageUrl, className, onClick, alt }: ImageProps) {
  return (
    <div className="zoom-in-out" onClick={onClick}>
      <TransformWrapper pinch={{ step: 1000 }}>
        {/* eslint-disable-next-line */}
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <>
            <TransformControls url={imageUrl} />
            <TransformComponent>
              <img src={imageUrl} alt={alt} className={className} />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

export default ImageZoomInOut;
