import axios from "axios";
import merge from "deepmerge";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Label from "../../Components/Label/Label";
import { createDefaultInspection } from "../../interfaces/Inspection";
import Data from "../../Model/Data-Model";
import { useAlert } from "../../Utils/AlertContext";
import { combineMerge } from "../../Utils/deepMerge";
import { FertiliserForm, populateFromJSON } from "../../Utils/FormCreator";
import "./LabelPage.css";

function LabelPage() {
  const params = useParams();
  const labelId = params.labelId;
  const [label, setLabel] = useState<Data>(FertiliserForm());
  const { showAlert } = useAlert();
  useEffect(() => {
    if (process.env.REACT_APP_ACTIVATE_USING_JSON == "true") {
      fetch("/debug/" + labelId + ".json")
        .then((response) => response.json())
        .then((data) => {
          setLabel(populateFromJSON(label, data));
        });
    } else {
      axios
        .get(process.env.VITE_API_URL + "/inspections/" + labelId, {
          headers: {
            Authorization:
              "Basic " + document.cookie.split("auth=")[1].split(";")[0],
          },
        })
        .then((response) => {
          let data = response.data;

          if (typeof data === "string") {
            try {
              data = JSON.parse(data);
            } catch (e) {
              console.error("Error parsing JSON string:", e);
            }
          }
          const inspection = merge(createDefaultInspection(), data, {
            arrayMerge: combineMerge,
          });
          setLabel(populateFromJSON(label, inspection));
        })
        .catch((error) => {
          console.error("Error fetching the inspection:", error);
          showAlert(String(error), "error");
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
