import "./HomePage.css"
import {  useContext } from "react";
import { SessionContext } from "../../Utils/SessionContext";
import CapturPage from "../CapturPage/CapturPage";
import FormPage from "../FormPage/FormPage";
import ConfirmPage from "../ConfirmPage/ConfirmPage";

function HomePage() {
    
    const {state} = useContext(SessionContext);
    if(state.state === "form"){
        return (
            <FormPage/>
        );
    }else if(state.state === "validation"){
        return (
            <ConfirmPage/>
        );
    }
     return (
        <CapturPage/>
    );
}




export default HomePage;