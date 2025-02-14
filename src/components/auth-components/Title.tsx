import { Typography, TypographyProps } from "@mui/material";

const Title = ({ className = "", ...props }: TypographyProps) => (
  <Typography
    variant="h3"
    data-testid="modal-title"
    {...props}
    className={`pl-4 pt-2 !mb-8 text-white ${className}`}
  />
);

export default Title;
