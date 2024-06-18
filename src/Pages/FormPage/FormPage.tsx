import React, { useState, useRef, useEffect, StrictMode } from "react";
import "./FormPage.css";
import Modal from "../../Components/Modal/Modal";
import Carousel from "../../Components/Carousel/Carousel";
import { useLocation } from "react-router-dom";
import ProgressBar from "../../Components/ProgressBar/ProgressBar";
import editIcon from "../../assets/edit1.svg";
import acceptIcon from "../../assets/acceptIcon.svg";

class dataObject {
  sections: section[];
  constructor(sections: section[]) {
    this.sections = sections;
  }
  public push_section(newSections: section) {
    this.sections.push(newSections);
  }
  public remove_sections(toRemove: section) {
    this.sections = this.sections.filter((cur) => cur !== toRemove);
  }
  public copy() {
    return new dataObject(this.sections);
  }
}
class section {
  title: string;
  label: string;
  inputs: input[];
  constructor(title: string, label: string, inputs: input[]) {
    this.title = title;
    this.label = label;
    this.inputs = inputs;
  }
  public push_input(newInput: input) {
    this.inputs.push(newInput);
  }
  public remove_input(toRemove: input) {
    this.inputs = this.inputs.filter((cur) => cur !== toRemove);
  }
}
class input {
  [x: string]: string | boolean;
  label: string;
  value: string;
  approved: boolean = false;
  state: string;
  disable: boolean = false;
  cssClass: string = "";
  constructor(
    label: string,
    value: string,
    state: string = "empty",
    approved = false,
    disable = true,
  ) {
    this.label = label;
    this.value = value;
    this.state = state;
    this.approved = approved;
    this.disable = disable;
  }
}

