import { createContext, useReducer } from "react";
import Data from "../Model/Data-Model";
import i18n from "../i18n";
import BlobData from "../interfaces/BlobData";
import StateType from "../interfaces/StateType";
import { useAlert } from "./AlertContext";
import {
  calculateStateObjectSize,
  stateObjectExceedsLimit,
} from "./stateObject";
import Inspection from "../interfaces/Inspection.ts";

interface SessionContextType {
  state: StateType;
}

export const SessionContext = createContext<SessionContextType>({
  state: { state: "capture", data: { pics: [], form: new Data([]), inspection: {} as Inspection } },
});

export const SetSessionContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setState: (_state: {
    state: string;
    data: {
      pics: BlobData[];
      form: Data;
      inspection: Inspection;
    };
  }) => {},
});

// eslint-disable-next-line @typescript-eslint/ban-types
export const SessionProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const initialState: {
    state: string;
    data: { pics: BlobData[]; form: Data; inspection: Inspection };
  } = sessionStorage.getItem("state")
    ? JSON.parse(sessionStorage.getItem("state")!)
    : { state: "capture", data: { pics: [], form: new Data([]), inspection: {} as Inspection } };
  const { showAlert } = useAlert();

  const stateReducer = (_state: StateType, newState: StateType) => {
    if (stateObjectExceedsLimit(newState)) {
      showAlert(i18n.t("exceedsLimit"), "error");
      return _state;
    }

    try {
      sessionStorage.setItem("state", JSON.stringify(newState));
    } catch (e) {
      console.error(e);
      console.log("state object size", calculateStateObjectSize(newState));
    }
    return newState;
  };

  const [state, setState] = useReducer(stateReducer, initialState);

  return (
    <SessionContext.Provider value={{ state: state }}>
      <SetSessionContext.Provider value={{ setState: setState }}>
        {children}
      </SetSessionContext.Provider>
    </SessionContext.Provider>
  );
};
