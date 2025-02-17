import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTranslation } from "react-i18next";
import IconInput, { IconInputProps } from "../IconInput";

const Username = ({ ...props }: IconInputProps) => {
  const { t } = useTranslation("authentication");

  return (
    <IconInput
      id="username"
      dataTestId="modal-username"
      icon={<AccountCircleIcon className="text-white mb-1" />}
      placeholder={t("signup.username")}
      type="text"
      aria-label={t("alt.userIcon")}
      {...props}
    />
  );
};

export default Username;
