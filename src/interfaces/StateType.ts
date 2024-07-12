import Data from "../Model/Data-Model";
import BlobData from "./BlobData";

interface StateType {
  state: string;
  data: {
    pics: BlobData[];
    form: Data;
  };
}

export default StateType;
