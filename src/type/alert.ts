// types/alert.ts
import { AlertColor } from '@mui/material/Alert';
import { OverridableStringUnion } from '@mui/types';
import { AlertPropsColorOverrides } from '@mui/material/Alert/Alert';

export type AlertSeverity = OverridableStringUnion<AlertColor, AlertPropsColorOverrides>;

export interface Alert {
  message: string;
  type: AlertSeverity;
}
