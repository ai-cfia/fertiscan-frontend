import {
  TransformWrapper,
  TransformComponent,
  useControls,
  ReactZoomPanPinchContext,
} from "react-zoom-pan-pinch";
import "./ImageZoomInOut.css";
import { useEffect, useState } from "react";

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
  className?: string;
  onClick?: () => void;
  alt?: string;
}

function ImageZoomInOut({ imageUrl, alt }: ImageProps) {
  //sorry for the hack, but I can't find a way to avoid the error
  // eslint-disable-next-line
  const varForNoError = (_: {
    instance: ReactZoomPanPinchContext;
    setTransform: ReturnType<
      (
        contextInstance: ReactZoomPanPinchContext,
      ) => (
        newPositionX: number,
        newPositionY: number,
        newScale: number,
        animationTime?: number,
        animationType?:
          | "easeOut"
          | "linear"
          | "easeInQuad"
          | "easeOutQuad"
          | "easeInOutQuad"
          | "easeInCubic"
          | "easeOutCubic"
          | "easeInOutCubic"
          | "easeInQuart"
          | "easeOutQuart"
          | "easeInOutQuart"
          | "easeInQuint"
          | "easeOutQuint"
          | "easeInOutQuint",
      ) => void
    >;
    centerView: ReturnType<
      (
        contextInstance: ReactZoomPanPinchContext,
      ) => (
        scale?: number,
        animationTime?: number,
        animationType?:
          | "easeOut"
          | "linear"
          | "easeInQuad"
          | "easeOutQuad"
          | "easeInOutQuad"
          | "easeInCubic"
          | "easeOutCubic"
          | "easeInOutCubic"
          | "easeInQuart"
          | "easeOutQuart"
          | "easeInOutQuart"
          | "easeInQuint"
          | "easeOutQuint"
          | "easeInOutQuint",
      ) => void
    >;
    zoomToElement: ReturnType<
      (
        contextInstance: ReactZoomPanPinchContext,
      ) => (
        node: HTMLElement | string,
        scale?: number,
        animationTime?: number,
        animationType?:
          | "easeOut"
          | "linear"
          | "easeInQuad"
          | "easeOutQuad"
          | "easeInOutQuad"
          | "easeInCubic"
          | "easeOutCubic"
          | "easeInOutCubic"
          | "easeInQuart"
          | "easeOutQuart"
          | "easeInOutQuart"
          | "easeInQuint"
          | "easeOutQuint"
          | "easeInOutQuint",
      ) => void
    >;
  }) => {};

const [isDragging, setIsDragging] = useState(false);

const handlePanning = () => {
  // Basculer l'état de "dragging"
  setIsDragging(!isDragging);
}

useEffect(()=>{
    const transformWrapperElement = document.querySelector(".react-transform-component");
    if (transformWrapperElement) {
      if (isDragging) {
        transformWrapperElement.classList.add("on-drag");
      } else {
        transformWrapperElement.classList.remove("on-drag");
      }
    }
  }, [isDragging]);


  return (
    <TransformWrapper pinch={{ step: 1000 }} onPanningStart={handlePanning} onPanningStop={handlePanning}>
      {/* eslint-disable-next-line */}
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          {varForNoError(rest)}
          <TransformControls url={imageUrl} />
          <TransformComponent>
            <img src={imageUrl} alt={alt} className="test" />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
}

export default ImageZoomInOut;
