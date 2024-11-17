import { AlertColor } from "@mui/material/Alert";
import { AlertPropsColorOverrides } from "@mui/material/Alert/Alert";
import { OverridableStringUnion } from "@mui/types";

export type AlertSeverity = OverridableStringUnion<
  AlertColor,
  AlertPropsColorOverrides
>;

export default interface Alert {
  message: string;
  type: AlertSeverity;
}
