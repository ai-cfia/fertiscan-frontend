import { useParams } from "react-router-dom";
import Label from "../../Components/Label/Label";
import { useEffect, useState } from "react";
import { FertiliserForm, populateFromJSON } from "../../Utils/FormCreator";
import Data from "../../Model/Data-Model";
import "./LabelPage.css";

function LabelPage() {

  const params = useParams();
  const labelId = params.labelId;
  const [label, setLabel] = useState<Data>(FertiliserForm());
  console.log
  useEffect(() => {
    if(process.env.REACT_APP_ACTIVATE_USING_JSON=="true"){
      fetch("/debug/"+labelId+".json")
      .then(response => response.json())
      .then(data => {
        setLabel(populateFromJSON(label,data));
      });
    }
  }, [labelId]);

  return (
    <div className="label-page confirm-container">
      <Label sections={label.sections}/>
    </div>
  );
}

export default LabelPage;