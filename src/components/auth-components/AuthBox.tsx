import { Box, BoxProps } from "@mui/material";

const AuthBox = ({ className = "", ...props }: BoxProps) => (
  <Box
    {...props}
    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 max-w-lg max-h-[500px] px-4 py-4 bg-sky-900 rounded-2xl shadow-2xl outline-none flex flex-col ${className}`}
  />
);

export default AuthBox;
