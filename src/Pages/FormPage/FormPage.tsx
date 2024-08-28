import {StrictMode, useContext, useEffect, useRef, useState} from "react";
import "./FormPage.css";
import {SessionContext, SetSessionContext,} from "../../Utils/SessionContext.tsx";
import Carousel from "../../Components/Carousel/Carousel.tsx";
import ProgressBar from "../../Components/ProgressBar/ProgressBar";
import SectionComponent from "../../Components/Section/Section.tsx";
import Section from "../../Model/Section-Model.tsx";
import Input from "../../Model/Input-Model.tsx";
import Data from "../../Model/Data-Model.tsx";
import {FormClickActions} from "../../Utils/EventChannels.tsx";
import {useTranslation} from "react-i18next";
import goUpIcon from "../../assets/goUpIcon.svg";
import {FertiliserForm, populateFromJSON} from "../../Utils/FormCreator.ts";

const FormPage = () => {
  // For local development
  const api_url = "http://localhost:5000";
  const { t } = useTranslation();
  const dataContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollUp, setShowScrollUp] = useState(false);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const shouldShow = target.scrollTop > 10;
    setShowScrollUp(shouldShow);
  };

  const scrollToTop = () => {
    if (dataContainerRef.current) {
      dataContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const { state } = useContext(SessionContext);
  const { setState } = useContext(SetSessionContext);
  const blobs = state.data.pics;
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

  // This object describes how the formPage data will looks like
  const [data, setData] = useState<Data>(FertiliserForm());
  /**
  // command to approve all inputs only working in dev mode and always need to be put in comment before commit
  const approveAll = () => {
    data.sections.forEach((section) => {
      section.inputs.forEach((input) => {
        input.property = "approved";
        FormClickActions.emit("ApproveClick", input);
      });
    });
    updateData();
  };

  window.approveAll = approveAll;
  */
  /**
   * Prepare and send request to backend for file analysis
   * @returns data : the data retrieved from the backend
   */
  const analyse = async () => {
    const formData = new FormData();
    for (let i = 0; i < blobs.length; i++) {
      const blob = await fetch(blobs[i].blob).then((r) => r.blob());
      formData.append("images", blob, blobs[i].name);
    }

    return await (
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
  };

  const setForm = (response: unknown) => {
    setData(populateFromJSON(data, response));
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

  useEffect(() => {
    // load imgs for the carousel
    const newUrls = blobs.map((blob) => ({ url: blob.blob, title: blob.name }));
    // Set the urls state only once with all the transformations
    setUrls(newUrls);

    // if no data in session, data has never been loaded and has to be fetched
    if (state.data.form.sections.length == 0) {
      if (process.env.REACT_APP_ACTIVATE_USING_JSON == "true") {
        // skip backend take answer.json as answer
        fetch("/answer.json").then((res) => res.json().then(setForm));
      } else {
        // fetch backend
        analyse()
          .then(setForm)
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

  return (
    <StrictMode>
      <div className={"formPage-container ${theme} disable-scroll"}>
        <Carousel id="carousel" imgs={urls}></Carousel>
        <div
          id="data-container"
          className="data-container"
          ref={dataContainerRef}
          onScroll={handleScroll}
        >
          <div className="background">
            {[...data.sections].map((sectionInfo: Section, key: number) => {
              return (
                <SectionComponent
                  key={key}
                  sectionInfo={sectionInfo}
                  imgs={urls}
                  propagateChange={handleDataChange}
                  isLoading={loading}
                ></SectionComponent>
              );
            })}
            <button className="submit-button" onClick={submitForm}>
              {t("submitButton")}
            </button>
          </div>
        </div>
        {!loading ? (
          <div className="progress-wrapper">
            {showScrollUp && (
              <button className="button-top" onClick={scrollToTop}>
                <img src={goUpIcon} alt="Go Up" />
              </button>
            )}
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
