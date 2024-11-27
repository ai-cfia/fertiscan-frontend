import { AlertColor } from "@mui/material/Alert";
import { AlertPropsColorOverrides } from "@mui/material/Alert/Alert";
import { OverridableStringUnion } from "@mui/types";

/**
 * Represents the state of a dropzone component.
 */
interface DropzoneState {
  /**
   * Indicates whether the dropzone is visible.
   */
  visible: boolean;

  /**
   * The URL of the image associated with the dropzone, or null if no image is present.
   */
  imageUrl: string | null;

  /**
   * The percentage of the dropzone that is filled, if applicable.
   * This property is optional.
   */
  fillPercentage?: number;
}

/**
 * Represents an event that occurs when an image has finished loading.
 * Extends the React SyntheticEvent specifically for HTMLImageElement.
 *
 * @interface ImageLoadEvent
 * @extends {React.SyntheticEvent<HTMLImageElement>}
 * @property {HTMLImageElement} target - The target element of the event, which is an HTMLImageElement.
 */
interface ImageLoadEvent extends React.SyntheticEvent<HTMLImageElement> {
  target: HTMLImageElement;
}

/**
 * Represents the dimensions of a parent element.
 *
 * @property {number} width - The width of the parent element.
 * @property {number} height - The height of the parent element.
 */
interface ParentDimensions {
  width: number;
  height: number;
}

export type { DropzoneState, ImageLoadEvent, ParentDimensions };

// Alert
export type AlertSeverity = OverridableStringUnion<
  AlertColor,
  AlertPropsColorOverrides
>;

export interface Alert {
  message: string;
  type: AlertSeverity;
}

export type VerifiedField = {
  verified: boolean;
};

export type VerifiedTextField = VerifiedField & {
  value: string;
};

// Organizations
export type Organization = {
  name: VerifiedTextField;
  address: VerifiedTextField;
  website: VerifiedTextField;
  phoneNumber: VerifiedTextField;
};

const DEFAULT_TEXT_FIELD: VerifiedTextField = {
  value: "",
  verified: false,
};

export const DEFAULT_ORGANIZATION: Organization = {
  name: DEFAULT_TEXT_FIELD,
  address: DEFAULT_TEXT_FIELD,
  website: DEFAULT_TEXT_FIELD,
  phoneNumber: DEFAULT_TEXT_FIELD,
};

export const isVerified = <T>(data: T, verified: boolean = true): boolean => {
  if (typeof data !== "object" || !data) return false;

  return Object.values(data).every((field) => {
    if (Array.isArray(field)) {
      return field.every(
        (item) => typeof item === "object" && item.verified === verified,
      );
    }

    if (typeof field === "object" && field !== null) {
      if ("verified" in field) {
        return field.verified === verified;
      }
      return isVerified(field, verified);
    }

    return true;
  });
};

// Quantity
export type Quantity = {
  value: string;
  unit: string;
};

export type VerifiedQuantityField = VerifiedField & {
  quantities: Quantity[];
};

export const UNITS = {
  weight: ["kg", "g", "lb", "tonne"],
  volume: ["L", "mL", "gal", "ft³"],
  density: ["lb/ft³", "g/cm³", "kg/m³", "lb/gal"],
  guaranteedAnalysis: ["%", "ppm"],
};

const DEFAULT_QUANTITY_FIELD = (unit: string): VerifiedQuantityField => ({
  quantities: [{ value: "", unit }],
  verified: false,
});

// Base Information
export type BaseInformation = {
  name: VerifiedTextField;
  registrationNumber: VerifiedTextField;
  lotNumber: VerifiedTextField;
  npk: VerifiedTextField;
  weight: VerifiedQuantityField;
  density: VerifiedQuantityField;
  volume: VerifiedQuantityField;
};

export const DEFAULT_BASE_INFORMATION: BaseInformation = {
  name: DEFAULT_TEXT_FIELD,
  registrationNumber: DEFAULT_TEXT_FIELD,
  lotNumber: DEFAULT_TEXT_FIELD,
  npk: DEFAULT_TEXT_FIELD,
  weight: DEFAULT_QUANTITY_FIELD(UNITS.weight[0]),
  density: DEFAULT_QUANTITY_FIELD(UNITS.density[0]),
  volume: DEFAULT_QUANTITY_FIELD(UNITS.volume[0]),
};

export type Translation = {
  en: string;
  fr: string;
};

export type BilingualField = VerifiedField & Translation & Partial<Quantity>;

export const DEFAULT_BILINGUAL_FIELD: BilingualField = {
  en: "",
  fr: "",
  verified: false,
};

export const DEFAULT_GA_NUTRIENT: BilingualField = {
  en: "",
  fr: "",
  value: "",
  unit: UNITS.guaranteedAnalysis[0],
  verified: false,
};

export type GuaranteedAnalysis = {
  titleEn: VerifiedTextField;
  titleFr: VerifiedTextField;
  nutrients: BilingualField[];
};

export const DEFAULT_GUARANTEED_ANALYSIS: GuaranteedAnalysis = {
  titleEn: DEFAULT_TEXT_FIELD,
  titleFr: DEFAULT_TEXT_FIELD,
  nutrients: [DEFAULT_GA_NUTRIENT],
};

// LabelData
export type LabelData = {
  organizations: Organization[];
  baseInformation: BaseInformation;
  cautions: BilingualField[];
  instructions: BilingualField[];
  guaranteedAnalysis: GuaranteedAnalysis;
};

export const DEFAULT_LABEL_DATA: LabelData = {
  organizations: [DEFAULT_ORGANIZATION],
  baseInformation: DEFAULT_BASE_INFORMATION,
  cautions: [DEFAULT_BILINGUAL_FIELD],
  instructions: [DEFAULT_BILINGUAL_FIELD],
  guaranteedAnalysis: DEFAULT_GUARANTEED_ANALYSIS,
};

// Form
export interface FormComponentProps {
  labelData: LabelData;
  setLabelData: React.Dispatch<React.SetStateAction<LabelData>>;
}
