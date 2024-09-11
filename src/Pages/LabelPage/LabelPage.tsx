import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Label from "../../Components/Label/Label";
import Data from "../../Model/Data-Model";
import { FertiliserForm, populateFromJSON } from "../../Utils/FormCreator";
import "./LabelPage.css";

function LabelPage() {
  const params = useParams();
  const labelId = params.labelId;
  const [label, setLabel] = useState<Data>(FertiliserForm());
  useEffect(() => {
    if (process.env.REACT_APP_ACTIVATE_USING_JSON == "true") {
      fetch("/debug/" + labelId + ".json")
        .then((response) => response.json())
        .then((data) => {
          setLabel(populateFromJSON(label, data));
        });
    } else {
      fetch(process.env.VITE_API_URL + "/inspections/" + labelId, {
        headers: {
          Authorization:
            "Basic " + document.cookie.split("auth=")[1].split(";")[0],
        },
      })
        .then((r) => r.json())
        .then((data) => {
          data = JSON.parse(data);
          setLabel(populateFromJSON(label, data));
        });
    }
    // eslint-disable-next-line
  }, [labelId]);

  return (
    <div className="label-page confirm-container">
      <Label sections={label.sections} />
    </div>
  );
}

export default LabelPage;
