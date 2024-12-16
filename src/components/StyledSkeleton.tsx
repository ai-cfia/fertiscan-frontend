import Skeleton, { SkeletonProps } from "@mui/material/Skeleton";
import React from "react";

interface StyledSkeletonProps extends SkeletonProps {
  animationDuration?: string;
}

const StyledSkeleton: React.FC<StyledSkeletonProps> = ({
  animationDuration = "1s",
  className = "",
  ...rest
}) => {
  return (
    <Skeleton
      variant="rectangular"
      className={`rounded-md !h-12 ${className}`}
      animation="wave"
      sx={{
        "&::after": {
          animationDuration,
        },
        ...rest.sx,
      }}
      data-testid="styled-skeleton"
      {...rest}
    />
  );
};

export default StyledSkeleton;
