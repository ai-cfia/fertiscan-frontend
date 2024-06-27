import { createContext, useReducer } from "react";

interface SessionContextType {
    state: {
        state: string;
        data: {
        pics: {blob: string, name: string}[];
        form: {};
        };
    };
}

export const SessionContext = createContext<SessionContextType>({state:{state:"captur",data:{pics:[],form:{}}}});

export const SetSessionContext = createContext({
    setState: (state: {
        state: string;
        data: {
            pics: {blob: string, name: string}[];
            form: {};
        };
    
    }) => {},
});


export const SessionProvider = ({children}:any)=>{

    const initialState:{state:string, data:{ pics: {blob:string, name:string}[], form:{}}} = sessionStorage.getItem("state") 
        ? JSON.parse(sessionStorage.getItem("state")!)
        : {state:"captur",data:{pics:[],form:{}}};
    const [state, setState] = useReducer(stateReducer, initialState);

    return (
        <SessionContext.Provider value={{state:state}}>
            <SetSessionContext.Provider value={{setState:setState}}>
                {children}
            </SetSessionContext.Provider>
        </SessionContext.Provider>
    );


}

function stateReducer(_state: any,  newState: any) {
    sessionStorage.setItem("state", JSON.stringify(newState));
    return newState;
}