import { useState, useEffect, StrictMode, useContext } from "react";
import "./FormPage.css";
import {
  SessionContext,
  SetSessionContext,
} from "../../Utils/SessionContext.tsx";
import Carousel from "../../Components/Carousel/Carousel.tsx";
import ProgressBar from "../../Components/ProgressBar/ProgressBar";
import SectionComponent from "../../Components/Section/Section.tsx";
import Section from "../../Model/Section-Model.tsx";
import Input from "../../Model/Input-Model.tsx";
import Data from "../../Model/Data-Model.tsx";
import { FormClickActions } from "../../Utils/EventChannels.tsx";
import { useTranslation } from "react-i18next";

const FormPage = () => {
  // For local development
  const api_url = "http://localhost:5000";
  const { t } = useTranslation();
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
    registration_number: "",
    lot_number: "",
    weight_kg: "",
    weight_lb: "",
    density: "",
    volume: "",
    npk: "",
    warranty: "",
    cautions_en: [],
    instructions_en: [],
    micronutrients_en: [],
    organic_ingredients_en: [],
    inert_ingredients_en: [],
    specifications_en: [],
    first_aid_en: [],
    cautions_fr: [],
    instructions_fr: [],
    micronutrients_fr: [],
    organic_ingredients_fr: [],
    inert_ingredients_fr: [],
    specifications_fr: [],
    first_aid_fr: [],
    guaranteed_analysis: [],
  });
  const { state } = useContext(SessionContext);
  const { setState } = useContext(SetSessionContext);
  const blobs = state.data.pics;
  const [loading, setLoading] = useState(true);
  const elementToFix = document.getElementById("carousel") as HTMLDivElement;
  // @ts-expect-error : has to be used to prompt user when error
  // eslint-disable-next-line
  const [fetchError, setError] = useState<Error | null>(null);
  const [urls, setUrls] = useState<
    {
      url: string;
      title: string;
    }[]
  >([]);
  let lastKnownScrollPosition = 0;
  let ticking = false;

  // This object describes how the formPage data will looks like
  const [data, setData] = useState<Data>(
    new Data([
      new Section(t("compagnieHeader"), "company", [
        new Input(t("name"), "company_name"),
        new Input(t("address"), "company_address"),
        new Input(t("website"), "company_website"),
        new Input(t("phone_number"), "company_phone_number"),
      ]),
      new Section(t("manufacturerHeader"), "manufacturer", [
        new Input(t("name"), "manufacturer_name"),
        new Input(t("address"), "manufacturer_address"),
        new Input(t("website"), "manufacturer_website"),
        new Input(t("phone_number"), "manufacturer_phone_number"),
      ]),
      new Section(t("productHeader"), "fertiliser", [
        new Input(t("name"), "fertiliser_name"),
        new Input(t("registrationNumber"), "registration_number"),
        new Input(t("lotNumber"), "lot_number"),
        new Input(t("weightKg"), "weight_kg"),
        new Input(t("weightLb"), "weight_lb"),
        new Input(t("density"), "density"),
        new Input(t("volume"), "volume"),
        new Input(t("npk"), "npk"),
        new Input(t("warranty"), "warranty"),
        new Input(t("cautions_en"), "cautions_en"),
        new Input(t("cautions_fr"), "cautions_fr"),
        new Input(t("instructions_en"), "instructions_en"),
        new Input(t("instructions_fr"), "instructions_fr"),
        new Input(t("micronutrients_en"), "micronutrients_en"),
        new Input(t("micronutrients_fr"), "micronutrients_fr"),
        new Input(t("organicIngredients_en"), "organic_ingredients_en"),
        new Input(t("organicIngredients_fr"), "organic_ingredients_fr"),
        new Input(t("inertIngredients_en"), "inert_ingredients_en"),
        new Input(t("inertIngredients_fr"), "inert_ingredients_fr"),
        new Input(t("specifications_en"), "specifications_en"),
        new Input(t("specifications_fr"), "specifications_fr"),
        new Input(t("firstAid_en"), "first_aid_en"),
        new Input(t("firstAid_fr"), "first_aid_fr"),
        new Input(t("guaranteedAnalysis"), "guaranteed_analysis"),
      ]),
    ]),
  );

  // command to approve all inputs only working in dev mode and always need to be put in comment before commit
  /*
  const approveAll = () => {
    data.sections.forEach((section) => {
      section.inputs.forEach((input) => {
        input.property = "approved";
        FormClickActions.emit("ApproveClick", input);
      });
    });
    updateData();
  };
  
  window.approveAll = approveAll;*/

  /**
   * Prepare and send request to backend for file analysis
   * @returns data : the data retrieved from the backend
   */
  const analyse = async () => {
    const formData = new FormData();
    for (let i = 0; i < blobs.length; i++) {
      const blobData = await fetch(blobs[i].blob).then((res) => res.blob());
      formData.append("images", blobData, blobs[i].name);
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

  // eslint-disable-next-line
  const populateForm = (response: any) => {
    data.sections.forEach((section) => {
      section.inputs.forEach((input) => {
        if (typeof response[input.id] == "string") {
          input.value = [response[input.id]];
        } else if (
          Array.isArray(response[input.id]) &&
          typeof response[input.id][0] == "string"
        ) {
          input.value = response[input.id];
          input.isAlreadyTable = true;
        } else if (
          Array.isArray(response[input.id]) &&
          typeof response[input.id][0] == "object"
        ) {
          input.value = response[input.id];
          input.isInputObjectList = true;
        }
      });
    });
    updateData();
    setState({ ...state, data: { pics: blobs, form: data } });
  };

  const updateData = () => {
    // update data
    setData(data.copy());
    setLoading(false);

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
    section.inputs.map((input) => ({
      label: input.id,
    })),
  );

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
    // Flag to track if all sections are approved
    const rejected: Input[] = [];
    // Iterate through each section and its inputs
    data.sections.forEach((section) => {
      section.inputs.forEach((input) => {
        // Check for specific validation criteria for each input
        // eslint-disable-next-line
        if (input.property == "approved") {
        } else {
          if (input.value.length > 0) {
            data.sections
              .find((currentSection) => currentSection.label == section.label)!
              .inputs.find(
                (currentInput) => currentInput.label == input.label,
              )!.property = "rejected";
            rejected.push(input as Input);
            FormClickActions.emit("Rejected", input);
          }
        }
      });
    });
    if (rejected.length > 0) {
      give_focus(rejected[0]);
    }
    return rejected.length === 0;
  };

  // eslint-disable-next-line
  const submitForm = () => {
    const isValid = validateFormInputs();
    setData(data.copy());
    setState({ ...state, data: { pics: blobs, form: data } });
    if (isValid) {
      setState({ ...state, state: "validation" });
    }
  };

  const handleDataChange = (newSection: Section) => {
    const new_data = data.copy();
    new_data.sections.find((cur) => cur.label == newSection.label) !=
      newSection;
    setData(new_data);
    setState({ ...state, data: { pics: blobs, form: new_data } });
  };

  function setElementPosition(scrollPos: number): void {
    elementToFix.style.transform = `translateY(${scrollPos}px)`;
  }

  useEffect(() => {
    // load imgs for the carousel
    const newUrls = blobs.map((blob) => ({ url: blob.blob, title: blob.name }));
    // Set the urls state only once with all the transformations
    setUrls(newUrls);

    // if no data in session, data has never been loaded and has to be fetched
    if (state.data.form.sections.length == 0) {
      if (process.env.REACT_APP_ACTIVATE_USING_JSON == "true") {
        // skip backend take answer.json as answer
        fetch("/answer.json").then((res) => res.json().then(populateForm));
      } else {
        // fetch backend
        analyse()
          .then(populateForm)
          .catch((e) => {
            setLoading(false);
            setError(e);
            console.log(e);
          });
      }
    } else {
      state.data.form.sections.forEach((stateSection) => {
        data.sections
          .find((currentSection) => currentSection.label == stateSection.label)!
          .inputs.forEach((input) => {
            const stateInput = stateSection.inputs.find(
              (currentInput: Input) => currentInput.id == input.id,
            )!;
            input.value = stateInput.value;
            input.isAlreadyTable = stateInput.isAlreadyTable;
            input.isInputObjectList = stateInput.isInputObjectList;
            input.property = stateInput.property;
            input.disabled = stateInput.disabled;
          });
      });
      setData(data.copy());
      updateData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  window.addEventListener("scroll", function () {
    lastKnownScrollPosition = window.scrollY;

    if (!ticking) {
      if (this.window.innerWidth < 1230) {
        return;
      }
      window.requestAnimationFrame(function () {
        setElementPosition(lastKnownScrollPosition);
        ticking = false;
      });

      ticking = true;
    }
  });

  return (
    <StrictMode>
      <div className={"formPage-container ${theme}"}>
        <Carousel id="carousel" imgs={urls}></Carousel>
        <div className="data-container">
          {loading ? (
            <div
              className={`loader-container-form ${loading ? "active " : ""}`}
            >
              <div className="spinner"></div>
              <p>{t("analyzingText")}</p>
            </div>
          ) : (
            <div>
              {[...data.sections].map((sectionInfo: Section, key: number) => {
                return (
                  <SectionComponent
                    key={key}
                    sectionInfo={sectionInfo}
                    imgs={urls}
                    propagateChange={handleDataChange}
                  ></SectionComponent>
                );
              })}
              <button className="submit-button" onClick={submitForm}>
                {t("submitButton")}
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
