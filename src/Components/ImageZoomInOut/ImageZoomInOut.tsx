import {
  TransformWrapper,
  TransformComponent,
  useControls,
  ReactZoomPanPinchContext,
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

function ImageZoomInOut({ imageUrl, alt }: ImageProps) {
  //sorry for the hack, but I can't find a way to avoid the error
  const useVarForNoError = (_: {
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
  return (
    <TransformWrapper pinch={{ step: 1000 }}>
      {/* eslint-disable-next-line */}
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          {useVarForNoError(rest)}
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
