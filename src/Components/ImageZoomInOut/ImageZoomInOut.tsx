import { useState, useRef, useEffect } from "react";
import "./ImageZoomInOut.css";

interface ImageProps {
  imageUrl: string;
  className?: string; // Optional class name
  onClick?: () => void; // Optional click handler function
}

function ImageZoomInOut({ imageUrl, className, onClick }: ImageProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null) || scale > 1;

  const handleHoldZoomIn = () => {
    if (intervalRef.current && scale + 0.05 < 1) return;
    intervalRef.current = setInterval(() => {
      handleZoomIn();
    }, 1);
  };

  const handleHoldZoomOut = () => {
    if (intervalRef.current && scale + 0.05 < 1) return;
    intervalRef.current = setInterval(() => {
      handleZoomOut();
    }, 1);
  };

  const handleHoldZoomInOutStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleZoomIn = () => {
    if (scale + 0.05 > 1) {
      setScale((scale) => scale + 0.05);
    } else {
      setScale(1);
      handleHoldZoomInOutStop();
    }
  };

  const handleZoomOut = () => {
    if (scale - 0.05 > 1) {
      setScale((scale) => scale - 0.05);
    } else {
      setScale(1);
      handleHoldZoomInOutStop();
    }
  };

  useEffect(() => {
    const image = imageRef.current as unknown as HTMLImageElement;
    let isDragging = false;
    let prevPosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevPosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevPosition.x;
      const deltaY = e.clientY - prevPosition.y;
      prevPosition = { x: e.clientX, y: e.clientY };
      setPosition((position) => ({
        x: position.x + deltaX,
        y: position.y + deltaY,
      }));
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    image?.addEventListener("mousedown", handleMouseDown);
    image?.addEventListener("mousemove", handleMouseMove);
    image?.addEventListener("mouseup", handleMouseUp);

    return () => {
      image?.removeEventListener("mousedown", handleMouseDown);
      image?.removeEventListener("mousemove", handleMouseMove);
      image?.removeEventListener("mouseup", handleMouseUp);
    };
  }, [imageRef, scale]);

  return (
    <div
      className={`imageZoomInOut ${className || ""}`}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        position: "relative",
        overflow: "hidden",
      }}
      onClick={onClick}
    >
      <div className={`btn-container ${imageRef.current ? "hidden" : ""}`}>
        <button
          onClick={handleZoomIn}
          onMouseDown={handleHoldZoomIn}
          onMouseUp={handleHoldZoomInOutStop}
          onMouseLeave={handleHoldZoomInOutStop}
        >
          <span className="material-symbols-outlined">+</span>
        </button>
        <button
          onClick={handleZoomOut}
          onMouseDown={handleHoldZoomOut}
          onMouseUp={handleHoldZoomInOutStop}
          onMouseLeave={handleHoldZoomInOutStop}
        >
          <span className="material-symbols-outlined">-</span>
        </button>
      </div>

      <img
        ref={imageRef}
        src={imageUrl}
        alt="No Picture"
        className="imageZoomInOut"
        style={{
          width: "50vw",
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          cursor: "move",
        }}
        draggable={false}
      />
    </div>
  );
}

export default ImageZoomInOut;
