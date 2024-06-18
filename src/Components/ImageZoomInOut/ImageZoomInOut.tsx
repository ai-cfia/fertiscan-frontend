import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "./ImageZoomInOut.css";

interface ImageProps {
  imageUrl: string;
  className?: string; // Optional class name
  onClick?: () => void; // Optional click handler function
  alt?: string; // Optional alt text
}

function ImageZoomInOut({ imageUrl, className, onClick, alt }: ImageProps) {
  return (
    <div onClick={onClick}>
      <TransformWrapper pinch={{ step: 1000 }}>
        <TransformComponent>
          <img src={imageUrl} alt={alt} className={className} />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

export default ImageZoomInOut;
