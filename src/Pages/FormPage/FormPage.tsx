import React, { useState, useRef, useEffect, StrictMode } from "react";
import "./FormPage.css";
import Carousel from "../../Components/Carousel/Carousel";
import { useLocation, useNavigate } from "react-router-dom";
import ProgressBar from "../../Components/ProgressBar/ProgressBar";
import SectionComponent from "../../Components/Section/Section.tsx";
import Section from "../../Model/Section-Model.tsx";
import Input from "../../Model/Input-Model.tsx";
import Data from "../../Model/Data-Model.tsx";
import { FormClickActions } from "../../Utils/EventChannels.tsx";

const FormPage = () => {
  // @ts-expect-error : setForm is going to be used when linked to db
  // eslint-disable-next-line
  const [form, setForm] = useState({
    company_name: "",
    company_address: "",
    company_website: "",
    company_phone_number: "",
    manufacturer_name: "",
    manufacturer_address: "",
    manufacturer_website: "",
    manufacturer_phone_number: "",
    fertiliser_name: "",
    fertiliser_registration_number: "",
    fertiliser_lot_number: "",
    fertiliser_npk: "",
    fertiliser_precautionary_fr: "",
    fertiliser_precautionary_en: "",
    fertiliser_instructions_fr: "",
    fertiliser_instructions_en: "",
    fertiliser_ingredients_fr: "",
    fertiliser_ingredients_en: "",
    fertiliser_specifications_fr: "",
    fertiliser_specifications_en: "",
    fertiliser_cautions_fr: "",
    fertiliser_cautions_en: "",
    fertiliser_recommendation_fr: "",
    fertiliser_recommendation_en: "",
    fertiliser_first_aid_fr: "",
    fertiliser_first_aid_en: "",
    fertiliser_warranty_fr: "",
    fertiliser_warranty_en: "",
    fertiliser_danger_fr: "",
    fertiliser_danger_en: "",
    fertiliser_guaranteed_analysis: "",
    nutrient_in_guaranteed_analysis: "",
    percentage_in_guaranteed_analysis: "",
    fertiliser_weight: "",
    fertiliser_density: "",
    fertiliser_volume: "",
    fertiliser_label_all_other_text_fr: "",
    all_other_text_fr_1: "",
    all_other_text_fr_2: "",
    fertiliser_label_all_other_text_en: "",
    all_other_text_en_1: "",
    all_other_text_en_2: "",
  });

  const location = useLocation();
  const files: File[] = location.state.data;
  const [loading, setLoading] = useState(true);
  // @ts-expect-error : has to be used to prompt user when error
  // eslint-disable-next-line
  const [fetchError, setError] = useState<Error | null>(null);
  const [urls, setUrls] = useState<
    {
      url: string;
      title: string;
    }[]
  >([]);

  // this object describes how the formPage data will looks like
  const [data, setData] = useState<Data>(
    new Data([
      new Section("Company information", "company", [
        new Input("name", form.company_name, "company"),
        new Input("address", form.company_address, "company"),
        new Input("website", form.company_website, "company"),
        new Input("phone_number", form.company_phone_number, "company"),
      ]),
      new Section("Manufacturer information", "manufacturer", [
        new Input("name", form.manufacturer_name, "manufacturer"),
        new Input("address", form.manufacturer_address, "manufacturer"),
        new Input("website", form.manufacturer_website, "manufacturer"),
        new Input(
          "phone_number",
          form.manufacturer_phone_number,
          "manufacturer",
        ),
      ]),
      new Section("Fertiliser information", "fertiliser", [
        new Input("name", form.fertiliser_name, "fertiliser"),
        new Input(
          "registration_number",
          form.fertiliser_registration_number,
          "fertiliser",
        ),
        new Input("lot_number", form.fertiliser_lot_number, "fertiliser"),
        new Input("npk", form.fertiliser_npk, "fertiliser"),
        new Input(
          "precautionary_fr",
          form.fertiliser_precautionary_fr,
          "fertiliser",
        ),
        new Input(
          "precautionary_en",
          form.fertiliser_precautionary_en,
          "fertiliser",
        ),
        new Input(
          "instructions_fr",
          form.fertiliser_instructions_fr,
          "fertiliser",
        ),
        new Input(
          "instructions_en",
          form.fertiliser_instructions_en,
          "fertiliser",
        ),
        new Input(
          "ingredients_fr",
          form.fertiliser_ingredients_fr,
          "fertiliser",
        ),
        new Input(
          "ingredients_en",
          form.fertiliser_ingredients_en,
          "fertiliser",
        ),
        new Input(
          "specifications_fr",
          form.fertiliser_specifications_fr,
          "fertiliser",
        ),
        new Input(
          "specifications_en",
          form.fertiliser_specifications_en,
          "fertiliser",
        ),
        new Input("cautions_fr", form.fertiliser_cautions_fr, "fertiliser"),
        new Input("cautions_en", form.fertiliser_cautions_en, "fertiliser"),
        new Input(
          "recommendation_fr",
          form.fertiliser_recommendation_fr,
          "fertiliser",
        ),
        new Input(
          "recommendation_en",
          form.fertiliser_recommendation_en,
          "fertiliser",
        ),
        new Input("first_aid_fr", form.fertiliser_first_aid_fr, "fertiliser"),
        new Input("first_aid_en", form.fertiliser_first_aid_en, "fertiliser"),
        new Input("warranty_fr", form.fertiliser_warranty_fr, "fertiliser"),
        new Input("warranty_en", form.fertiliser_warranty_en, "fertiliser"),
        new Input(
          "guaranteed_analysis",
          form.fertiliser_guaranteed_analysis,
          "fertiliser",
        ),
        new Input(
          "nutrient_in_guaranteed_analysis",
          form.nutrient_in_guaranteed_analysis,
          "fertiliser",
        ),
        new Input(
          "percentage_in_guaranteed_analysis",
          form.percentage_in_guaranteed_analysis,
          "fertiliser",
        ),
        new Input("weight", form.fertiliser_weight, "fertiliser"),
        new Input("density", form.fertiliser_density, "fertiliser"),
        new Input("volume", form.fertiliser_volume, "fertiliser"),
        new Input(
          "label_all_other_text_fr",
          form.fertiliser_label_all_other_text_fr,
          "fertiliser",
        ),
        new Input(
          "all_other_text_fr_1",
          form.all_other_text_fr_1,
          "fertiliser",
        ),
        new Input(
          "all_other_text_fr_2",
          form.all_other_text_fr_2,
          "fertiliser",
        ),
        new Input(
          "label_all_other_text_en",
          form.fertiliser_label_all_other_text_en,
          "fertiliser",
        ),
        new Input(
          "all_other_text_en_1",
          form.all_other_text_en_1,
          "fertiliser",
        ),
        new Input(
          "all_other_text_en_2",
          form.all_other_text_en_2,
          "fertiliser",
        ),
      ]),
    ]),
  );

  const modals: {
    label: string;
    ref: React.MutableRefObject<HTMLDivElement | null>;
  }[] = [];
  // eslint-disable-next-line
  const textareas: {
    label: string;
    ref: React.MutableRefObject<HTMLTextAreaElement | null>;
  }[] = [];

  data.sections.forEach((sectionInfo) => {
    sectionInfo.inputs.forEach((inputInfo) => {
      // eslint-disable-next-line
      const modal = useRef<HTMLDivElement | null>(null);
      modals.push({
        label: sectionInfo.label + inputInfo.label,
        ref: modal,
      });
      // eslint-disable-next-line
      const textarea = useRef<HTMLTextAreaElement | null>(null);
      textareas.push({
        label: sectionInfo.label + inputInfo.label,
        ref: textarea,
      });
    });
  });

  const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  const api_url = process.env.API_URLs;

  /**
   * Prepare and send request to backend for file analysis
   * @returns data : the data retrieved from the backend
   */
  const analyse = async () => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    const data = await (
      await fetch(api_url + "/analyze", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers":
            "Origin, Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, locale",
          "Access-Control-Allow-Methods": "GET, POST",
        },
        body: formData,
      })
    ).json();
    return data;
  };

  useEffect(() => {
    // load imgs for the carousel
    const tmpUrls: { url: string; title: string }[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        tmpUrls.push({
          url: e!.target!.result as string,
          title: file.name,
        });
      };
      reader.onloadend = () => setUrls(tmpUrls);
      reader.readAsDataURL(file);
    });

    if (process.env.REACT_APP_ACTIVATE_USING_JSON == "true") {
      // skip backend take answer.json as answer
      fetch("/answer.json").then((res) =>
        res.json().then((response) => {
          data.sections.forEach((section) => {
            section.inputs.forEach((input) => {
              input.value =
                typeof response[section.label + "_" + input.label] == "string"
                  ? response[section.label + "_" + input.label]
                  : "";
            });
          });
          updateData();
        }),
      );
    } else {
      // fetch backend
      analyse()
        .then((response) => {
          data.sections.forEach((section) => {
            section.inputs.forEach((input) => {
              input.value =
                typeof response[section.label + "_" + input.label] == "string"
                  ? response[section.label + "_" + input.label]
                  : "";
            });
          });
          updateData();
        })
        .catch((e) => {
          setLoading(false);
          setError(e);
          console.log(e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateData = () => {
    // update data
    setData(data.copy());
    setLoading(false);
    console.log("just before update");

    //------------------------------ does this works and does it need to ------------------------------//
    // TODO
    document.querySelectorAll("textarea").forEach((elem) => {
      const nativeTAValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value",
      )!.set;
      const event = new Event("change", { bubbles: true });
      nativeTAValueSetter!.call(elem, elem.value + " ");
      elem.dispatchEvent(event);
      nativeTAValueSetter!.call(elem, elem.value.slice(0, -1));
      elem.dispatchEvent(event);
    });
  };

  const inputStates = data.sections.flatMap((section) =>
    section.inputs
      .filter((input) => input.value.length > 0)
      .map((input) => ({
        label: input.id,
      })),
  );

  const flash = (element: HTMLElement) => {
    let color = "black";
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      color = "white";
    }
    element.style.boxShadow = "0 0 10px 5px " + color;
    setTimeout(() => {
      element.style.boxShadow = "none";
    }, 500);
  };

  const give_focus = (input: Input) => {
    // focus on the selected section
    const element = document.getElementById(input.id) as HTMLElement;
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
      element.focus();
    }
  };

  const validateFormInputs = () => {
    console.log("Validating form inputs... ");
  
    // Flag to track if all sections are approved
    let rejected:Input[] = []
    // Iterate through each section and its inputs
    data.sections.forEach((section) => {
      section.inputs.forEach((input) => {

        // Check for specific validation criteria for each input 
        if(input.property == "approved"){
          
        }else{
          if(input.value.trim().length > 0){
            data.sections.find(currentSection=>currentSection.label == section.label)!.inputs.find(currentInput=>currentInput.label==input.label)!.property ="rejected";
            rejected.push(input);
            FormClickActions.emit("Rejected", input);
          }
        }
      });
    });
    if(rejected.length>0){
      give_focus(rejected[0]);
    }
    return rejected.length===0;
  };
  
  const navigate = useNavigate();
  const submitForm=(event:React.MouseEvent<HTMLButtonElement>)=>{
    let isValid = validateFormInputs();
    console.log(isValid)
    setData(data.copy())
    if(isValid){
      navigate("/Confirm", { state: { data: data } });
    }
  }
  

  useEffect(() => {
    textareas.forEach((textareaObj) => {
      if (textareaObj.ref.current) {
        resizeTextarea(textareaObj.ref.current);
      }
    });
    // eslint-disable-next-line
  }, [textareas]);

  const handleDataChange = (newSection: Section) => {
    const new_data = data.copy();
    new_data.sections.find((cur) => cur.label == newSection.label) !=
      newSection;
    setData(new_data);
  };

  return (
    <StrictMode>
      <div className="formPage-container">
        <div className="pic-container">
          <Carousel imgs={urls}></Carousel>
        </div>
        <div className="data-container">
          {loading ? (
            <div className={`loader-container-form ${loading ? "active" : ""}`}>
              <div className="spinner"></div>
              <p>
                Votre fichier est en cours d'analyse Your file is being analyzed
              </p>
            </div>
          ) : (
            <div>
              {[...data.sections].map((sectionInfo: Section, key: number) => {
                return (
                  <SectionComponent
                    key={key}
                    sectionInfo={sectionInfo}
                    textareas={textareas}
                    modals={modals}
                    imgs={urls}
                    propagateChange={handleDataChange}
                  ></SectionComponent>
                );
              })}
              <button className="button" onClick={submitForm}>
                Submit
              </button>
            </div>
          )}
        </div>
        {!loading ? (
          <div className="progress-wrapper">
            <ProgressBar sections={inputStates} />
          </div>
        ) : (
          <></>
        )}
      </div>
    </StrictMode>
  );
};

export default FormPage;
