import { createContext, useReducer } from "react";
import Data from "../Model/Data-Model";

interface StateType {
  state: string;
  data: {
    pics: { blob: string; name: string }[];
    form: Data;
  };
}

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
      pics: { blob: string; name: string }[];
      form: Data;
    };
  }) => {},
});

// eslint-disable-next-line @typescript-eslint/ban-types
export const SessionProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const initialState: {
    state: string;
    data: { pics: { blob: string; name: string }[]; form: Data };
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

function stateReducer(_state: StateType, newState: StateType) {
  sessionStorage.setItem("state", JSON.stringify(newState));
  return newState;
}
