import Data from "../Model/Data-Model";
import BlobData from "./BlobData";

/**
 * Interface representing the global state of the application.
 * This object is saved in local storage.
 */
interface StateType {
  /** The current state or phase of the application. */
  state: string;
  data: {
    /** An array of BlobData objects representing selected images. */
    pics: BlobData[];
    /** The fertilizer inspection form data associated with the current state. */
    form: Data;
  };
}

export default StateType;
