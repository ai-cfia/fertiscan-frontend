import { AnchorHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

interface ToggleSignProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  onChangeMode: () => void;
}

const ToggleSign = ({
  onChangeMode,
  className = "",
  children,
  ...props
}: ToggleSignProps) => {
  const { t } = useTranslation("authentication");

  return (
    <a
      href="#"
      role="button"
      tabIndex={0}
      id="toggleSignButton"
      data-testid="modal-change-button"
      onClick={(e) => {
        e.preventDefault();
        onChangeMode();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChangeMode();
        }
      }}
      {...props}
      className={`underline cursor-pointer text-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    >
      {children || t("signup.switchLink")}
    </a>
  );
};

export default ToggleSign;
