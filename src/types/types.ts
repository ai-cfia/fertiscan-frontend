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

// Field
export enum FieldStatus {
  Verified = "verified",
  Unverified = "unverified",
  Error = "error",
}

export type Field = {
  value: string;
  status: FieldStatus;
  errorMessage: string | null;
};

// Organizations
export type Organization = {
  name: Field;
  address: Field;
  website: Field;
  phoneNumber: Field;
};

export const DEFAULT_ORGANIZATION: Organization = {
  name: {
    value: "",
    status: FieldStatus.Unverified,
    errorMessage: null,
  },
  address: {
    value: "",
    status: FieldStatus.Unverified,
    errorMessage: null,
  },
  website: {
    value: "",
    status: FieldStatus.Unverified,
    errorMessage: null,
  },
  phoneNumber: {
    value: "",
    status: FieldStatus.Unverified,
    errorMessage: null,
  },
};

export const TEST_ORGANIZATION: Organization = {
  name: {
    value: "GreenGrow Inc.",
    status: FieldStatus.Unverified,
    errorMessage: null,
  },
  address: {
    value: "123 Green Road, Farmville, State, 12345",
    status: FieldStatus.Unverified,
    errorMessage: null,
  },
  website: {
    value: "https://www.greengrow.com",
    status: FieldStatus.Unverified,
    errorMessage: null,
  },
  phoneNumber: {
    value: "123-456-7890",
    status: FieldStatus.Unverified,
    errorMessage: null,
  },
};

export const checkOrganizationStatus = (
  organization: Organization,
  status: FieldStatus,
): boolean => {
  return (
    organization &&
    Object.values(organization).every((field) => field.status === status)
  );
};

// LabelData
export type LabelData = {
  organizations: Organization[];
};

export const DEFAULT_LABEL_DATA: LabelData = {
  organizations: [DEFAULT_ORGANIZATION],
};

export const TEST_LABEL_DATA: LabelData = {
  organizations: [TEST_ORGANIZATION, TEST_ORGANIZATION],
};

// Form 
export interface FormComponentProps {
  title: string;
  labelData: LabelData;
  setLabelData: React.Dispatch<React.SetStateAction<LabelData>>;
}
