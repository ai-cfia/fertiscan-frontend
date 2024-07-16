/**
 * Interface representing the data for a selected image blob.
 * This is used to hold selected images inside the global state object.
 */
interface BlobData {
  /** The base64 or binary string representation of the image blob. */
  blob: string;
  /** The name of the image file. */
  name: string;
}

export default BlobData;
