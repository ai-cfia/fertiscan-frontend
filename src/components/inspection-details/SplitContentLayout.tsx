import ImageViewer from "@/components/ImageViewer";
import ExpandButton from "@/components/inspection-details/ExpandButton";
import useBreakpoints from "@/utils/client/useBreakpoints";
import { Box, BoxProps } from "@mui/material";
import { ReactNode, useState } from "react";

interface SplitContentLayoutProps extends BoxProps {
  imageFiles: File[];
  topPanel?: ReactNode;
  bottomPanel?: ReactNode;
  header: ReactNode;
  body: ReactNode;
  footer: ReactNode;
  expandable?: boolean;
}

const SplitContentLayout = ({
  imageFiles,
  topPanel,
  bottomPanel,
  header,
  body,
  footer,
  expandable = false,
  ...boxProps
}: SplitContentLayoutProps) => {
  const { isDownXs, isBetweenXsSm, isBetweenSmMd, isBetweenMdLg } =
    useBreakpoints();
  const isLgOrBelow =
    isDownXs || isBetweenXsSm || isBetweenSmMd || isBetweenMdLg;

  const [isRetractedView, setIsRetractedView] = useState(true);

  return (
    <Box
      data-testid="main-content"
      {...boxProps}
      className={`my-4 flex flex-col gap-4 ${boxProps.className}`}
    >
      {/* Top Panel on large screens */}
      {!isLgOrBelow && topPanel && (
        <Box className="w-full" data-testid="top-panel">
          {topPanel}
        </Box>
      )}

      <Box
        className={`flex flex-col ${isLgOrBelow ? "gap-4" : "gap-4 lg:h-[85vh] lg:min-h-[500px] lg:flex-row"}`}
      >
        {/* Left Section: Image Viewer */}
        {isRetractedView && (
          <Box
            className="flex h-[500px] min-w-0 justify-center md:h-[720px] lg:size-full"
            data-testid="image-viewer-container"
          >
            <ImageViewer imageFiles={imageFiles} />
          </Box>
        )}

        {/* Top Panel on small screens */}
        {isLgOrBelow && topPanel && (
          <Box className="mt-4 w-full p-4" data-testid="top-panel-mobile">
            {topPanel}
          </Box>
        )}

        {/* Right Section */}
        <Box
          className="relative mb-0 flex size-full min-w-0 flex-col border border-black bg-white text-center"
          sx={{ minWidth: "500px" }}
        >
          {/* Expand Button */}
          {expandable && (
            <ExpandButton
              isRetracted={isRetractedView}
              setIsRetracted={setIsRetractedView}
            />
          )}

          <Box className="flex size-full min-w-0 flex-col gap-4 p-4 text-center">
            {/* Header Section */}
            <Box data-testid="header-section">{header}</Box>

            {/* Body Section */}
            <Box
              className="flex-1 overflow-y-auto p-4 sm:px-6"
              data-testid="body-section"
            >
              {body}
            </Box>

            {/* Footer Section */}
            <Box data-testid="footer-section">{footer}</Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom Panel */}
      {bottomPanel && (
        <Box className="w-full" data-testid="bottom-panel">
          {bottomPanel}
        </Box>
      )}
    </Box>
  );
};

export default SplitContentLayout;
