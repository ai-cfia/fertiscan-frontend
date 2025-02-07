import { Button, ButtonProps, CircularProgress } from "@mui/material";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
  text: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  text,
  disabled,
  children,
  ...props
}) => {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading ? (
        <>
          <CircularProgress
            size={16}
            color="inherit"
            data-testid="loading-spinner"
          />
          <span className="ml-2">{text}</span>
        </>
      ) : (
        children || <span>{text}</span>
      )}
    </Button>
  );
};

export default LoadingButton;