const MAX_CHAR_IN_ROW = 37;

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
  const [uploadStarted, startUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  // @ts-expect-error : has to be used to prompt user when error
  // eslint-disable-next-line
  const [fetchError, setError] = useState<Error | null>(null);
  const [urls, setUrls] = useState<
    {
      url: string;
      title: string;
    }[]
  >([]);

  const [data, setData] = useState<dataObject>(
    new dataObject([
      new section("Company information", "company", [
        new input("name", form.company_name),
        new input("address", form.company_address),
        new input("website", form.company_website),
        new input("phone_number", form.company_phone_number),
      ]),
      new section("Manufacturer information", "manufacturer", [
        new input("name", form.manufacturer_name),
        new input("address", form.manufacturer_address),
        new input("website", form.manufacturer_website),
        new input("phone_number", form.manufacturer_phone_number),
      ]),
      new section("Fertiliser information", "fertiliser", [
        new input("name", form.fertiliser_name),
        new input("registration_number", form.fertiliser_registration_number),
        new input("lot_number", form.fertiliser_lot_number),
        new input("npk", form.fertiliser_npk),
        new input("precautionary_fr", form.fertiliser_precautionary_fr),
        new input("precautionary_en", form.fertiliser_precautionary_en),
        new input("instructions_fr", form.fertiliser_instructions_fr),
        new input("instructions_en", form.fertiliser_instructions_en),
        new input("ingredients_fr", form.fertiliser_ingredients_fr),
        new input("ingredients_en", form.fertiliser_ingredients_en),
        new input("specifications_fr", form.fertiliser_specifications_fr),
        new input("specifications_en", form.fertiliser_specifications_en),
        new input("cautions_fr", form.fertiliser_cautions_fr),
        new input("cautions_en", form.fertiliser_cautions_en),
        new input("recommendation_fr", form.fertiliser_recommendation_fr),
        new input("recommendation_en", form.fertiliser_recommendation_en),
        new input("first_aid_fr", form.fertiliser_first_aid_fr),
        new input("first_aid_en", form.fertiliser_first_aid_en),
        new input("warranty_fr", form.fertiliser_warranty_fr),
        new input("warranty_en", form.fertiliser_warranty_en),
        new input("guaranteed_analysis", form.fertiliser_guaranteed_analysis),
        new input(
          "nutrient_in_guaranteed_analysis",
          form.nutrient_in_guaranteed_analysis,
        ),
        new input(
          "percentage_in_guaranteed_analysis",
          form.percentage_in_guaranteed_analysis,
        ),
        new input("weight", form.fertiliser_weight),
        new input("density", form.fertiliser_density),
        new input("volume", form.fertiliser_volume),
        new input(
          "label_all_other_text_fr",
          form.fertiliser_label_all_other_text_fr,
        ),
        new input("all_other_text_fr_1", form.all_other_text_fr_1),
        new input("all_other_text_fr_2", form.all_other_text_fr_2),
        new input(
          "label_all_other_text_en",
          form.fertiliser_label_all_other_text_en,
        ),
        new input("all_other_text_en_1", form.all_other_text_en_1),
        new input("all_other_text_en_2", form.all_other_text_en_2),
      ]),
    ]),
  );

  const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  const modals: {
    label: string;
    ref: React.MutableRefObject<HTMLDivElement | null>;
  }[] = [];

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

  const handleClick_Modify = (inputInfo: input) => () => {
    console.log("Approved: ", inputInfo.label);
    setIsActive(true);
    inputInfo.state = "approved";
    inputInfo.disabled = false;
    inputInfo.approved = true;
    setData(data.copy());
    setTimeout(() => setIsActive(false), 400);
  };

  const handleClick_Approve = (inputInfo: input) => () => {
    console.log("modified: ", inputInfo.label);
    setIsActive(true);
    inputInfo.state = "modified";
    inputInfo.disabled = true;
    inputInfo.approved = false;
    setData(data.copy());
    setTimeout(() => setIsActive(false), 400);
  };

  const inputFactory = (parent: section, inputInfo: input) => {
    if (inputInfo.value == "") return;
    return (
      <div className="input-container">
        <label htmlFor={parent.label + "-" + inputInfo.label}>
          {parent.label.charAt(0).toUpperCase() + parent.label.slice(1)}{" "}
          {inputInfo.label.replace(/_/gi, " ")} :
        </label>
        <div className="textbox-container">
          <textarea
            id={parent.label + "-" + inputInfo.label}
            ref={
              textareas.find(
                (obj) => obj.label === parent.label + inputInfo.label,
              )?.ref
            }
            value={inputInfo.value}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              console.log(event);
              const current = event.target as HTMLTextAreaElement;
              resizeTextarea(current);
              inputInfo.value = event.target.value;
              setData(data.copy());
            }}
            onInput={(event: React.FormEvent<HTMLTextAreaElement>) => {
              const current = event.target as HTMLTextAreaElement;
              resizeTextarea(current); // Added here
            }}
            className="text-box"
            rows={1}
          />
          <div className="button-container">
            <button
              className={`button ${isActive ? "active" : ""}`}
              onClick={handleClick_Modify(inputInfo)}
            >
              <img src={acceptIcon} alt="Modifier" width="20" height="20" />
            </button>
            <button
              className={`button ${isActive ? "active" : ""}`}
              onClick={handleClick_Approve(inputInfo)}
            >
              <img src={editIcon} alt="Modifier" width="20" height="20" />
            </button>
          </div>
        </div>
        {/* Show more functionality moved here for better separation */}
        {inputInfo.value.split("\n").length +
          inputInfo.value
            .split("\n")
            .map((line) => Math.floor(line.length / MAX_CHAR_IN_ROW))
            .reduce((sum, current) => sum + current) >
          3 && (
          <div className="show-more-container">
            <label
              className="open-icon"
              onClick={() => {
                const modal = modals.find(
                  (modalObj) =>
                    modalObj.label === parent.label + inputInfo.label,
                );
                modal?.ref.current?.classList.add("active");
              }}
            >
              Show more
            </label>
            <Modal
              toRef={
                modals.find(
                  (modalObj) =>
                    modalObj.label === parent.label + inputInfo.label,
                )!.ref
              }
              text={inputInfo.value}
              handleTextChange={(event: {
                target: { value: React.SetStateAction<string> };
              }) => {
                inputInfo.value = event.target.value.toString();
                setData(data.copy());
              }}
              imgs={urls}
              close={() => {
                const modal = modals.find(
                  (modalObj) =>
                    modalObj.label === parent.label + inputInfo.label,
                );
                modal?.ref.current?.classList.remove("active");
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const sectionFactory = (sectionInfo: section) => {
    if (
      sectionInfo.inputs
        .map((input) => input.value)
        .reduce((total, current) => total + current) == ""
    )
      return;
    return (
      <div className={sectionInfo.label + "-container data-section"}>
        <h1 className="title underlined">{sectionInfo.title}</h1>
        {[...sectionInfo.inputs].map((inputInfo: input) => {
          return inputFactory(sectionInfo, inputInfo);
        })}
      </div>
    );
  };

  const api_url = "http://127.0.0.1:5000";

  const upload_all = async () => {
    const res = [];
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("image", files[i]);
      res.push(
        await fetch(api_url + "/upload", {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Headers":
              "Origin, Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, locale",
            "Access-Control-Allow-Methods": "GET, POST",
          },
          body: formData,
        }),
      );
    }
    return res;
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const poll_analyze = async () => {
    let data = await (
      await fetch(api_url + "/analyze", {
        method: "GET",
        headers: {},
      })
    ).json();
    while (data["Retry-after"]) {
      await sleep(data["Retry-after"] * 1000);
      data = await (
        await fetch(api_url + "/analyze", {
          method: "GET",
          headers: {},
        })
      ).json();
    }
    return data;
  };

  useEffect(() => {
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
          setData(data.copy());
          setLoading(false);
          console.log("just before update");
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
        }),
      );
    } else {
      if (!uploadStarted) {
        startUpload(true);
        upload_all()
          .then(() => {
            poll_analyze()
              .then((response) => {
                data.sections.forEach((section) => {
                  section.inputs.forEach((input) => {
                    input.value =
                      typeof response[section.label + "_" + input.label] ==
                      "string"
                        ? response[section.label + "_" + input.label]
                        : "";
                  });
                });
                setData(data.copy());
                setLoading(false);
                console.log("just before update");
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
              })
              .catch((e) => {
                setLoading(false);
                setError(e);
                console.log(e);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
  const handleTextareaSelection = (
    parent: section,
    inputInfo: input,
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    inputInfo.value = event.target.value;

    if (!inputInfo.approved) {
      inputInfo.state = "non-modified";
    } else if (inputInfo.approved) {
      inputInfo.state = "approved";
    } else if (inputInfo.value.length == 0) {
      //To be modified
      inputInfo.state = "empty";
    } else {
      inputInfo.state = "modified";
    }
    assessInputState(inputInfo);

    setData(data.copy());
  };
*/
  //To modify when we add buttons to the form
  const assessInputState = (input: input): input => {
    return input;
  };

  const inputStates = data.sections.flatMap((section) =>
    section.inputs
      .filter((input) => input.value.length > 0)
      .map((input) => ({
        state: assessInputState(input).state,
        label: `${section.label}-${input.label}`,
      })),
  );
  /**
   *
   */
  const validateFormInputs = () => {
    console.log("Validating form inputs... ");
    let allApproved = true;
    // Itérer à travers chaque section et chaque input pour vérifier et mettre à jour l'état d'approbation
    data.sections.forEach((section) => {
      section.inputs.forEach((input) => {
        if (input.approved) {
          input.cssClass = " ".trim();
        } else if (!input.approved) {
          allApproved = false;
          input.cssClass = "input-error";
        }
      });
    });
    setData(data.copy()); // Mettre à jour l'état pour refléter les changements
    return allApproved;
  };

  useEffect(() => {
    textareas.forEach((textareaObj) => {
      if (textareaObj.ref.current) {
        resizeTextarea(textareaObj.ref.current);
      }
    });
  }, [textareas]);

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
              {[...data.sections].map((sectionInfo: section) => {
                return sectionFactory(sectionInfo);
              })}
              <button className="button" onClick={validateFormInputs}>
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