import { createContext, useReducer } from "react";
import Data from "../Model/Data-Model";
import BlobData from "../interfaces/BlobData";
import StateType from "../interfaces/StateType";
import { stateObjectExceedsLimit } from "./stateObject";
import { Error } from "./ErrorContext";
import { useTranslation } from "react-i18next";


interface SessionContextType {
  state: StateType;
}

export const SessionContext = createContext<SessionContextType>({
  state: { state: "captur", data: { pics: [], form: new Data([]) } },
});

export const SetSessionContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setState: (_state: {
    state: string;
    data: {
      pics: BlobData[];
      form: Data;
    };
  }) => {},
});

function stateReducer(_state: StateType, newState: StateType) {
  const {showAlert} = Error()
  const t = useTranslation().t
  if (stateObjectExceedsLimit(newState)) {
    showAlert(t("exceedsLimit"))
    return _state;
  }

  sessionStorage.setItem("state", JSON.stringify(newState));
  return newState;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const SessionProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const initialState: {
    state: string;
    data: { pics: BlobData[]; form: Data };
  } = sessionStorage.getItem("state")
    ? JSON.parse(sessionStorage.getItem("state")!)
    : { state: "captur", data: { pics: [], form: new Data([]) } };
  const [state, setState] = useReducer(stateReducer, initialState);

  return (
    <SessionContext.Provider value={{ state: state }}>
      <SetSessionContext.Provider value={{ setState: setState }}>
        {children}
      </SetSessionContext.Provider>
    </SessionContext.Provider>
  );
};
