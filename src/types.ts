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

export type Field = {
  value: string;
  isChecked: boolean;
};

export type Organization = {
  name: Field;
  address: Field;
  website: Field;
  phoneNumber: Field;
};

export type OrganizationsData = {
  organizations: Organization[];
};
