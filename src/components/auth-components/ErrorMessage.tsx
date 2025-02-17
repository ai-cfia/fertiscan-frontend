import { Typography, TypographyProps } from "@mui/material";

const ErrorMessage = ({
  className = "",
  children,
  ...props
}: TypographyProps) => {
  return (
    <Typography
      id="error-message"
      data-testid="modal-error-message"
      {...props}
      className={`text-red-500 ${!children ? "hidden" : "block"} ${className}`}
    >
      {children}
    </Typography>
  );
};

export default ErrorMessage;
